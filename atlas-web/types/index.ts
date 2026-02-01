export type Book = {
  id: number;
  title: string;
  author: string;
  summary: string;
  cover_url?: string | null;
  status: "lendo" | "lido" | "quero_ler";
  pages_total: number;
  pages_read: number;
  rating: number;
  // Adicione as datas se já tiver implementado
  started_at?: string | null;
  finished_at?: string | null;
};
