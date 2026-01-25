// ============================================
// PORTFOLIO CONFIGURATION FILE
// Edite este arquivo para atualizar o portfólio
// ============================================

export interface PortfolioConfig {
    personal: {
        firstName: string;
        lastName: string;
        role: string;
        tagline: string;
        description: string;
        statusBadge: string;
        email: string;
        phone: string;
        linkedin: string;
        github: string;
        location?: string;
    };
    project: {
        name: string;
        subtitle: string;
        description: string;
        features: string[];
        codeExample: {
            filename: string;
            content: string;
        };
    };
    techStack: {
        name: string;
        icon: string;
    }[];
    experience: {
        year: string;
        title: string;
        company: string;
        description: string;
        isActive: boolean;
    }[];
    certifications: {
        name: string;
        issuer: string;
        year: string;
        credentialUrl?: string;
    }[];
    learning: {
        title: string;
        subtitle: string;
        progress: number;
        level: string;
    };
    metrics: {
        value: string;
        label: string;
    }[];
}

const portfolioConfig: PortfolioConfig = {
    personal: {
        firstName: "Matheus",
        lastName: "Ferreira",
        role: "QA Engineer",
        tagline: "<QA Engineer />",
        description: "Engenheiro de QA especializado em automação inteligente e soluções de teste com IA. Transformando qualidade em excelência.",
        statusBadge: "Available for Projects",
        email: "contato@email.com",
        phone: "5522988741592",
        linkedin: "https://www.linkedin.com/in/matheus-ferreira-57380271/",
        github: "https://github.com/",
        location: "Rio de Janeiro, Brasil",
    },
    project: {
        name: "BDD_PyTech",
        subtitle: "Assistente Automatizador",
        description: "Uma solução revolucionária de IA e Automação que converte interações do navegador diretamente em cenários Gherkin/BDD prontos para execução. Acelere a criação de testes automatizados em até 10x.",
        features: ["Chrome Extension", "AI Integration", "Gherkin Output", "One-Click Export"],
        codeExample: {
            filename: "bdd_pytech_output.feature",
            content: `Feature: Login do Sistema

Scenario: Login com sucesso
  Given que estou na página de login
  When eu preencho "usuario@email.com"
  And eu preencho a senha "***"
  And eu clico no botão "Entrar"
  Then devo ver o dashboard`,
        },
    },
    techStack: [
        { name: "Cypress", icon: "TestTube2" },
        { name: "Selenium", icon: "Globe" },
        { name: "Playwright", icon: "Terminal" },
        { name: "Gherkin/BDD", icon: "Code2" },
        { name: "Python", icon: "Cpu" },
        { name: "TypeScript", icon: "Code2" },
        { name: "AI Prompts", icon: "BrainCircuit" },
        { name: "REST APIs", icon: "Zap" },
    ],
    experience: [
        {
            year: "2023 - Presente",
            title: "QA Engineer",
            company: "NTT Data",
            description: "Liderança em automação de testes com Cypress e Selenium. Desenvolvimento de frameworks de teste e integração com pipelines CI/CD. Implementação de testes de API e performance.",
            isActive: true,
        },
        {
            year: "2022 - 2023",
            title: "QA Analyst",
            company: "NTT Data",
            description: "Análise e execução de testes funcionais e de regressão. Documentação de casos de teste em Gherkin/BDD. Colaboração com times de desenvolvimento ágil.",
            isActive: false,
        },
        {
            year: "2021 - 2022",
            title: "QA Trainee",
            company: "NTT Data",
            description: "Introdução às práticas de QA e metodologias de teste. Aprendizado de ferramentas de automação e boas práticas de desenvolvimento de software.",
            isActive: false,
        },
    ],
    certifications: [
        {
            name: "CTFL - Certified Tester Foundation Level",
            issuer: "ISTQB",
            year: "2023",
            credentialUrl: "",
        },
        {
            name: "Cypress Automation Testing",
            issuer: "Udemy",
            year: "2022",
            credentialUrl: "",
        },
    ],
    learning: {
        title: "Always Learning",
        subtitle: "Inglês em Aperfeiçoamento",
        progress: 70,
        level: "Nível Intermediário-Avançado",
    },
    metrics: [
        { value: "500+", label: "Casos de Teste Automatizados" },
        { value: "3+", label: "Anos de Experiência" },
        { value: "100%", label: "Comprometimento" },
    ],
};

export default portfolioConfig;
