"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao cadastrar");
      }

      // Sucesso! Redireciona para o Login para a pessoa entrar
      alert("Conta criada com sucesso! Faça login agora.");
      router.push("/login");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f5f2] p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 w-full max-w-md sm:max-w-lg animate-in fade-in zoom-in duration-300">
        <div className="px-6 sm:px-8 pt-6 sm:pt-8">
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition"
          >
            <ArrowLeft size={16} /> Voltar
          </Link>
        </div>

        <div className="text-center mb-6 sm:mb-8 px-6 sm:px-8">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#ef7e77] rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 text-white shadow-md">
            <UserPlus size={24} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1a1a1a] mb-1">
            Crie sua conta
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Comece a catalogar seus livros
          </p>
        </div>

        <form
          onSubmit={handleRegister}
          className="space-y-4 sm:space-y-5 px-6 sm:px-8 pb-6 sm:pb-8"
        >
          <div>
            <label className="block text-xs sm:text-sm font-medium text-[#1a1a1a] mb-2">
              Nome Completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base bg-white border border-gray-200 focus:ring-2 focus:ring-[#ef7e77] focus:border-[#ef7e77] outline-none transition placeholder-gray-400"
              placeholder="Seu nome completo"
              required
            />
          </div>

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
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="p-3 sm:p-4 bg-red-50 text-red-600 text-xs sm:text-sm rounded-lg text-center border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ef7e77] hover:bg-[#e86961] disabled:bg-gray-400 text-white font-bold py-3 sm:py-4 text-base sm:text-lg rounded-lg sm:rounded-xl transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Criando conta..." : "Cadastrar"}
          </button>
        </form>

        <div className="text-center text-xs sm:text-sm text-gray-600 pb-6 sm:pb-8 px-6 sm:px-8 border-t border-gray-100 pt-6 sm:pt-8">
          Já tem conta?{" "}
          <Link
            href="/login"
            className="text-[#ef7e77] hover:text-[#e86961] font-semibold transition"
          >
            Faça login
          </Link>
        </div>
      </div>
    </div>
  );
}
