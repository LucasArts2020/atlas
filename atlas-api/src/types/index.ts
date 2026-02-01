// User types
export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  theme?: string;
  created_at: Date;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  theme: string;
  created_at: Date;
}

// Book types
export interface Book {
  id: number;
  title: string;
  author: string;
  summary: string;
  cover_url?: string | null;
  status: "quero_ler" | "lendo" | "lido";
  pages_total: number;
  pages_read: number;
  rating: number;
  published_date: Date;
  started_at?: Date | null;
  finished_at?: Date | null;
  user_id: number;
  created_at: Date;
}

export interface BookResponse {
  id: number;
  title: string;
  author: string;
  summary: string;
  cover_url?: string | null;
  status: string;
  pages_total: number;
  pages_read: number;
  rating: number;
  published_date: Date;
  started_at?: Date | null;
  finished_at?: Date | null;
  created_at: Date;
}

// Favorite types
export interface Favorite {
  id: number;
  user_id: number;
  book_id: number;
  created_at: Date;
}

// Activity types
export interface Activity {
  id: number;
  type: "review" | "reading" | "favorite" | "added";
  book: string;
  rating?: number;
  date: string;
}

// Stats types
export interface Stats {
  books: number;
  thisYear: number;
  favorites: number;
  reviews: number;
}

// Profile types
export interface Profile {
  user: UserResponse;
  stats: Stats;
}

// Request/Response types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
