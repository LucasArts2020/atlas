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

    const {
      title,
      author,
      summary,
      cover_url,
      status = "quero_ler",
      pages_total = 0,
      pages_read = 0,
      rating = 0,
      published_date,
      started_at, // <--- Pegue do body
      finished_at, // <--- Pegue do body // <--- Recebemos a data aqui
    } = validation.data;
    const userId = res.locals.userId;

    // Se a data vier vazia ou inválida, usamos null.
    // O Postgres aceita datas como string 'YYYY-MM-DD'.
    const finalDate = published_date ? published_date : new Date();

    const query = `
    INSERT INTO books (title, author, summary, cover_url, status, pages_total, pages_read, rating, published_date, started_at, finished_at, user_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *
  `;
    // Note que trocamos o NOW() pelo $9

    const values = [
      title,
      author,
      summary,
      cover_url,
      status,
      pages_total,
      pages_read,
      rating,
      published_date ? published_date : new Date(),
      started_at || null, // <--- $10
      finished_at || null, // <--- $11
      res.locals.userId, // <--- $12
    ];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar livro" });
  }
});
// Rota 2: LISTAR livros (GET)
// Adicione authMiddleware para garantir que pegamos apenas os livros do usuário logado
router.get("/books", authMiddleware, async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 5; // Limite de itens por página
    const offset = (page - 1) * limit;

    // Parâmetros de filtro
    const search = req.query.q ? `%${req.query.q}%` : null;
    const status = req.query.status as string;

    // ID do usuário logado (Vem do middleware)
    const userId = res.locals.userId;

    // Construção da Query
    let whereClause = "WHERE user_id = $1";
    let params: any[] = [userId];
    let paramIndex = 2;

    // 1. Filtro de Busca
    if (search) {
      whereClause += ` AND (title ILIKE $${paramIndex} OR author ILIKE $${paramIndex})`;
      params.push(search);
      paramIndex++;
    }

    // 2. Filtro de Status
    if (status && status !== "todos") {
      whereClause += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    // Query de Dados
    const query = `
      SELECT * FROM books 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    // Adiciona limit e offset aos parâmetros finais
    const queryParams = [...params, limit, offset];
    const result = await pool.query(query, queryParams);

    // Query de Contagem (Total)
    // Usamos os mesmos filtros (params), mas sem limit/offset
    const countQuery = `SELECT COUNT(*) FROM books ${whereClause}`;
    const countResult = await pool.query(countQuery, params);
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
    console.error(err);
    // Retornamos um JSON de erro claro
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
    started_at, // <--- NOVO
    finished_at, // <--- NOVO
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
        notes = $8,
        started_at = $9,   -- <--- NOVO
        finished_at = $10  -- <--- NOVO
       WHERE id = $11`, // O ID agora é o $11
      [
        title,
        author,
        summary,
        status,
        pages_read,
        pages_total,
        rating,
        notes,
        started_at || null, // $9
        finished_at || null, // $10
        id, // $11
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
