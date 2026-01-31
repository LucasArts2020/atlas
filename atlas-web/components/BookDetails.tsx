"use client";

import { useState } from "react";
import { Star, BookOpen, Save, ArrowLeft, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";

type Book = {
  id: number;
  title: string;
  author: string;
  summary: string;
  notes?: string;
  cover_url?: string | null;
  status: "lendo" | "lido" | "quero_ler";
  pages_total: number;
  pages_read: number;
  rating: number;
  created_at?: string;
};

export function BookDetails({ book }: { book: Book }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Estados editáveis
  const [status, setStatus] = useState(book.status);
  const [pagesRead, setPagesRead] = useState(book.pages_read);
  const [pagesTotal, setPagesTotal] = useState(book.pages_total || 0);
  const [rating, setRating] = useState(book.rating);
  const [notes, setNotes] = useState(book.notes || "");

  // Cálculo da porcentagem (Com trava para não passar de 100%)
  const percentage =
    pagesTotal > 0
      ? Math.min(100, Math.max(0, Math.round((pagesRead / pagesTotal) * 100)))
      : 0;

  const handleSave = async () => {
    setLoading(true);
    const token = Cookies.get("atlas_token");

    try {
      const res = await fetch(`http://localhost:3000/books/${book.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: book.title,
          author: book.author,
          summary: book.summary,
          status,
          pages_read: Number(pagesRead),
          pages_total: Number(pagesTotal),
          rating: Number(rating),
          notes: notes,
        }),
      });

      if (!res.ok) throw new Error("Erro ao salvar");

      router.refresh(); // Atualiza os dados da página em background
      alert("✅ Livro atualizado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("❌ Erro ao salvar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Tem certeza que deseja excluir este livro? Essa ação não pode ser desfeita.",
      )
    )
      return;

    const token = Cookies.get("atlas_token");
    try {
      await fetch(`http://localhost:3000/books/${book.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push("/"); // Volta para home
      router.refresh(); // Garante que a home atualize
    } catch (error) {
      alert("Erro ao excluir o livro.");
    }
  };

  // Garante que o input não aceite números negativos
  const handlePageChange = (setter: (val: number) => void, value: string) => {
    const num = Number(value);
    if (num >= 0) setter(num);
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Botão Voltar */}
      <button
        onClick={() => router.back()}
        className="mb-8 flex items-center gap-2 text-gray-500 hover:text-[#1a1a1a] transition font-medium"
      >
        <ArrowLeft size={20} /> Voltar para estante
      </button>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* COLUNA ESQUERDA: Capa e Status Rápido */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-2xl bg-white border border-gray-100 group">
            {book.cover_url ? (
              <Image
                src={book.cover_url}
                alt={book.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                Sem Capa
              </div>
            )}
          </div>

          {/* Status Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
              Status atual
            </label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-[#f8f5f2] border-none rounded-xl py-3 px-4 font-bold text-[#1a1a1a] focus:ring-2 focus:ring-[#ef7e77] appearance-none cursor-pointer"
              >
                <option value="quero_ler">📚 Quero Ler</option>
                <option value="lendo">📖 Lendo Agora</option>
                <option value="lido">✅ Terminado</option>
              </select>
              {/* Seta customizada para o select */}
              <div className="absolute right-4 top-3.5 pointer-events-none text-gray-500">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: Detalhes, Progresso e Notas */}
        <div className="md:col-span-8 flex flex-col gap-8">
          {/* Cabeçalho */}
          <div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-2 leading-tight">
              {book.title}
            </h1>
            <p className="text-xl text-gray-500 font-medium">{book.author}</p>
          </div>

          {/* Painel de Controle de Leitura */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100">
              <div
                className="h-full bg-[#ef7e77] transition-all duration-1000 ease-out"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8 mt-4">
              <div>
                <p className="text-[#ef7e77] font-bold text-sm uppercase tracking-wider mb-1">
                  Seu Progresso
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-6xl font-serif font-bold text-[#1a1a1a] tracking-tight">
                    {percentage}%
                  </span>
                  <span className="text-gray-400 font-bold text-lg">
                    completed
                  </span>
                </div>
              </div>

              {/* Inputs de Página */}
              <div className="flex items-center gap-4 bg-[#f8f5f2] p-4 rounded-2xl border border-gray-200">
                <div className="text-right">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Pag Atual
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={pagesRead}
                    onChange={(e) =>
                      handlePageChange(setPagesRead, e.target.value)
                    }
                    className="bg-transparent text-right font-bold text-2xl text-[#1a1a1a] w-24 outline-none border-b-2 border-transparent focus:border-[#ef7e77] transition-colors"
                  />
                </div>
                <span className="text-gray-300 text-3xl font-light">/</span>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Total
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={pagesTotal}
                    onChange={(e) =>
                      handlePageChange(setPagesTotal, e.target.value)
                    }
                    className="bg-transparent font-bold text-2xl text-gray-500 w-24 outline-none border-b-2 border-transparent focus:border-[#ef7e77] focus:text-[#1a1a1a] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Avaliação */}
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">
                Sua Avaliação
              </p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition hover:scale-110 focus:outline-none"
                  >
                    <Star
                      size={32}
                      className={`${
                        star <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-200"
                      } transition-colors duration-300`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Área de Notas (Caderno) */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex-1">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif text-2xl font-bold text-[#1a1a1a]">
                My Notes & Thoughts
              </h3>
              <BookOpen size={20} className="text-gray-300" />
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Escreva aqui suas citações favoritas, ideias ou resumo do livro..."
              className="w-full h-64 bg-[#f8f5f2] rounded-xl p-6 text-[#1a1a1a] leading-relaxed border-none outline-none resize-none focus:ring-2 focus:ring-[#ef7e77]/20 placeholder-gray-400 font-medium text-lg"
            ></textarea>
          </div>

          {/* Barra de Ações */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              onClick={handleDelete}
              className="px-6 py-4 rounded-xl font-bold text-red-500 hover:bg-red-50 transition flex items-center justify-center gap-2 border border-transparent hover:border-red-100"
            >
              <Trash2 size={20} /> Excluir Livro
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-[#1a1a1a] text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
            >
              {loading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <Save size={20} />
              )}
              {loading ? "Salvando..." : "Salvar Progresso"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
