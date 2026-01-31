import { z } from "zod";

// Regras para cadastrar usuário
export const registerSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 letras"),
  email: z.string().email("Formato de e-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

// Regras para criar/editar livro
export const bookSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  author: z.string().min(3, "Nome do autor deve ter pelo menos 3 letras"),
  summary: z.string().optional(),
  cover_url: z.string().optional(),
  status: z.enum(["lendo", "lido", "quero_ler"]).optional(),
  // Novos campos numéricos (opcionais para não quebrar cadastros antigos)
  pages_total: z.number().optional(),
  pages_read: z.number().optional(),
  rating: z.number().min(0).max(5).optional(),
});
