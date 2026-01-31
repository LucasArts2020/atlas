import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. Tenta pegar o token dos cookies
  const token = request.cookies.get("atlas_token")?.value;

  // 2. Define quais rotas são públicas (não precisam de login)
  const publicRoutes = ["/login", "/register"];

  // Verifica se a rota atual é pública
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);

  // --- REGRA 1: Proteção ---
  // Se NÃO tem token e NÃO está numa rota pública -> Manda pro Login
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // --- REGRA 2: Redirecionamento Inteligente (Opcional) ---
  // Se JÁ tem token e tenta acessar Login ou Register -> Manda pra Home
  // (Pra que fazer login de novo se já tá logado?)
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Configuração: Em quais rotas esse middleware vai rodar?
export const config = {
  matcher: [
    /*
     * Roda em todas as rotas, EXCETO:
     * - arquivos estáticos (_next/static, _next/image)
     * - favicon.ico
     * - imagens png/jpg/svg
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
