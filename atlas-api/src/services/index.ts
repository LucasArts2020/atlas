import { UserRepository } from "../repositories";
import { User, UserResponse, Profile, Stats } from "../types";
import { pool } from "../database";

export class UserService {
  static async getUserProfile(userId: number): Promise<Profile | null> {
    const user = await UserRepository.findById(userId);
    if (!user) return null;

    const stats = await this.getUserStats(userId);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        theme: user.theme || "light",
        created_at: user.created_at,
      },
      stats,
    };
  }

  static async getUserStats(userId: number): Promise<Stats> {
    const result = await pool.query(
      `SELECT 
        COUNT(*) as total_books,
        COUNT(CASE WHEN status = 'lido' THEN 1 END) as books_read,
        COUNT(CASE WHEN status = 'lendo' THEN 1 END) as currently_reading,
        COUNT(CASE WHEN status = 'quero_ler' THEN 1 END) as want_to_read,
        COUNT(CASE WHEN rating > 0 THEN 1 END) as reviews,
        COUNT(CASE WHEN DATE_PART('year', created_at) = DATE_PART('year', CURRENT_DATE) THEN 1 END) as this_year
       FROM books 
       WHERE user_id = $1`,
      [userId],
    );

    const stats = result.rows[0];
    const favoritesResult = await pool.query(
      "SELECT COUNT(*) as favorites FROM favorites WHERE user_id = $1",
      [userId],
    );

    return {
      books: parseInt(stats.total_books),
      thisYear: parseInt(stats.this_year),
      favorites: parseInt(favoritesResult.rows[0].favorites),
      reviews: parseInt(stats.reviews),
    };
  }

  static async updateUser(
    userId: number,
    data: { name?: string; theme?: string },
  ): Promise<UserResponse | null> {
    const updated = await UserRepository.update(userId, data);
    if (!updated) return null;

    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      theme: updated.theme || "light",
      created_at: updated.created_at,
    };
  }

  static async changePassword(
    userId: number,
    hashedPassword: string,
  ): Promise<boolean> {
    return await UserRepository.updatePassword(userId, hashedPassword);
  }
}

export class BookService {
  static async getRecentActivity(userId: number, limit: number = 10) {
    const result = await pool.query(
      `SELECT 
        id,
        title,
        status,
        rating,
        created_at,
        CASE 
          WHEN rating > 0 AND status = 'lido' THEN 'review'
          WHEN status = 'lendo' THEN 'reading'
          ELSE 'added'
        END as activity_type
       FROM books 
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [userId, limit],
    );

    return result.rows.map((book) => ({
      id: book.id,
      type: book.activity_type,
      book: book.title,
      rating: book.rating || 0,
      date: formatRelativeDate(book.created_at),
    }));
  }

  static async searchBooks(
    userId: number,
    query?: string,
    status?: string,
    page: number = 1,
    limit: number = 5,
  ) {
    const offset = (page - 1) * limit;
    let whereClause = "WHERE user_id = $1";
    let params: any[] = [userId];
    let paramIndex = 2;

    if (query) {
      whereClause += ` AND (title ILIKE $${paramIndex} OR author ILIKE $${paramIndex})`;
      params.push(`%${query}%`);
      paramIndex++;
    }

    if (status && status !== "todos") {
      whereClause += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    const countResult = await pool.query(
      `SELECT COUNT(*) as total FROM books ${whereClause}`,
      params,
    );

    const dataResult = await pool.query(
      `SELECT * FROM books ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset],
    );

    return {
      data: dataResult.rows,
      total: parseInt(countResult.rows[0].total),
      page,
      limit,
    };
  }
}

function formatRelativeDate(date: any): string {
  const now = new Date();
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const diff = now.getTime() - dateObj.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Hoje";
  if (days === 1) return "Ontem";
  if (days < 7) return `${days} dias atrás`;
  if (days < 30) return `${Math.floor(days / 7)} semanas atrás`;
  if (days < 365) return `${Math.floor(days / 30)} meses atrás`;
  return `${Math.floor(days / 365)} anos atrás`;
}
