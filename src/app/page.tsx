"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Code2,
  Cpu,
  TestTube2,
  Bot,
  Sparkles,
  ExternalLink,
  Globe,
  Linkedin,
  Github,
  Mail,
  ChevronRight,
  Zap,
  Terminal,
  BrainCircuit,
  BookOpen,
  Award,
  Settings,
  FileDown,
  BadgeCheck,
} from "lucide-react";
import Link from "next/link";
import type { PortfolioConfig } from "@/config/portfolio";
import defaultConfig from "@/config/portfolio";

// Icon mapping for dynamic rendering
const iconMap: { [key: string]: React.ReactNode } = {
  TestTube2: <TestTube2 size={16} />,
  Globe: <Globe size={16} />,
  Terminal: <Terminal size={16} />,
  Code2: <Code2 size={16} />,
  Cpu: <Cpu size={16} />,
  BrainCircuit: <BrainCircuit size={16} />,
  Zap: <Zap size={16} />,
};

// ============================================
// BACKGROUND COMPONENT - Interactive Grid
// ============================================
const InteractiveBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 3;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const dots: { x: number; y: number; baseX: number; baseY: number }[] = [];
    const spacing = 50;

    for (let x = 0; x < canvas.width; x += spacing) {
      for (let y = 0; y < canvas.height; y += spacing) {
        dots.push({ x, y, baseX: x, baseY: y });
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY + window.scrollY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    let animationId: number;

    const animate = () => {
      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      dots.forEach((dot) => {
        const dx = mousePos.current.x - dot.baseX;
        const dy = mousePos.current.y - dot.baseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;

        if (distance < maxDistance && distance > 0.1) {
          const force = (1 - distance / maxDistance) * 15;
          dot.x = dot.baseX + (dx / distance) * force;
          dot.y = dot.baseY + (dy / distance) * force;
        } else {
          dot.x += (dot.baseX - dot.x) * 0.1;
          dot.y += (dot.baseY - dot.y) * 0.1;
        }

        if (!isFinite(dot.x) || !isFinite(dot.y)) {
          dot.x = dot.baseX;
          dot.y = dot.baseY;
        }

        const opacity = distance < maxDistance ? 0.6 : 0.15;
        const size = distance < maxDistance ? 2 : 1;
        const gradientRadius = Math.max(size * 2, 0.1);

        const gradient = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, gradientRadius);
        gradient.addColorStop(0, `rgba(0, 212, 255, ${opacity})`);
        gradient.addColorStop(1, `rgba(139, 92, 246, ${opacity * 0.5})`);

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
};

// ============================================
// GLASSMORPHISM CARD COMPONENT
// ============================================
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  delay?: number;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  glowColor = "cyber-blue",
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className={`
        relative overflow-hidden rounded-2xl
        bg-gradient-to-br from-white/5 to-white/[0.02]
        backdrop-blur-xl border border-white/10
        hover:border-${glowColor}/50
        hover:shadow-lg hover:shadow-${glowColor}/20
        transition-all duration-300
        ${className}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-blue/5 via-transparent to-cyber-violet/5 opacity-0 hover:opacity-100 transition-opacity duration-500" />
      {children}
    </motion.div>
  );
};

// ============================================
// TIMELINE ITEM COMPONENT
// ============================================
interface TimelineItemProps {
  year: string;
  title: string;
  company: string;
  description: string;
  isActive?: boolean;
  delay?: number;
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  year,
  title,
  company,
  description,
  isActive = false,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="relative pl-8 pb-8 border-l border-white/10 last:pb-0"
    >
      <div
        className={`
        absolute left-0 top-0 w-4 h-4 -translate-x-1/2 rounded-full
        ${isActive ? "bg-cyber-blue animate-glow-pulse" : "bg-cyber-violet/50"}
        border-2 border-slate-950
      `}
      />
      <div className="text-cyber-blue text-sm font-mono mb-1">{year}</div>
      <h4 className="text-white text-lg font-semibold mb-1">{title}</h4>
      <div className="text-cyber-violet font-medium mb-2">{company}</div>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
};

// ============================================
// STATUS BADGE COMPONENT
// ============================================
const StatusBadge: React.FC<{ text: string }> = ({ text }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber-emerald/10 border border-cyber-emerald/30"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-emerald opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-emerald"></span>
      </span>
      <span className="text-cyber-emerald text-sm font-medium">{text}</span>
    </motion.div>
  );
};

// ============================================
// MAIN PORTFOLIO COMPONENT
// ============================================
export default function Portfolio() {
  const [config, setConfig] = useState<PortfolioConfig>(defaultConfig);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Load config from API on mount
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch("/api/portfolio");
        if (res.ok) {
          const data = await res.json();
          setConfig(data);
        }
      } catch (error) {
        console.log("Using default config");
      }
    };
    loadConfig();
  }, []);

  const gradientColors = [
    "from-cyber-blue to-cyber-violet",
    "from-cyber-violet to-cyber-pink",
    "from-cyber-emerald to-cyber-blue",
  ];

  return (
    <div className="min-h-screen bg-jet-black text-white overflow-x-hidden">
      <InteractiveBackground />

      {/* Admin Link */}
      <Link
        href="/admin"
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyber-blue/50 transition-all group"
        title="Painel Admin"
      >
        <Settings className="text-gray-400 group-hover:text-cyber-blue transition-colors" size={20} />
      </Link>

      {/* ============================================ */}
      {/* HERO SECTION */}
      {/* ============================================ */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <motion.div style={{ opacity }} className="absolute top-8 right-8 z-20">
          <StatusBadge text={config.personal.statusBadge} />
        </motion.div>

        <div className="max-w-5xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-cyber-violet/10 border border-cyber-violet/30 text-cyber-violet text-sm font-mono mb-6">
              {config.personal.tagline}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              {config.personal.firstName}
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyber-blue via-cyber-violet to-cyber-pink bg-clip-text text-transparent">
              {config.personal.lastName}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            {config.personal.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4 relative z-10 mb-12 md:mb-0"
          >
            <motion.a
              href="#projetos"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyber-blue to-cyber-violet text-white font-semibold shadow-lg shadow-cyber-blue/25 hover:shadow-xl hover:shadow-cyber-blue/40 transition-all duration-300"
            >
              <Sparkles size={20} />
              Ver Projetos
              <ChevronRight size={18} />
            </motion.a>
            <Link href="/resume">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/5 border border-cyber-blue/30 text-cyber-blue font-semibold hover:bg-cyber-blue/10 hover:border-cyber-blue/50 hover:shadow-lg hover:shadow-cyber-blue/20 transition-all duration-300"
              >
                <FileDown size={20} />
                Baixar CV
              </motion.div>
            </Link>
            <motion.a
              href="#contato"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/5 border border-white/20 text-white font-semibold hover:bg-white/10 hover:border-white/40 transition-all duration-300"
            >
              <Mail size={20} />
              Contato
            </motion.a>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:block"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1"
            >
              <motion.div className="w-1.5 h-3 bg-cyber-blue rounded-full" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* BENTO GRID - FEATURED PROJECT */}
      {/* ============================================ */}
      <section id="projetos" className="relative py-24 px-6 z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyber-blue to-cyber-violet bg-clip-text text-transparent">
                Destaque
              </span>
            </h2>
            <p className="text-gray-400 text-lg">Projeto principal e inovador</p>
          </motion.div>

          {/* Featured Project Card - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyber-blue via-cyber-violet to-cyber-pink rounded-3xl opacity-50 group-hover:opacity-100 blur-lg transition-all duration-500" />
            <div className="relative bg-gradient-to-br from-slate-900/90 to-jet-black rounded-3xl p-8 md:p-12 border border-white/10 backdrop-blur-xl">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-blue/10 border border-cyber-blue/30 text-cyber-blue text-xs font-mono mb-4">
                    <Bot size={14} />
                    AI-POWERED
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                    {config.project.name}
                    <br />
                    <span className="text-cyber-violet">{config.project.subtitle}</span>
                  </h3>
                  <p className="text-gray-400 text-lg leading-relaxed mb-6">
                    {config.project.description}
                  </p>

                  <div className="flex flex-wrap gap-3 mb-6">
                    {config.project.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.02 }}
                    className="inline-flex items-center gap-2 text-cyber-blue hover:text-cyber-violet transition-colors"
                  >
                    <span className="font-medium">Ver Mais</span>
                    <ExternalLink size={18} />
                  </motion.a>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyber-blue/20 to-cyber-violet/20 rounded-2xl blur-2xl" />
                  <div className="relative bg-slate-900/80 rounded-2xl p-6 border border-white/10 font-mono text-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="ml-4 text-gray-500 text-xs">
                        {config.project.codeExample.filename}
                      </span>
                    </div>
                    <pre className="text-gray-300 overflow-x-auto whitespace-pre-wrap">
                      <code>{config.project.codeExample.content}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* BENTO GRID - MAIN SECTIONS */}
      {/* ============================================ */}
      <section className="relative py-12 px-6 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tech Stack Card */}
            <GlassCard className="lg:col-span-2 p-8" delay={0.1}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-cyber-blue/10">
                  <Cpu className="text-cyber-blue" size={24} />
                </div>
                <h3 className="text-2xl font-bold">Tech Stack</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {config.techStack.map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.1, boxShadow: "0 0 25px rgba(0, 212, 255, 0.5)" }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyber-blue/20 to-cyber-violet/10 border border-cyber-blue/30 text-cyber-blue text-sm font-medium shadow-lg shadow-cyber-blue/10 hover:shadow-xl hover:shadow-cyber-blue/30 transition-all duration-300 cursor-default"
                  >
                    {iconMap[tech.icon] || <Code2 size={16} />}
                    <span>{tech.name}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            {/* Learning Badge Card */}
            <GlassCard className="p-8" delay={0.2}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-cyber-emerald/10">
                  <BookOpen className="text-cyber-emerald" size={24} />
                </div>
                <h3 className="text-2xl font-bold">{config.learning.title}</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Award className="text-cyber-violet" size={20} />
                  <span className="text-gray-300">{config.learning.subtitle}</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${config.learning.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-gradient-to-r from-cyber-blue to-cyber-violet h-2 rounded-full"
                  />
                </div>
                <p className="text-gray-500 text-sm">{config.learning.level}</p>
              </div>
            </GlassCard>

            {/* Experience Timeline Card */}
            <GlassCard className="lg:col-span-2 p-8" delay={0.3}>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-lg bg-cyber-violet/10">
                  <Zap className="text-cyber-violet" size={24} />
                </div>
                <h3 className="text-2xl font-bold">Experiência Profissional</h3>
              </div>
              <div className="space-y-0">
                {config.experience.map((exp, index) => (
                  <TimelineItem
                    key={index}
                    year={exp.year}
                    title={exp.title}
                    company={exp.company}
                    description={exp.description}
                    isActive={exp.isActive}
                    delay={index * 0.2}
                  />
                ))}
              </div>
            </GlassCard>

            {/* Quick Stats Card */}
            <GlassCard className="p-8" delay={0.4}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-cyber-pink/10">
                  <Terminal className="text-cyber-pink" size={24} />
                </div>
                <h3 className="text-2xl font-bold">Métricas</h3>
              </div>
              <div className="space-y-6">
                {config.metrics.map((metric, index) => (
                  <div key={index}>
                    <div
                      className={`text-4xl font-bold bg-gradient-to-r ${gradientColors[index % gradientColors.length]
                        } bg-clip-text text-transparent`}
                    >
                      {metric.value}
                    </div>
                    <div className="text-gray-400">{metric.label}</div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Certifications Card */}
            {config.certifications && config.certifications.length > 0 && (
              <GlassCard className="lg:col-span-3 p-8" delay={0.5}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-cyber-blue/10">
                    <BadgeCheck className="text-cyber-blue" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold">Certificações</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {config.certifications.map((cert, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 rounded-xl bg-gradient-to-br from-cyber-blue/10 to-cyber-violet/10 border border-white/10 hover:border-cyber-blue/30 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-cyber-emerald/10 flex-shrink-0">
                          <Award className="text-cyber-emerald" size={20} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white text-sm mb-1">
                            {cert.name}
                          </h4>
                          <p className="text-gray-400 text-xs">
                            {cert.issuer} • {cert.year}
                          </p>
                          {cert.credentialUrl && (
                            <a
                              href={cert.credentialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-cyber-blue text-xs mt-2 hover:text-cyber-violet transition-colors"
                            >
                              Ver Credencial
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            )}

            {/* Qualifications Card */}
            {config.qualifications && config.qualifications.length > 0 && (
              <GlassCard className="lg:col-span-3 p-8" delay={0.6}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-cyber-violet/10">
                    <BookOpen className="text-cyber-violet" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold">Qualificações</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {config.qualifications.map((qual, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 rounded-xl bg-gradient-to-br from-cyber-violet/10 to-cyber-pink/10 border border-white/10 hover:border-cyber-violet/30 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-cyber-pink/10 flex-shrink-0">
                          {qual.type === "graduation" ? (
                            <Award className="text-cyber-pink" size={20} />
                          ) : (
                            <BookOpen className="text-cyber-pink" size={20} />
                          )}
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-cyber-violet/80 font-medium">
                            {qual.type === "graduation" ? "Graduação" :
                              qual.type === "postgraduate" ? "Pós-graduação" :
                                qual.type === "masters" ? "Mestrado" :
                                  qual.type === "doctorate" ? "Doutorado" :
                                    qual.type === "bootcamp" ? "Bootcamp" :
                                      qual.type === "course" ? "Curso" : "Especialização"}
                          </span>
                          <h4 className="font-semibold text-white text-sm mb-1">
                            {qual.title}
                          </h4>
                          <p className="text-gray-400 text-xs">
                            {qual.institution} • {qual.year}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* CONTACT SECTION */}
      {/* ============================================ */}
      <section id="contato" className="relative py-24 px-6 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyber-blue to-cyber-violet bg-clip-text text-transparent">
                Vamos Conversar?
              </span>
            </h2>
            <p className="text-gray-400 text-lg mb-12">
              Estou sempre aberto a novos projetos e desafios
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-6"
          >
            <motion.a
              href={config.personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -5 }}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyber-blue/50 hover:shadow-lg hover:shadow-cyber-blue/20 transition-all duration-300"
            >
              <Linkedin className="text-cyber-blue" size={32} />
            </motion.a>
            <motion.a
              href={`https://wa.me/${config.personal.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -5 }}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyber-emerald/50 hover:shadow-lg hover:shadow-cyber-emerald/20 transition-all duration-300"
              title="WhatsApp"
            >
              <svg className="text-cyber-emerald" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </motion.a>
            <motion.a
              href={config.personal.github}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -5 }}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyber-violet/50 hover:shadow-lg hover:shadow-cyber-violet/20 transition-all duration-300"
            >
              <Github className="text-cyber-violet" size={32} />
            </motion.a>
            <motion.a
              href={`mailto:${config.personal.email}`}
              whileHover={{ scale: 1.1, y: -5 }}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyber-pink/50 hover:shadow-lg hover:shadow-cyber-pink/20 transition-all duration-300"
            >
              <Mail className="text-cyber-pink" size={32} />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FOOTER */}
      {/* ============================================ */}
      <footer className="relative py-12 px-6 border-t border-white/5 z-10">
        <div className="max-w-7xl mx-auto">
          {/* AI Badge Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyber-blue/10 via-cyber-violet/10 to-cyber-pink/10 border border-white/10">
              <div className="flex items-center gap-2">
                <BrainCircuit className="text-cyber-blue" size={20} />
                <span className="text-gray-300 text-sm">
                  <span className="text-cyber-blue font-semibold">AI-Engineered</span>
                  {" "}• Este site foi 100% construído com{" "}
                  <span className="text-cyber-violet font-medium">prompts estruturados</span>
                  {" "}e{" "}
                  <span className="text-cyber-emerald font-medium">engenharia de IA</span>
                </span>
              </div>
            </div>
          </motion.div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-500 text-sm">
              © 2026 {config.personal.firstName} {config.personal.lastName}. Crafted with{" "}
              <span className="text-cyber-blue">código</span> and{" "}
              <span className="text-cyber-pink">AI</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <span>Built with</span>
              <span className="text-cyber-blue font-mono">Next.js</span>
              <span>+</span>
              <span className="text-cyber-violet font-mono">Tailwind</span>
              <span>+</span>
              <span className="text-cyber-emerald font-mono">AI Prompts</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
