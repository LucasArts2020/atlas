import { Router } from "express";
import { pool } from "../database";

import { register } from "../controllers/authControllers";
import { login } from "../controllers/authControllers";
import { authMiddleware } from "../middlewares/auth";
import { bookSchema } from "../schemas";
const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);

// Rota 1: CRIAR um livro (POST)
// Procure a rota POST /books
router.post("/books", authMiddleware, async (req, res) => {
  try {
    const validation = bookSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    // 1. Pegamos os dados do body (incluindo as novidades: status, páginas, etc)
    const {
      title,
      author,
      summary,
      cover_url,
      status = "quero_ler",
      pages_total = 0,
      pages_read = 0,
      rating = 0, // <--- Pegue o rating
    } = validation.data;
    const userId = res.locals.userId;

    const query = `
      INSERT INTO books (title, author, summary, cover_url, status, pages_total, pages_read, rating, published_date, user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), $9)
      RETURNING *
    `;
    // Agora o userId existe e pode ser usado aqui
    const values = [
      title,
      author,
      summary,
      cover_url,
      status,
      pages_total,
      pages_read,
      rating,
      userId,
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar livro" });
  }
});
// Rota 2: LISTAR livros (GET)
router.get("/books", async (req, res) => {
  try {
    // Pegamos a página da URL (ex: ?page=2). Se não tiver, assume 1.
    const page = Number(req.query.page) || 1;
    const limit = 5; // Quantos livros por página
    const offset = (page - 1) * limit; // Cálculo do pulo (Página 2 pula os 10 primeiros)

    // Buscamos os livros com limite
    const query =
      "SELECT * FROM books ORDER BY created_at DESC LIMIT $1 OFFSET $2";
    const result = await pool.query(query, [limit, offset]);

    // (Opcional) Contar quantos livros tem no total para o front saber quantas páginas criar
    const countResult = await pool.query("SELECT COUNT(*) FROM books");
    const totalBooks = Number(countResult.rows[0].count);

    res.json({
      data: result.rows,
      pagination: {
        total: totalBooks,
        page: page,
        totalPages: Math.ceil(totalBooks / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar livros" });
  }
});

// Adicione logo abaixo da rota POST
// Rota DELETE: /books/1, /books/2, etc.
router.delete("/books/:id", authMiddleware, async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = res.locals.userId; // ID de quem está tentando deletar

    // 1. Buscar o livro para ver se ele existe e de quem é
    const checkQuery = "SELECT * FROM books WHERE id = $1";
    const checkResult = await pool.query(checkQuery, [bookId]);
    const book = checkResult.rows[0];

    if (!book) {
      return res.status(404).json({ error: "Livro não encontrado" });
    }

    // 2. A VERIFICAÇÃO DE OURO: O dono do livro é quem está logado?
    if (book.user_id !== userId) {
      return res
        .status(403)
        .json({ error: "Você não tem permissão para deletar este livro" });
    }

    // 3. Se passou, deleta!
    await pool.query("DELETE FROM books WHERE id = $1", [bookId]);

    res.status(200).json({ message: "Livro deletado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar livro" });
  }
});

// Rota PUT: Atualizar um livro existente
router.put("/books/:id", async (req, res) => {
  const { id } = req.params;
  // Agora recebemos 'notes' também do corpo da requisição
  const {
    title,
    author,
    summary,
    status,
    pages_read,
    pages_total,
    rating,
    notes,
  } = req.body;

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Acesso negado" });

  try {
    // ATENÇÃO NA ORDEM DOS $1, $2, etc.
    // Adicionamos 'notes=$8' na query SQL
    await pool.query(
      `UPDATE books SET 
        title = $1, 
        author = $2, 
        summary = $3, 
        status = $4, 
        pages_read = $5, 
        pages_total = $6, 
        rating = $7, 
        notes = $8 
       WHERE id = $9`,
      [
        title,
        author,
        summary,
        status,
        pages_read,
        pages_total,
        rating,
        notes,
        id,
      ],
    );

    res.json({ message: "Livro atualizado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao atualizar livro");
  }
});
router.get("/books/:id", async (req, res) => {
  const { id } = req.params;

  // Pega o token do header (mesma lógica que você já usa nas outras)
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Acesso negado" });

  try {
    // DICA: Se você tiver o ID do usuário no token, use: WHERE id = $1 AND user_id = $2
    // Se não tiver decodificando o token aqui, use apenas WHERE id = $1

    const result = await pool.query("SELECT * FROM books WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Livro não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro no servidor");
  }
});

export { router };
