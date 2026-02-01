/**
 * Formata uma data para formato relativo (ex: "2 dias atrás")
 */
export function formatRelativeDate(date: any): string {
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

/**
 * Valida se uma string é um email válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitiza uma string removendo espaços em branco
 */
export function sanitizeString(str: string): string {
  return str.trim().toLowerCase();
}

/**
 * Gera um ID único
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Calcula offset para paginação
 */
export function calculateOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}

/**
 * Calcula total de páginas
 */
export function calculateTotalPages(total: number, limit: number): number {
  return Math.ceil(total / limit);
}
