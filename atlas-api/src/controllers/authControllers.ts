import { Request, Response } from "express";
import { pool } from "../database";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { registerSchema } from "../schemas";
import { config } from "../config";
import { UserRepository } from "../repositories";

export const register = async (req: Request, res: Response) => {
  try {
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    const { name, email, password } = validation.data;

    // Check if user already exists
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "E-mail já cadastrado" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await UserRepository.create(name, email, hashedPassword);

    res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao registrar usuário" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      return res.status(400).json({ error: "Usuário ou senha incorretos" });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password!);
    if (!validPassword) {
      return res.status(400).json({ error: "Usuário ou senha incorretos" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
};
