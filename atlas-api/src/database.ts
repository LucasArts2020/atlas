import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// --- ÁREA DE INVESTIGAÇÃO ---
console.log("🕵️ INVESTIGAÇÃO DAS VARIÁVEIS:");
console.log("User:", `"${process.env.DB_USER}"`);
console.log("Host:", `"${process.env.DB_HOST}"`);
console.log("Database:", `"${process.env.DB_NAME}"`);
console.log("Password:", `"${process.env.DB_PASSWORD}"`); // As aspas mostram se tem espaço escondido
console.log("Port:", `"${process.env.DB_PORT}"`);
console.log("---------------------------");
// ----------------------------

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});
// Função auxiliar para testar a conexão
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log("📦 Conectado ao PostgreSQL com sucesso!");
    client.release();
  } catch (err) {
    console.error("❌ Erro ao conectar no banco:", err);
  }
};
