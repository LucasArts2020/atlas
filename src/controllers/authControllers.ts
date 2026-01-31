import { Request, Response } from "express";
import { pool } from "../database";
import bcrypt from "bcryptjs";

import { registerSchema } from "../schemas";

import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  try {
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      // Se falhar, devolve o erro bonitinho
      return res.status(400).json({ errors: validation.error.format() });
    }
    const { name, email, password } = validation.data;

    // 1. Verificar se o usuário já existe
    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: "E-mail já cadastrado" });
    }

    // 2. Criptografar a senha (O segredo do cofre!)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Salvar no banco
    const query = `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, name, email
    `;

    const newUser = await pool.query(query, [name, email, hashedPassword]);

    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao registrar usuário" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Buscar o usuário pelo email
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );
    const user = userResult.rows[0];

    if (!user) {
      return res.status(400).json({ error: "Usuário ou senha incorretos" });
    }

    // 2. Comparar a senha enviada com a senha criptografada do banco
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Usuário ou senha incorretos" });
    }

    // 3. Gerar o Token (O Crachá)
    // O segredo ("SECRET_KEY") deveria estar no .env, mas vamos usar um fixo por enquanto para facilitar
    const token = jwt.sign({ id: user.id }, "MEU_SEGREDO_SUPER_SECRETO", {
      expiresIn: "1h", // O token vale por 1 hora
    });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
};
