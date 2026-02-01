import { pool } from "../database";
import { User, Book } from "../types";

export class UserRepository {
  static async findById(id: number): Promise<User | null> {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0] || null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0] || null;
  }

  static async create(
    name: string,
    email: string,
    password: string,
  ): Promise<User> {
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, password],
    );
    return result.rows[0];
  }

  static async update(id: number, data: Partial<User>): Promise<User | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(data)) {
      if (key !== "id" && key !== "password") {
        updates.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    if (updates.length === 0) return await this.findById(id);

    values.push(id);
    const result = await pool.query(
      `UPDATE users SET ${updates.join(", ")} WHERE id = $${paramIndex} RETURNING *`,
      values,
    );
    return result.rows[0] || null;
  }

  static async updatePassword(
    id: number,
    hashedPassword: string,
  ): Promise<boolean> {
    const result = await pool.query(
      "UPDATE users SET password = $1 WHERE id = $2",
      [hashedPassword, id],
    );
    return result.rowCount > 0;
  }
}

export class BookRepository {
  static async findById(id: number): Promise<Book | null> {
    const result = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
    return result.rows[0] || null;
  }

  static async findByUserId(
    userId: number,
    limit?: number,
    offset?: number,
  ): Promise<Book[]> {
    let query = "SELECT * FROM books WHERE user_id = $1";
    const params: any[] = [userId];

    if (limit) {
      query += ` LIMIT $${params.length + 1}`;
      params.push(limit);
    }

    if (offset) {
      query += ` OFFSET $${params.length + 1}`;
      params.push(offset);
    }

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async create(
    book: Partial<Book> & { user_id: number },
  ): Promise<Book> {
    const {
      title,
      author,
      summary,
      cover_url,
      status,
      pages_total,
      pages_read,
      rating,
      published_date,
      started_at,
      finished_at,
      user_id,
    } = book;

    const result = await pool.query(
      `INSERT INTO books 
       (title, author, summary, cover_url, status, pages_total, pages_read, rating, published_date, started_at, finished_at, user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        title,
        author,
        summary,
        cover_url,
        status,
        pages_total,
        pages_read,
        rating,
        published_date,
        started_at,
        finished_at,
        user_id,
      ],
    );
    return result.rows[0];
  }

  static async update(id: number, data: Partial<Book>): Promise<Book | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(data)) {
      if (key !== "id" && key !== "user_id") {
        updates.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    if (updates.length === 0) return await this.findById(id);

    values.push(id);
    const result = await pool.query(
      `UPDATE books SET ${updates.join(", ")} WHERE id = $${paramIndex} RETURNING *`,
      values,
    );
    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query("DELETE FROM books WHERE id = $1", [id]);
    return result.rowCount > 0;
  }

  static async countByUser(userId: number): Promise<number> {
    const result = await pool.query(
      "SELECT COUNT(*) as count FROM books WHERE user_id = $1",
      [userId],
    );
    return parseInt(result.rows[0].count);
  }

  static async countByUserAndStatus(
    userId: number,
    status: string,
  ): Promise<number> {
    const result = await pool.query(
      "SELECT COUNT(*) as count FROM books WHERE user_id = $1 AND status = $2",
      [userId, status],
    );
    return parseInt(result.rows[0].count);
  }
}

export class FavoriteRepository {
  static async findByUserAndBook(
    userId: number,
    bookId: number,
  ): Promise<boolean> {
    const result = await pool.query(
      "SELECT EXISTS(SELECT 1 FROM favorites WHERE user_id = $1 AND book_id = $2) as exists",
      [userId, bookId],
    );
    return result.rows[0].exists;
  }

  static async findByUser(userId: number): Promise<Book[]> {
    const result = await pool.query(
      `SELECT b.* FROM books b
       INNER JOIN favorites f ON b.id = f.book_id
       WHERE f.user_id = $1
       ORDER BY f.created_at DESC`,
      [userId],
    );
    return result.rows;
  }

  static async countByUser(userId: number): Promise<number> {
    const result = await pool.query(
      "SELECT COUNT(*) as count FROM favorites WHERE user_id = $1",
      [userId],
    );
    return parseInt(result.rows[0].count);
  }

  static async add(userId: number, bookId: number): Promise<boolean> {
    try {
      await pool.query(
        "INSERT INTO favorites (user_id, book_id) VALUES ($1, $2)",
        [userId, bookId],
      );
      return true;
    } catch {
      return false;
    }
  }

  static async remove(userId: number, bookId: number): Promise<boolean> {
    const result = await pool.query(
      "DELETE FROM favorites WHERE user_id = $1 AND book_id = $2",
      [userId, bookId],
    );
    return result.rowCount > 0;
  }
}
