"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";

import { BookCard } from "@/components/BookCard";
import { Search, SlidersHorizontal } from "lucide-react";
import Cookies from "js-cookie";

type Book = {
  id: number;
  title: string;
  author: string;
  summary: string;
  cover_url?: string | null;
  status: "lendo" | "lido" | "quero_ler";
  pages_total: number;
  pages_read: number;
  rating: number;
};

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [activeTab, setActiveTab] = useState<
    "todos" | "lendo" | "lido" | "quero_ler"
  >("todos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      const token = Cookies.get("atlas_token");
      if (!token) return;
      try {
        const res = await fetch("http://localhost:3000/books", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        setBooks(Array.isArray(json) ? json : json.data || []);
      } catch (error) {
        console.error("Error", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  const filteredBooks =
    activeTab === "todos"
      ? books
      : books.filter((book) => (book.status || "quero_ler") === activeTab);

  return (
    <div className="min-h-screen bg-[#f8f5f2] text-[#1a1a1a] font-sans">
      <Sidebar />

      <main className="ml-20 xl:mr-80 p-8 md:p-12 min-h-screen transition-all duration-300">
        {/* HEADER */}
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl text-[#1a1a1a] mb-2">
              My Collection
            </h1>
            <p className="text-gray-400">
              You have{" "}
              <span className="text-[#ef7e77] font-bold">
                {books.length} books
              </span>{" "}
              in your library.
            </p>
          </div>

          <div className="hidden md:flex gap-4">
            {/* Barra de Busca Local */}
            <div className="relative">
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
              <input
                placeholder="Search in library..."
                className="bg-white border border-gray-200 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#ef7e77] w-64 shadow-sm"
              />
            </div>
            <button className="bg-white p-2 rounded-full border border-gray-200 text-gray-500 hover:text-[#ef7e77] shadow-sm">
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </header>

        {/* ABAS MINIMALISTAS (TEXTO) */}
        <div className="flex gap-8 border-b border-gray-200/60 mb-10 overflow-x-auto pb-1">
          {[
            { id: "todos", label: "All Books" },
            { id: "lendo", label: "Currently Reading" },
            { id: "quero_ler", label: "For Later" },
            { id: "lido", label: "Finished" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
            {filteredBooks.map((book, index) => (
              <BookCard key={book.id} {...book} index={index} />
            ))}

            {filteredBooks.length === 0 && (
              <div className="col-span-full py-20 text-center opacity-50">
                <p className="font-serif text-xl mb-2">Dust & Echoes...</p>
                <p className="text-sm">
                  There are no books in this section yet.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
