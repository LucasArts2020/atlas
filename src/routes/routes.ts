import { Router } from "express";
import { pool } from "../database";

const router = Router();

// Rota 1: CRIAR um livro (POST)
router.post("/books", async (req, res) => {
  try {
    const { title, author, summary } = req.body;

    // Comando SQL direto na veia
    const query = `
      INSERT INTO books (title, author, summary, published_date)
      VALUES ($1, $2, $3, NOW())
      RETURNING *
    `;

    const values = [title, author, summary];
    const result = await pool.query(query, values);

    // Retorna o livro criado (com o ID gerado pelo banco)
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar livro" });
  }
});

// Rota 2: LISTAR livros (GET)
router.get("/books", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM books ORDER BY created_at DESC",
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar livros" });
  }
});

export { router };
