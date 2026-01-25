"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Save,
    Lock,
    Unlock,
    User,
    Briefcase,
    Code2,
    Award,
    BarChart3,
    Plus,
    Trash2,
    ArrowLeft,
    Check,
    AlertCircle,
    BadgeCheck,
    GraduationCap,
} from "lucide-react";
import Link from "next/link";
import type { PortfolioConfig } from "@/config/portfolio";

// ============================================
// ADMIN PANEL - Painel de Administração
// ============================================

export default function AdminPanel() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [config, setConfig] = useState<PortfolioConfig | null>(null);
    const [loading, setLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
    const [activeTab, setActiveTab] = useState("personal");
    const [isProduction, setIsProduction] = useState(false);

    // Carrega os dados ao autenticar
    useEffect(() => {
        // Verifica se está em produção
        if (typeof window !== "undefined") {
            const hostname = window.location.hostname;
            setIsProduction(hostname !== "localhost" && hostname !== "127.0.0.1");
        }

        if (isAuthenticated) {
            loadConfig();
        }
    }, [isAuthenticated]);

    const loadConfig = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/portfolio");
            const data = await res.json();
            setConfig(data);
        } catch (error) {
            console.error("Erro ao carregar configuração:", error);
        }
        setLoading(false);
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "mferreio.qa") {
            setIsAuthenticated(true);
        } else {
            alert("Senha incorreta!");
        }
    };

    const handleSave = async () => {
        if (!config) return;
        if (isProduction) {
            alert("Em produção, a edição deve ser feita localmente e enviada via Git.");
            return;
        }

        setSaveStatus("saving");
        try {
            const res = await fetch("/api/portfolio", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-admin-password": password,
                },
                body: JSON.stringify(config),
            });

            if (res.ok) {
                setSaveStatus("success");
                setTimeout(() => setSaveStatus("idle"), 3000);
            } else {
                setSaveStatus("error");
            }
        } catch (error) {
            setSaveStatus("error");
        }
    };

    const updateConfig = (path: string, value: any) => {
        if (!config) return;

        const keys = path.split(".");
        const newConfig = { ...config };
        let current: any = newConfig;

        for (let i = 0; i < keys.length - 1; i++) {
            if (keys[i].includes("[")) {
                const [key, indexStr] = keys[i].split("[");
                const index = parseInt(indexStr.replace("]", ""));
                current[key] = [...current[key]];
                current = current[key][index];
            } else {
                current[keys[i]] = { ...current[keys[i]] };
                current = current[keys[i]];
            }
        }

        const lastKey = keys[keys.length - 1];
        if (lastKey.includes("[")) {
            const [key, indexStr] = lastKey.split("[");
            const index = parseInt(indexStr.replace("]", ""));
            current[key][index] = value;
        } else {
            current[lastKey] = value;
        }

        setConfig(newConfig);
    };

    const addExperience = () => {
        if (!config) return;
        setConfig({
            ...config,
            experience: [
                ...config.experience,
                {
                    year: "20XX - 20XX",
                    title: "Novo Cargo",
                    company: "Empresa",
                    description: "Descrição do cargo...",
                    isActive: false,
                },
            ],
        });
    };

    const removeExperience = (index: number) => {
        if (!config) return;
        setConfig({
            ...config,
            experience: config.experience.filter((_, i) => i !== index),
        });
    };

    const addTech = () => {
        if (!config) return;
        setConfig({
            ...config,
            techStack: [...config.techStack, { name: "Nova Tech", icon: "Code2" }],
        });
    };

    const removeTech = (index: number) => {
        if (!config) return;
        setConfig({
            ...config,
            techStack: config.techStack.filter((_, i) => i !== index),
        });
    };

    const addMetric = () => {
        if (!config) return;
        setConfig({
            ...config,
            metrics: [...config.metrics, { value: "0+", label: "Nova Métrica" }],
        });
    };

    const removeMetric = (index: number) => {
        if (!config) return;
        setConfig({
            ...config,
            metrics: config.metrics.filter((_, i) => i !== index),
        });
    };

    const addCertification = () => {
        if (!config) return;
        const certs = config.certifications || [];
        setConfig({
            ...config,
            certifications: [
                ...certs,
                {
                    name: "Nova Certificação",
                    issuer: "Emissor",
                    year: "2024",
                    credentialUrl: "",
                },
            ],
        });
    };

    const removeCertification = (index: number) => {
        if (!config) return;
        setConfig({
            ...config,
            certifications: (config.certifications || []).filter((_, i) => i !== index),
        });
    };

    const addQualification = () => {
        if (!config) return;
        const quals = config.qualifications || [];
        setConfig({
            ...config,
            qualifications: [
                ...quals,
                {
                    title: "Nova Qualificação",
                    institution: "Instituição",
                    year: "2024",
                    type: "course",
                },
            ],
        });
    };

    const removeQualification = (index: number) => {
        if (!config) return;
        setConfig({
            ...config,
            qualifications: (config.qualifications || []).filter((_, i) => i !== index),
        });
    };

    // ============================================
    // LOGIN SCREEN
    // ============================================
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
                        <div className="flex items-center justify-center mb-8">
                            <div className="p-4 rounded-full bg-cyber-blue/10 border border-cyber-blue/30">
                                <Lock className="text-cyber-blue" size={32} />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-center text-white mb-2">
                            Painel Admin
                        </h1>
                        <p className="text-gray-400 text-center mb-8">
                            Digite a senha para acessar
                        </p>
                        <form onSubmit={handleLogin}>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Senha de administrador"
                                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white placeholder-gray-500 focus:border-cyber-blue/50 focus:outline-none focus:ring-2 focus:ring-cyber-blue/20 transition-all mb-4"
                            />
                            <button
                                type="submit"
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyber-blue to-cyber-violet text-white font-semibold hover:shadow-lg hover:shadow-cyber-blue/25 transition-all"
                            >
                                <Unlock className="inline mr-2" size={18} />
                                Entrar
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        );
    }

    // ============================================
    // ADMIN DASHBOARD
    // ============================================
    const tabs = [
        { id: "personal", label: "Pessoal", icon: User },
        { id: "project", label: "Projeto", icon: Code2 },
        { id: "experience", label: "Experiência", icon: Briefcase },
        { id: "certifications", label: "Certificações", icon: BadgeCheck },
        { id: "qualifications", label: "Qualificações", icon: GraduationCap },
        { id: "tech", label: "Tech Stack", icon: Code2 },
        { id: "metrics", label: "Métricas", icon: BarChart3 },
        { id: "learning", label: "Aprendizado", icon: Award },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-xl font-bold">Painel Admin</h1>
                    </div>
                    {isProduction ? (
                        <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-xl text-sm font-medium">
                            <AlertCircle size={18} />
                            Edição apenas local
                        </div>
                    ) : (
                        <button
                            onClick={handleSave}
                            disabled={saveStatus === "saving"}
                            className={`flex items-center gap-2 px-6 py-2 rounded-xl font-semibold transition-all ${saveStatus === "success"
                                ? "bg-cyber-emerald text-white"
                                : saveStatus === "error"
                                    ? "bg-red-500 text-white"
                                    : "bg-gradient-to-r from-cyber-blue to-cyber-violet text-white hover:shadow-lg hover:shadow-cyber-blue/25"
                                }`}
                        >
                            {saveStatus === "saving" ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Salvando...
                                </>
                            ) : saveStatus === "success" ? (
                                <>
                                    <Check size={18} />
                                    Salvo!
                                </>
                            ) : saveStatus === "error" ? (
                                <>
                                    <AlertCircle size={18} />
                                    Erro ao salvar
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Salvar Alterações
                                </>
                            )}
                        </button>
                    )}
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <nav className="lg:w-64 flex-shrink-0">
                        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-2 last:mb-0 ${activeTab === tab.id
                                        ? "bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/30"
                                        : "hover:bg-white/5 text-gray-400"
                                        }`}
                                >
                                    <tab.icon size={20} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </nav>

                    {/* Content */}
                    <main className="flex-1">
                        {loading || !config ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="w-8 h-8 border-2 border-cyber-blue/30 border-t-cyber-blue rounded-full animate-spin" />
                            </div>
                        ) : (
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-8"
                            >
                                {/* Personal Tab */}
                                {activeTab === "personal" && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-bold mb-6">Informações Pessoais</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-2">Primeiro Nome</label>
                                                <input
                                                    type="text"
                                                    value={config.personal.firstName}
                                                    onChange={(e) => updateConfig("personal.firstName", e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyber-blue/50 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-2">Sobrenome</label>
                                                <input
                                                    type="text"
                                                    value={config.personal.lastName}
                                                    onChange={(e) => updateConfig("personal.lastName", e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyber-blue/50 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-2">Cargo</label>
                                                <input
                                                    type="text"
                                                    value={config.personal.role}
                                                    onChange={(e) => updateConfig("personal.role", e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyber-blue/50 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-2">Status Badge</label>
                                                <input
                                                    type="text"
                                                    value={config.personal.statusBadge}
                                                    onChange={(e) => updateConfig("personal.statusBadge", e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyber-blue/50 focus:outline-none"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm text-gray-400 mb-2">Descrição</label>
                                                <textarea
                                                    value={config.personal.description}
                                                    onChange={(e) => updateConfig("personal.description", e.target.value)}
                                                    rows={3}
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyber-blue/50 focus:outline-none resize-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-2">Email</label>
                                                <input
                                                    type="email"
                                                    value={config.personal.email}
                                                    onChange={(e) => updateConfig("personal.email", e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyber-blue/50 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-2">Telefone (só números)</label>
                                                <input
                                                    type="text"
                                                    value={config.personal.phone}
                                                    onChange={(e) => updateConfig("personal.phone", e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyber-blue/50 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-2">LinkedIn URL</label>
                                                <input
                                                    type="url"
                                                    value={config.personal.linkedin}
                                                    onChange={(e) => updateConfig("personal.linkedin", e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyber-blue/50 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-2">GitHub URL</label>
                                                <input
                                                    type="url"
                                                    value={config.personal.github}
                                                    onChange={(e) => updateConfig("personal.github", e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyber-blue/50 focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Project Tab */}
                                {activeTab === "project" && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-bold mb-6">Projeto em Destaque</h2>
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm text-gray-400 mb-2">Nome do Projeto</label>
                                                    <input
                                                        type="text"
                                                        value={config.project.name}
                                                        onChange={(e) => updateConfig("project.name", e.target.value)}
                                                        className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyber-blue/50 focus:outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm text-gray-400 mb-2">Subtítulo</label>
                                                    <input
                                                        type="text"
                                                        value={config.project.subtitle}
                                                        onChange={(e) => updateConfig("project.subtitle", e.target.value)}
                                                        className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyber-blue/50 focus:outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-2">Descrição</label>
                                                <textarea
                                                    value={config.project.description}
                                                    onChange={(e) => updateConfig("project.description", e.target.value)}
                                                    rows={4}
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyber-blue/50 focus:outline-none resize-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-2">Features (separadas por vírgula)</label>
                                                <input
                                                    type="text"
                                                    value={config.project.features.join(", ")}
                                                    onChange={(e) => updateConfig("project.features", e.target.value.split(", "))}
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyber-blue/50 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-2">Nome do Arquivo de Exemplo</label>
                                                <input
                                                    type="text"
                                                    value={config.project.codeExample.filename}
                                                    onChange={(e) => updateConfig("project.codeExample.filename", e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyber-blue/50 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-2">Código de Exemplo</label>
                                                <textarea
                                                    value={config.project.codeExample.content}
                                                    onChange={(e) => updateConfig("project.codeExample.content", e.target.value)}
                                                    rows={10}
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white font-mono text-sm focus:border-cyber-blue/50 focus:outline-none resize-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Experience Tab */}
                                {activeTab === "experience" && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-2xl font-bold">Experiência Profissional</h2>
                                            <button
                                                onClick={addExperience}
                                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyber-blue/20 text-cyber-blue hover:bg-cyber-blue/30 transition-colors"
                                            >
                                                <Plus size={18} />
                                                Adicionar
                                            </button>
                                        </div>
                                        {config.experience.map((exp, index) => (
                                            <div
                                                key={index}
                                                className="p-6 rounded-xl bg-slate-800/50 border border-white/10 space-y-4"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-400">Experiência #{index + 1}</span>
                                                    <button
                                                        onClick={() => removeExperience(index)}
                                                        className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <label className="block text-sm text-gray-400 mb-2">Período</label>
                                                        <input
                                                            type="text"
                                                            value={exp.year}
                                                            onChange={(e) => {
                                                                const newExp = [...config.experience];
                                                                newExp[index] = { ...newExp[index], year: e.target.value };
                                                                setConfig({ ...config, experience: newExp });
                                                            }}
                                                            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyber-blue/50 focus:outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm text-gray-400 mb-2">Cargo</label>
                                                        <input
                                                            type="text"
                                                            value={exp.title}
                                                            onChange={(e) => {
                                                                const newExp = [...config.experience];
                                                                newExp[index] = { ...newExp[index], title: e.target.value };
                                                                setConfig({ ...config, experience: newExp });
                                                            }}
                                                            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyber-blue/50 focus:outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm text-gray-400 mb-2">Empresa</label>
                                                        <input
                                                            type="text"
                                                            value={exp.company}
                                                            onChange={(e) => {
                                                                const newExp = [...config.experience];
                                                                newExp[index] = { ...newExp[index], company: e.target.value };
                                                                setConfig({ ...config, experience: newExp });
                                                            }}
                                                            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyber-blue/50 focus:outline-none"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm text-gray-400 mb-2">Descrição</label>
                                                    <textarea
                                                        value={exp.description}
                                                        onChange={(e) => {
                                                            const newExp = [...config.experience];
                                                            newExp[index] = { ...newExp[index], description: e.target.value };
                                                            setConfig({ ...config, experience: newExp });
                                                        }}
                                                        rows={2}
                                                        className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyber-blue/50 focus:outline-none resize-none"
                                                    />
                                                </div>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={exp.isActive}
                                                        onChange={(e) => {
                                                            const newExp = [...config.experience];
                                                            newExp[index] = { ...newExp[index], isActive: e.target.checked };
                                                            setConfig({ ...config, experience: newExp });
                                                        }}
                                                        className="w-5 h-5 rounded border-white/10 bg-slate-800 text-cyber-blue focus:ring-cyber-blue/50"
                                                    />
                                                    <span className="text-sm text-gray-400">Posição Atual</span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Tech Stack Tab */}
                                {activeTab === "tech" && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-2xl font-bold">Tech Stack</h2>
                                            <button
                                                onClick={addTech}
                                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyber-blue/20 text-cyber-blue hover:bg-cyber-blue/30 transition-colors"
                                            >
                                                <Plus size={18} />
                                                Adicionar
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {config.techStack.map((tech, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-white/10"
                                                >
                                                    <input
                                                        type="text"
                                                        value={tech.name}
                                                        onChange={(e) => {
                                                            const newTech = [...config.techStack];
                                                            newTech[index] = { ...newTech[index], name: e.target.value };
                                                            setConfig({ ...config, techStack: newTech });
                                                        }}
                                                        className="flex-1 px-4 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyber-blue/50 focus:outline-none"
                                                    />
                                                    <button
                                                        onClick={() => removeTech(index)}
                                                        className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            Ícones disponíveis: TestTube2, Globe, Terminal, Code2, Cpu, BrainCircuit, Zap
                                        </p>
                                    </div>
                                )}

                                {/* Metrics Tab */}
                                {activeTab === "metrics" && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-2xl font-bold">Métricas</h2>
                                            <button
                                                onClick={addMetric}
                                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyber-blue/20 text-cyber-blue hover:bg-cyber-blue/30 transition-colors"
                                            >
                                                <Plus size={18} />
                                                Adicionar
                                            </button>
                                        </div>
                                        {config.metrics.map((metric, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-white/10"
                                            >
                                                <div className="flex-1 grid grid-cols-2 gap-4">
                                                    <input
                                                        type="text"
                                                        value={metric.value}
                                                        onChange={(e) => {
                                                            const newMetrics = [...config.metrics];
                                                            newMetrics[index] = { ...newMetrics[index], value: e.target.value };
                                                            setConfig({ ...config, metrics: newMetrics });
                                                        }}
                                                        placeholder="Valor (ex: 500+)"
                                                        className="px-4 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyber-blue/50 focus:outline-none"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={metric.label}
                                                        onChange={(e) => {
                                                            const newMetrics = [...config.metrics];
                                                            newMetrics[index] = { ...newMetrics[index], label: e.target.value };
                                                            setConfig({ ...config, metrics: newMetrics });
                                                        }}
                                                        placeholder="Descrição"
                                                        className="px-4 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyber-blue/50 focus:outline-none"
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => removeMetric(index)}
                                                    className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Certifications Tab */}
                                {activeTab === "certifications" && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-2xl font-bold">Certificações</h2>
                                            <button
                                                onClick={addCertification}
                                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyber-blue/20 text-cyber-blue hover:bg-cyber-blue/30 transition-colors"
                                            >
                                                <Plus size={18} />
                                                Adicionar
                                            </button>
                                        </div>
                                        {(config.certifications || []).map((cert, index) => (
                                            <div
                                                key={index}
                                                className="p-6 rounded-xl bg-slate-800/50 border border-white/10 space-y-4"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-400">Certificação #{index + 1}</span>
                                                    <button
                                                        onClick={() => removeCertification(index)}
                                                        className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm text-gray-400 mb-2">Nome da Certificação</label>
                                                        <input
                                                            type="text"
                                                            value={cert.name}
                                                            onChange={(e) => {
                                                                const newCerts = [...(config.certifications || [])];
                                                                newCerts[index] = { ...newCerts[index], name: e.target.value };
                                                                setConfig({ ...config, certifications: newCerts });
                                                            }}
                                                            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyber-blue/50 focus:outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm text-gray-400 mb-2">Emissor</label>
                                                        <input
                                                            type="text"
                                                            value={cert.issuer}
                                                            onChange={(e) => {
                                                                const newCerts = [...(config.certifications || [])];
                                                                newCerts[index] = { ...newCerts[index], issuer: e.target.value };
                                                                setConfig({ ...config, certifications: newCerts });
                                                            }}
                                                            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyber-blue/50 focus:outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm text-gray-400 mb-2">Ano</label>
                                                        <input
                                                            type="text"
                                                            value={cert.year}
                                                            onChange={(e) => {
                                                                const newCerts = [...(config.certifications || [])];
                                                                newCerts[index] = { ...newCerts[index], year: e.target.value };
                                                                setConfig({ ...config, certifications: newCerts });
                                                            }}
                                                            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyber-blue/50 focus:outline-none"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm text-gray-400 mb-2">URL da Credencial (opcional)</label>
                                                        <input
                                                            type="url"
                                                            value={cert.credentialUrl || ""}
                                                            onChange={(e) => {
                                                                const newCerts = [...(config.certifications || [])];
                                                                newCerts[index] = { ...newCerts[index], credentialUrl: e.target.value };
                                                                setConfig({ ...config, certifications: newCerts });
                                                            }}
                                                            placeholder="https://..."
                                                            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyber-blue/50 focus:outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Qualifications Tab */}
                                {activeTab === "qualifications" && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-2xl font-bold">Qualificações</h2>
                                            <button
                                                onClick={addQualification}
                                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyber-blue/20 text-cyber-blue hover:bg-cyber-blue/30 transition-colors"
                                            >
                                                <Plus size={18} />
                                                Adicionar
                                            </button>
                                        </div>
                                        {(config.qualifications || []).map((qual, index) => (
                                            <div
                                                key={index}
                                                className="p-6 rounded-xl bg-slate-800/50 border border-white/10 space-y-4"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-400">Qualificação #{index + 1}</span>
                                                    <button
                                                        onClick={() => removeQualification(index)}
                                                        className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm text-gray-400 mb-2">Título</label>
                                                        <input
                                                            type="text"
                                                            value={qual.title}
                                                            onChange={(e) => {
                                                                const newQuals = [...(config.qualifications || [])];
                                                                newQuals[index] = { ...newQuals[index], title: e.target.value };
                                                                setConfig({ ...config, qualifications: newQuals });
                                                            }}
                                                            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyber-blue/50 focus:outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm text-gray-400 mb-2">Instituição</label>
                                                        <input
                                                            type="text"
                                                            value={qual.institution}
                                                            onChange={(e) => {
                                                                const newQuals = [...(config.qualifications || [])];
                                                                newQuals[index] = { ...newQuals[index], institution: e.target.value };
                                                                setConfig({ ...config, qualifications: newQuals });
                                                            }}
                                                            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyber-blue/50 focus:outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm text-gray-400 mb-2">Ano</label>
                                                        <input
                                                            type="text"
                                                            value={qual.year}
                                                            onChange={(e) => {
                                                                const newQuals = [...(config.qualifications || [])];
                                                                newQuals[index] = { ...newQuals[index], year: e.target.value };
                                                                setConfig({ ...config, qualifications: newQuals });
                                                            }}
                                                            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyber-blue/50 focus:outline-none"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm text-gray-400 mb-2">Tipo</label>
                                                        <select
                                                            value={qual.type}
                                                            onChange={(e) => {
                                                                const newQuals = [...(config.qualifications || [])];
                                                                newQuals[index] = { ...newQuals[index], type: e.target.value };
                                                                setConfig({ ...config, qualifications: newQuals });
                                                            }}
                                                            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyber-blue/50 focus:outline-none"
                                                        >
                                                            <option value="graduation">Graduação</option>
                                                            <option value="postgraduate">Pós-graduação</option>
                                                            <option value="masters">Mestrado</option>
                                                            <option value="doctorate">Doutorado</option>
                                                            <option value="specialization">Especialização</option>
                                                            <option value="course">Curso</option>
                                                            <option value="bootcamp">Bootcamp</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Learning Tab */}
                                {activeTab === "learning" && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-bold mb-6">Aprendizado</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-2">Título</label>
                                                <input
                                                    type="text"
                                                    value={config.learning.title}
                                                    onChange={(e) => updateConfig("learning.title", e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyber-blue/50 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-2">Subtítulo</label>
                                                <input
                                                    type="text"
                                                    value={config.learning.subtitle}
                                                    onChange={(e) => updateConfig("learning.subtitle", e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyber-blue/50 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-2">Progresso (%)</label>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={config.learning.progress}
                                                    onChange={(e) => updateConfig("learning.progress", parseInt(e.target.value))}
                                                    className="w-full"
                                                />
                                                <span className="text-cyber-blue font-bold">{config.learning.progress}%</span>
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-2">Nível</label>
                                                <input
                                                    type="text"
                                                    value={config.learning.level}
                                                    onChange={(e) => updateConfig("learning.level", e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyber-blue/50 focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
