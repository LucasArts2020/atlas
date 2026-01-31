"use client";

import { useState } from "react";
import { Trash2, Pencil, X, Star } from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface BookProps {
  id: number;
  title: string;
  author: string;
  summary: string;
  cover_url?: string | null;
  status: "lendo" | "lido" | "quero_ler";
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
  index,
}: BookProps) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);

  // ESTADOS DO FORMULÁRIO (Preenchidos com os dados atuais)
  const [editTitle, setEditTitle] = useState(title);
  const [editAuthor, setEditAuthor] = useState(author);
  const [editStatus, setEditStatus] = useState(status);
  const [editRead, setEditRead] = useState(pages_read);
  const [editTotal, setEditTotal] = useState(pages_total);
  const [editRating, setEditRating] = useState(rating);
  const [loading, setLoading] = useState(false);

  const percentage =
    pages_total > 0
      ? Math.min(100, Math.round((pages_read / pages_total) * 100))
      : 0;

  // FUNÇÃO DE SALVAR CORRIGIDA
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault(); // Impede o recarregamento da página
    setLoading(true);
    const token = Cookies.get("atlas_token");

    try {
      const res = await fetch(`http://localhost:3000/books/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // Garante que números sejam enviados como números
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
      router.refresh(); // Força a atualização dos dados na tela
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar as alterações.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Excluir este livro?")) return;
    const token = Cookies.get("atlas_token");
    await fetch(`http://localhost:3000/books/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    router.refresh();
  };

  const StarDisplay = ({ count }: { count: number }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={12}
          className={`${star <= count ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  );

  return (
    <>
      <div className="group relative flex flex-col gap-3 w-full">
        {/* CAPA DO LIVRO */}
        <div className="relative aspect-[2/3] w-full bg-white rounded-md shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl border border-gray-100 overflow-hidden">
          {cover_url ? (
            <Image src={cover_url} alt={title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs">
              Sem Capa
            </div>
          )}

          {/* Ações (Hover) */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3 backdrop-blur-[2px]">
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

          {/* Barra de Progresso Visual na Capa */}
          {status === "lendo" && pages_total > 0 && (
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-200">
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
              {/* Estrelas */}
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setEditRating(star)}
                  >
                    <Star
                      size={28}
                      className={`${star <= editRating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} transition`}
                    />
                  </button>
                ))}
              </div>

              {/* Status */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#ef7e77]"
                >
                  <option value="quero_ler">To Read</option>
                  <option value="lendo">Reading</option>
                  <option value="lido">Finished</option>
                </select>
              </div>

              {/* Progresso (Páginas) */}
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
