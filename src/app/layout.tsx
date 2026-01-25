import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Matheus Ferreira | QA Engineer",
  description: "Engenheiro de QA especializado em automação inteligente e soluções de teste com IA. Portfólio profissional com projetos inovadores.",
  keywords: ["QA Engineer", "Test Automation", "Cypress", "Selenium", "NTT Data", "Software Quality"],
  authors: [{ name: "Matheus Ferreira" }],
  openGraph: {
    title: "Matheus Ferreira | QA Engineer",
    description: "Engenheiro de QA especializado em automação inteligente e soluções de teste com IA.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
        {/* Subtle noise overlay for texture */}
        <div className="noise-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}
