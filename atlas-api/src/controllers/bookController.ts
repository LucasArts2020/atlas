import { Request, Response } from "express";
import { BookRepository, FavoriteRepository } from "../repositories";
import { BookService } from "../services";
import { bookSchema } from "../schemas";

interface AuthRequest extends Request {
  userId?: number;
}

export class BookController {
  static async createBook(req: AuthRequest, res: Response) {
    try {
      const userId = res.locals.userId;
      const validation = bookSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({ errors: validation.error.format() });
      }

      const bookData = validation.data;
      const book = await BookRepository.create({
        title: bookData.title,
        author: bookData.author,
        summary: bookData.summary,
        cover_url: bookData.cover_url || null,
        status: bookData.status || "quero_ler",
        pages_total: bookData.pages_total || 0,
        pages_read: bookData.pages_read || 0,
        rating: bookData.rating || 0,
        published_date: bookData.published_date || new Date(),
        started_at: bookData.started_at || null,
        finished_at: bookData.finished_at || null,
        user_id: userId,
      });

      res.status(201).json(book);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar livro" });
    }
  }

  static async listBooks(req: AuthRequest, res: Response) {
    try {
      const userId = res.locals.userId;
      const page = Number(req.query.page) || 1;
      const query = req.query.q as string | undefined;
      const status = req.query.status as string | undefined;
      const limit = 5;

      const result = await BookService.searchBooks(
        userId,
        query,
        status,
        page,
        limit,
      );

      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao listar livros" });
    }
  }

  static async getBook(req: AuthRequest, res: Response) {
    try {
      const bookId = Number(req.params.id);
      const userId = res.locals.userId;

      const book = await BookRepository.findById(bookId);
      if (!book || book.user_id !== userId) {
        return res.status(404).json({ error: "Livro não encontrado" });
      }

      const isFavorite = await FavoriteRepository.findByUserAndBook(
        userId,
        bookId,
      );

      res.json({ ...book, isFavorite });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar livro" });
    }
  }

  static async updateBook(req: AuthRequest, res: Response) {
    try {
      const bookId = Number(req.params.id);
      const userId = res.locals.userId;

      const book = await BookRepository.findById(bookId);
      if (!book || book.user_id !== userId) {
        return res.status(404).json({ error: "Livro não encontrado" });
      }

      const updated = await BookRepository.update(bookId, req.body);
      res.json(updated);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar livro" });
    }
  }

  static async deleteBook(req: AuthRequest, res: Response) {
    try {
      const bookId = Number(req.params.id);
      const userId = res.locals.userId;

      const book = await BookRepository.findById(bookId);
      if (!book || book.user_id !== userId) {
        return res.status(404).json({ error: "Livro não encontrado" });
      }

      await BookRepository.delete(bookId);
      res.json({ message: "Livro deletado com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao deletar livro" });
    }
  }
}

export class FavoriteController {
  static async listFavorites(req: AuthRequest, res: Response) {
    try {
      const userId = res.locals.userId;

      const books = await FavoriteRepository.findByUser(userId);
      res.json(books);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar favoritos" });
    }
  }

  static async isFavorite(req: AuthRequest, res: Response) {
    try {
      const bookId = Number(req.params.id);
      const userId = res.locals.userId;

      const isFavorite = await FavoriteRepository.findByUserAndBook(
        userId,
        bookId,
      );
      res.json({ isFavorite });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao verificar favorito" });
    }
  }

  static async addFavorite(req: AuthRequest, res: Response) {
    try {
      const bookId = Number(req.params.id);
      const userId = res.locals.userId;

      const success = await FavoriteRepository.add(userId, bookId);
      if (!success) {
        return res.status(400).json({ error: "Livro já está nos favoritos" });
      }

      res.json({ message: "Adicionado aos favoritos" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao adicionar aos favoritos" });
    }
  }

  static async removeFavorite(req: AuthRequest, res: Response) {
    try {
      const bookId = Number(req.params.id);
      const userId = res.locals.userId;

      const success = await FavoriteRepository.remove(userId, bookId);
      if (!success) {
        return res.status(404).json({ error: "Favorito não encontrado" });
      }

      res.json({ message: "Removido dos favoritos" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao remover dos favoritos" });
    }
  }
}

export class ActivityController {
  static async getActivity(req: AuthRequest, res: Response) {
    try {
      const userId = res.locals.userId;

      const activities = await BookService.getRecentActivity(userId, 10);
      res.json(activities);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar atividade" });
    }
  }
}
