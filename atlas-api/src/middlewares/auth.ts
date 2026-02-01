import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Token não fornecido" });
    }

    const [, token] = authHeader.split(" ");

    if (!token) {
      return res.status(401).json({ error: "Token inválido" });
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    const { id } = decoded as { id: number };

    res.locals.userId = id;
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
};
