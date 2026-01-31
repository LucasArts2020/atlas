import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 1. Buscar o token no cabeçalho da requisição
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  // O token geralmente vem assim: "Bearer eyJhbGci..."
  // Vamos separar o "Bearer" do código real
  const [, token] = authHeader.split(" ");

  try {
    const decoded = jwt.verify(token, "MEU_SEGREDO_SUPER_SECRETO");

    // O decoded é um objeto genérico. Vamos forçar ele a ser tratado como objeto com id
    const { id } = decoded as { id: number };

    // Salvamos o ID aqui para usar depois
    res.locals.userId = id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
};
