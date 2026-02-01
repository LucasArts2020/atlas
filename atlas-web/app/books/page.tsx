"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { BookCard } from "@/components/BookCard";
import { SearchInput } from "@/components/SearchInput";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";

// Definindo o tipo correto para evitar inconsistências
type BookStatus = "lendo" | "lido" | "quero_ler";

type Book = {
  id: number;
  title: string;
  author: string;
  summary: string;
  cover_url?: string | null;
  status: BookStatus;
  pages_total: number;
  pages_read: number;
  rating: number;
};

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [activeTab, setActiveTab] = useState("todos");
  const [loading, setLoading] = useState(true);

  // Estados para paginação
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  useEffect(() => {
    async function fetchBooks() {
      setLoading(true);
      const token = Cookies.get("atlas_token");
      if (!token) return;

      try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        if (activeTab !== "todos") params.append("status", activeTab);
        if (searchQuery) params.append("q", searchQuery);

        const res = await fetch(
          `http://localhost:3000/books?${params.toString()}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const json = await res.json();

        // --- PROTEÇÃO DE SEGURANÇA (Se o back-end não mandar paginação) ---
        if (json.pagination) {
          setBooks(json.data || []);
          setTotalPages(json.pagination.totalPages);
          setTotalItems(json.pagination.total);
        } else {
          // Fallback para evitar crash se a API estiver na versão antiga
          console.warn("API retornou formato antigo:", json);
          setBooks(Array.isArray(json) ? json : json.data || []);
          setTotalPages(1); // Assume 1 página se não vier info
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, [page, activeTab, searchQuery]);

  // Reseta para a página 1 se mudar filtros
  useEffect(() => {
    setPage(1);
  }, [activeTab, searchQuery]);

  return (
    <div className="min-h-screen bg-[#f8f5f2] text-[#1a1a1a] font-sans">
      <Sidebar />

      <main className="ml-20 xl:mr-80 p-8 md:p-12 min-h-screen transition-all duration-300">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl text-[#1a1a1a] mb-2">
              My Collection
            </h1>
            <p className="text-gray-400">
              Found{" "}
              <span className="text-[#ef7e77] font-bold">
                {totalItems} books
              </span>
            </p>
          </div>

          <div className="w-full md:w-auto">
            <SearchInput />
          </div>
        </header>

        {/* ABAS */}
        <div className="flex gap-8 border-b border-gray-200/60 mb-10 overflow-x-auto pb-1">
          {[
            { id: "todos", label: "All Books" },
            { id: "lendo", label: "Currently Reading" },
            { id: "quero_ler", label: "For Later" },
            { id: "lido", label: "Finished" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-sm font-bold tracking-wide transition relative whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-[#1a1a1a]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-0.5 bg-[#ef7e77]"></div>
              )}
            </button>
          ))}
        </div>

        {/* GRID DE LIVROS */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ef7e77]"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
              {books.map((book, index) => (
                <BookCard key={book.id} {...book} index={index} />
              ))}
            </div>

            {/* EMPTY STATE */}
            {books.length === 0 && (
              <div className="py-20 text-center opacity-50">
                <p className="font-serif text-xl mb-2">Dust & Echoes...</p>
                <p className="text-sm">No books found in this section.</p>
              </div>
            )}

            {/* CONTROLES DE PAGINAÇÃO */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12 pb-8">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-3 rounded-full bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-sm"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="font-bold text-gray-500 text-sm">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="p-3 rounded-full bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-sm"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
