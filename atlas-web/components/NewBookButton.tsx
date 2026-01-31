"use client";

import { useState } from "react";
import { Plus, X, Search, Loader2, BookOpen } from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function NewBookButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [selectedBook, setSelectedBook] = useState<{
    title: string;
    author: string;
    summary: string;
    cover_url: string;
    pages_total: number;
    pages_read: number;
    status: string;
  } | null>(null);

  const handleSearch = async (query: string) => {
    setSearchTerm(query);
    if (query.length < 3) return;

    setIsSearching(true);
    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=5`,
      );
      const data = await res.json();
      setSearchResults(data.items || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectBook = (book: any) => {
    const info = book.volumeInfo;

    // PREENCHE OS DADOS, MAS PERMITE EDIÇÃO DEPOIS
    setSelectedBook({
      title: info.title || "",
      author: info.authors ? info.authors[0] : "Desconhecido",
      summary: info.description
        ? info.description.substring(0, 300) + "..."
        : "",
      cover_url: info.imageLinks?.thumbnail?.replace("http:", "https:") || "",
      pages_total: info.pageCount || 0, // Se vier 0, você edita no input
      pages_read: 0,
      status: "quero_ler",
    });

    setSearchResults([]);
  };

  const handleSave = async () => {
    if (!selectedBook) return;
    setLoading(true);
    const token = Cookies.get("atlas_token");

    try {
      const res = await fetch("http://localhost:3000/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedBook),
      });

      if (!res.ok) throw new Error("Erro ao criar");

      setIsOpen(false);
      setSelectedBook(null);
      setSearchTerm("");
      router.refresh(); // Atualiza a página de fundo
    } catch (error) {
      alert("Erro ao salvar livro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-gray-800 text-white px-4 py-2 rounded-full font-medium transition shadow-xl shadow-gray-200 text-sm"
      >
        <Plus size={18} />
        New Book
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-[#f8f5f2]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200 flex flex-col max-h-[85vh] border border-gray-100">
            <button
              onClick={() => {
                setIsOpen(false);
                setSelectedBook(null);
              }}
              className="absolute right-6 top-6 text-gray-400 hover:text-black transition"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-serif font-bold text-[#1a1a1a] mb-6">
              Add New Book
            </h2>

            {!selectedBook && (
              <div className="flex flex-col h-full overflow-hidden">
                <div className="relative mb-6">
                  <Search
                    className="absolute left-4 top-3.5 text-gray-400"
                    size={20}
                  />
                  <input
                    autoFocus
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full bg-[#f8f5f2] border-none rounded-xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-[#ef7e77]/50 text-[#1a1a1a] placeholder-gray-400 font-medium"
                    placeholder="Search by title, author..."
                  />
                  {isSearching && (
                    <Loader2
                      className="absolute right-4 top-3.5 animate-spin text-[#ef7e77]"
                      size={20}
                    />
                  )}
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  {searchResults.map((item) => {
                    const thumbUrl =
                      item.volumeInfo.imageLinks?.smallThumbnail?.replace(
                        "http:",
                        "https:",
                      );
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectBook(item)}
                        className="flex gap-4 p-3 hover:bg-[#f8f5f2] rounded-xl cursor-pointer transition items-center group"
                      >
                        {thumbUrl ? (
                          <Image
                            src={thumbUrl}
                            alt={item.volumeInfo.title}
                            width={48}
                            height={64}
                            className="object-cover rounded shadow-sm"
                          />
                        ) : (
                          <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
                            ?
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-[#1a1a1a] text-sm line-clamp-1">
                            {item.volumeInfo.title}
                          </h4>
                          <p className="text-xs text-gray-500 line-clamp-1">
                            {item.volumeInfo.authors?.[0]}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedBook && (
              <div className="space-y-6">
                <div className="flex gap-6 bg-[#f8f5f2] p-6 rounded-2xl border border-gray-100">
                  {selectedBook.cover_url && (
                    <Image
                      src={selectedBook.cover_url}
                      alt={selectedBook.title}
                      width={80}
                      height={120}
                      className="object-cover rounded-md shadow-lg rotate-1"
                    />
                  )}
                  <div className="flex flex-col justify-center w-full">
                    <h3 className="font-serif font-bold text-xl text-[#1a1a1a] line-clamp-2 leading-tight mb-1">
                      {selectedBook.title}
                    </h3>
                    <p className="text-[#ef7e77] font-medium text-sm line-clamp-1 mb-3">
                      {selectedBook.author}
                    </p>

                    {/* INPUT CORRETOR DE PÁGINAS */}
                    <div className="bg-white p-2 rounded-lg border border-gray-200 flex items-center gap-2 w-full">
                      <BookOpen size={16} className="text-gray-400" />
                      <label className="text-xs font-bold text-gray-400 uppercase">
                        Pages:
                      </label>
                      <input
                        type="number"
                        value={selectedBook.pages_total}
                        onChange={(e) =>
                          setSelectedBook({
                            ...selectedBook,
                            pages_total: Number(e.target.value),
                          })
                        }
                        className="w-full outline-none font-bold text-[#1a1a1a] bg-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setSelectedBook(null)}
                    className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold py-3.5 rounded-xl transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading || selectedBook.pages_total <= 0}
                    className="flex-1 bg-[#1a1a1a] hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl transition disabled:opacity-50 shadow-lg"
                  >
                    {loading ? "Saving..." : "Add to Library"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
