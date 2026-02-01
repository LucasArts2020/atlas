"use client";

import { useState } from "react";
import { Trash2, Pencil, X, Star, Book as BookIcon } from "lucide-react"; // Importei o BookIcon
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useFetchWithAuth } from "@/hooks/useFetchWithAuth";

// Definição do Tipo
type BookStatus = "lendo" | "lido" | "quero_ler";

interface BookProps {
  id: number;
  title: string;
  author: string;
  summary: string;
  cover_url?: string | null;
  status: BookStatus;
  pages_total: number;
  pages_read: number;
  rating: number;
  index: number;
}

export function BookCard({
  id,
  title,
  author,
  summary,
  cover_url,
  status,
  pages_total = 0,
  pages_read = 0,
  rating = 0,
}: BookProps) {
  const router = useRouter();
  const { fetchWithAuth } = useFetchWithAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Estados do Formulário
  const [editTitle] = useState(title);
  const [editAuthor] = useState(author);
  const [editStatus, setEditStatus] = useState<BookStatus>(status);
  const [editRead, setEditRead] = useState(pages_read);
  const [editTotal, setEditTotal] = useState(pages_total);
  const [editRating, setEditRating] = useState(rating);
  const [loading, setLoading] = useState(false);

  // --- FILTRO DE SEGURANÇA ---
  // Se a URL for do Unsplash (que está quebrado), anulamos ela para mostrar o ícone
  const safeCoverUrl =
    cover_url && !cover_url.includes("unsplash") ? cover_url : null;

  const percentage =
    pages_total > 0
      ? Math.min(100, Math.round((pages_read / pages_total) * 100))
      : 0;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetchWithAuth(`http://localhost:3000/books/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle,
          author: editAuthor,
          summary,
          status: editStatus,
          pages_read: Number(editRead),
          pages_total: Number(editTotal),
          rating: Number(editRating),
        }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar");

      setIsEditing(false);
      router.refresh();
    } catch (error: unknown) {
      console.error(error);
      alert("Erro ao salvar as alterações.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Excluir este livro?")) return;
    try {
      await fetchWithAuth(`http://localhost:3000/books/${id}`, {
        method: "DELETE",
      });
      router.refresh();
    } catch (error: unknown) {
      alert("Erro ao excluir o livro.");
    }
  };

  const StarDisplay = ({ count }: { count: number }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={12}
          className={`${
            star <= count ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  return (
    <>
      <div className="group relative flex flex-col gap-3 w-full">
        {/* CAPA DO LIVRO (Com proteção contra Unsplash) */}
        <div
          className="relative w-full bg-[#f0e7db] rounded-md shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl border border-gray-100 overflow-hidden flex items-center justify-center"
          style={{ aspectRatio: "2/3" }}
        >
          {safeCoverUrl ? (
            <Image
              src={safeCoverUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            // Placeholder com Ícone (para substituir o Unsplash ou falta de capa)
            <div className="flex flex-col items-center justify-center gap-2 text-[#bfa094]">
              <BookIcon size={32} strokeWidth={1.5} />
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">
                Sem Capa
              </span>
            </div>
          )}

          {/* Ações (Hover) */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3 backdrop-blur-[2px] z-10">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600 shadow-lg transform hover:scale-110 transition"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600 shadow-lg transform hover:scale-110 transition"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* Barra de Progresso Visual */}
          {status === "lendo" && pages_total > 0 && (
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-200 z-10">
              <div
                className="h-full bg-[#ef7e77]"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          )}
        </div>

        {/* INFO */}
        <div>
          <h3
            className="font-serif font-bold text-[#1a1a1a] text-lg leading-tight line-clamp-1 group-hover:text-[#ef7e77] transition cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            {title}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-1">{author}</p>

          <div className="flex justify-between items-center mt-2">
            {rating > 0 ? (
              <StarDisplay count={rating} />
            ) : (
              <span className="text-xs text-gray-300">Sem nota</span>
            )}
            {status === "lendo" && (
              <span className="text-[10px] bg-[#ef7e77]/10 text-[#ef7e77] px-2 py-0.5 rounded-full font-bold">
                {percentage}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* --- MODAL DE EDIÇÃO --- */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-8 shadow-2xl animate-in zoom-in-95 border border-gray-100 relative">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-black"
            >
              <X />
            </button>
            <h2 className="text-2xl font-serif font-bold text-[#1a1a1a] mb-6">
              Update Progress
            </h2>

            <form onSubmit={handleUpdate} className="space-y-5">
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setEditRating(star)}
                  >
                    <Star
                      size={28}
                      className={`${
                        star <= editRating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-200"
                      } transition`}
                    />
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as BookStatus)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#ef7e77]"
                >
                  <option value="quero_ler">To Read</option>
                  <option value="lendo">Reading</option>
                  <option value="lido">Finished</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Read
                  </label>
                  <input
                    type="number"
                    value={editRead}
                    onChange={(e) => setEditRead(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 font-bold text-[#1a1a1a] focus:outline-none focus:border-[#ef7e77]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Total
                  </label>
                  <input
                    type="number"
                    value={editTotal}
                    onChange={(e) => setEditTotal(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 font-bold text-gray-500 focus:outline-none focus:border-[#ef7e77]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1a1a1a] text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition mt-2 shadow-lg"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
