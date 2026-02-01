"use client"; // Importante porque usamos useState e interações

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { BookOpen } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao entrar");
      }

      // 1. Salvar o Token no Cookie (dura 1 dia)
      Cookies.set("atlas_token", data.token, { expires: 1 });

      // 2. Redirecionar para o Dashboard
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f5f2] p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 w-full max-w-md sm:max-w-lg">
        <div className="text-center mb-6 sm:mb-8 p-6 sm:p-8">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#ef7e77] rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 text-white shadow-md">
            <BookOpen size={24} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1a1a1a] mb-1">
            Bem-vindo ao Atlas
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Gerencie sua biblioteca de livros
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-4 sm:space-y-5 px-6 sm:px-8 pb-6 sm:pb-8"
        >
          <div>
            <label className="block text-xs sm:text-sm font-medium text-[#1a1a1a] mb-2">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base bg-white border border-gray-200 focus:ring-2 focus:ring-[#ef7e77] focus:border-[#ef7e77] outline-none transition placeholder-gray-400"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-[#1a1a1a] mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base bg-white border border-gray-200 focus:ring-2 focus:ring-[#ef7e77] focus:border-[#ef7e77] outline-none transition placeholder-gray-400"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="p-3 sm:p-4 bg-red-50 text-red-600 text-xs sm:text-sm rounded-lg text-center border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#ef7e77] hover:bg-[#e86961] text-white font-bold py-3 sm:py-4 text-base sm:text-lg rounded-lg sm:rounded-xl transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Entrar
          </button>
        </form>

        <div className="text-center text-xs sm:text-sm text-gray-600 pb-6 sm:pb-8 border-t border-gray-100 pt-6 sm:pt-8 px-6 sm:px-8">
          Ainda não tem conta?{" "}
          <Link
            href="/register"
            className="text-[#ef7e77] hover:text-[#e86961] font-semibold transition"
          >
            Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  );
}
