"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
    Download,
    ArrowLeft,
    Mail,
    Phone,
    Linkedin,
    Github,
    MapPin,
    Award,
    Briefcase,
    Code2,
    GraduationCap,
    Rocket,
    BookOpen,
} from "lucide-react";
import Link from "next/link";
import type { PortfolioConfig } from "@/config/portfolio";
import defaultConfig from "@/config/portfolio";

export default function ResumePage() {
    const [config, setConfig] = useState<PortfolioConfig>(defaultConfig);
    const [isGenerating, setIsGenerating] = useState(false);
    const resumeRef = useRef<HTMLDivElement>(null);

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

    const generatePDF = async () => {
        if (!resumeRef.current) return;

        setIsGenerating(true);

        try {
            const html2canvas = (await import("html2canvas")).default;
            const jsPDF = (await import("jspdf")).default;

            const canvas = await html2canvas(resumeRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#ffffff",
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            });

            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
            pdf.save(`${config.personal.firstName}_${config.personal.lastName}_CV.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
        }

        setIsGenerating(false);
    };

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-xl font-bold text-white">Currículo / Resume</h1>
                    </div>
                    <button
                        onClick={generatePDF}
                        disabled={isGenerating}
                        className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-cyber-blue to-cyber-violet text-white font-semibold hover:shadow-lg hover:shadow-cyber-blue/25 transition-all disabled:opacity-50"
                    >
                        {isGenerating ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Gerando...
                            </>
                        ) : (
                            <>
                                <Download size={18} />
                                Baixar PDF
                            </>
                        )}
                    </button>
                </div>
            </header>

            <div className="max-w-4xl mx-auto py-8 px-6">
                {/* Resume Preview */}
                <div
                    ref={resumeRef}
                    className="bg-white text-gray-900 rounded-lg shadow-2xl p-12"
                    style={{ fontFamily: "Arial, sans-serif" }}
                >
                    {/* Header */}
                    <div className="border-b-2 border-blue-600 pb-6 mb-6">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            {config.personal.firstName} {config.personal.lastName}
                        </h1>
                        <h2 className="text-xl text-blue-600 font-medium mb-4">
                            {config.personal.role}
                        </h2>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <Mail size={14} />
                                {config.personal.email}
                            </div>
                            <div className="flex items-center gap-1">
                                <Phone size={14} />
                                +{config.personal.phone.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, "$1 ($2) $3-$4")}
                            </div>
                            {config.personal.location && (
                                <div className="flex items-center gap-1">
                                    <MapPin size={14} />
                                    {config.personal.location}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
                            <div className="flex items-center gap-1">
                                <Linkedin size={14} />
                                LinkedIn
                            </div>
                            <div className="flex items-center gap-1">
                                <Github size={14} />
                                GitHub
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <span className="w-8 h-0.5 bg-blue-600"></span>
                            Resumo Profissional
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                            {config.personal.description}
                        </p>
                    </div>

                    {/* Experience */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Briefcase size={18} className="text-blue-600" />
                            Experiência Profissional
                        </h3>
                        {config.experience.map((exp, index) => (
                            <div key={index} className="mb-4 last:mb-0">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-gray-900">{exp.title}</h4>
                                        <p className="text-blue-600 font-medium">{exp.company}</p>
                                    </div>
                                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                        {exp.year}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm mt-1">{exp.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Qualifications */}
                    {config.qualifications && config.qualifications.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <GraduationCap size={18} className="text-blue-600" />
                                Formação Acadêmica
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {config.qualifications.map((qual, index) => (
                                    <div key={index} className="border-l-2 border-blue-600 pl-3">
                                        <h4 className="font-bold text-gray-900 text-sm">{qual.title}</h4>
                                        <p className="text-gray-600 text-xs">
                                            {qual.institution} • {qual.year}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Certifications */}
                    {config.certifications && config.certifications.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Award size={18} className="text-blue-600" />
                                Certificações
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {config.certifications.map((cert, index) => (
                                    <div key={index} className="border-l-2 border-blue-600 pl-3">
                                        <h4 className="font-bold text-gray-900 text-sm">{cert.name}</h4>
                                        <p className="text-gray-600 text-xs">
                                            {cert.issuer} • {cert.year}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tech Stack */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Code2 size={18} className="text-blue-600" />
                            Habilidades Técnicas
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {config.techStack.map((tech, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                                >
                                    {tech.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Projects */}
                    {config.project && (
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Rocket size={18} className="text-blue-600" />
                                Projeto em Destaque
                            </h3>
                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-gray-900">{config.project.name}</h4>
                                        <p className="text-blue-600 text-sm font-medium">{config.project.subtitle}</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm mb-3">{config.project.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {config.project.features.map((feature, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-white border border-gray-200 text-gray-600 rounded text-xs font-medium">
                                            {feature}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Languages / Learning */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <BookOpen size={18} className="text-blue-600" />
                            Idiomas e Aprendizados
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="border-l-2 border-blue-600 pl-3">
                                <h4 className="font-bold text-gray-900 text-sm">Idiomas</h4>
                                <p className="text-gray-600 text-xs mt-1">
                                    <span className="font-medium">Português:</span> Nativo<br/>
                                    <span className="font-medium">Inglês:</span> {config.learning.level}
                                </p>
                            </div>
                            <div className="border-l-2 border-blue-600 pl-3">
                                <h4 className="font-bold text-gray-900 text-sm">{config.learning.title}</h4>
                                <p className="text-gray-600 text-xs mt-1">
                                    {config.learning.subtitle}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-gray-500 text-sm mt-8"
                >
                    Clique em "Baixar PDF" para salvar seu currículo formatado
                </motion.p>
            </div>
        </div>
    );
}
