import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CONFIG_PATH = path.join(process.cwd(), "src/config/portfolio-data.json");

// GET - Retorna os dados atuais do portfólio
export async function GET() {
    try {
        // Tenta ler do JSON primeiro
        if (fs.existsSync(CONFIG_PATH)) {
            const data = fs.readFileSync(CONFIG_PATH, "utf-8");
            return NextResponse.json(JSON.parse(data));
        }

        // Se não existir, usa o config padrão
        const defaultConfig = await import("@/config/portfolio");
        return NextResponse.json(defaultConfig.default);
    } catch (error) {
        return NextResponse.json({ error: "Failed to load config" }, { status: 500 });
    }
}

// POST - Salva os novos dados do portfólio
export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Valida a senha de admin
        const adminPassword = request.headers.get("x-admin-password");
        if (adminPassword !== "mferreio.qa") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Salva no arquivo JSON
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(data, null, 2), "utf-8");

        return NextResponse.json({ success: true, message: "Configuração salva com sucesso!" });
    } catch (error: any) {
        console.error("Erro ao salvar configuração:", error);
        return NextResponse.json(
            { error: "Failed to save config", details: error.message },
            { status: 500 }
        );
    }
}
