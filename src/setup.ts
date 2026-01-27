import { pool } from "./database";
import fs from "fs";
import path from "path";

const setup = async () => {
  try {
    // Lê o arquivo SQL
    const sqlPath = path.join(__dirname, "sql", "init.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    // Executa no banco
    await pool.query(sql);
    console.log("✅ Tabelas criadas com sucesso!");
  } catch (err) {
    console.error("❌ Erro ao criar tabelas:", err);
  } finally {
    await pool.end(); // Fecha a conexão
  }
};

setup();
