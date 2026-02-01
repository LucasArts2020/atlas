import { z } from "zod";

// Regras para cadastrar usuário
export const registerSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 letras"),
  email: z.string().email("Formato de e-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

// Regras para criar/editar livro
export const bookSchema = z.object({
  // ... mantenha os outros campos (title, author, etc)
  title: z.string().min(1, "O título é obrigatório"),
  author: z.string().min(3, "Nome do autor deve ter pelo menos 3 letras"),
  summary: z.string().optional(),
  cover_url: z.string().optional().nullable(),
  status: z.enum(["lendo", "lido", "quero_ler"]).optional(),
  pages_total: z.number().optional(),
  pages_read: z.number().optional(),
  rating: z.number().min(0).max(5).optional(),
  published_date: z.string().optional().nullable(),

  // ADICIONE ESTES DOIS:
  started_at: z.string().optional().nullable(),
  finished_at: z.string().optional().nullable(),
});
