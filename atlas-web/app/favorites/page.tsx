import { Sidebar } from "@/components/Sidebar";
import { Star, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { Book } from "@/types";

async function getFavoriteBooks(): Promise<Book[]> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("atlas_token")?.value;
    if (!token) return [];

    const res = await fetch("http://localhost:3000/favorites", {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    const books = await res.json();

    return books || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function FavoritesPage() {
  const favoriteBooks = await getFavoriteBooks();

  return (
    <div className="min-h-screen bg-[#f8f5f2] text-[#1a1a1a] font-sans flex">
      <div className="fixed left-0 top-0 h-full z-30">
        <Sidebar />
      </div>

      <main className="flex-1 ml-20 p-4 sm:p-6 md:p-8 lg:p-12 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8 md:mb-12">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs sm:text-sm text-gray-500 hover:text-gray-700 mb-3 transition"
            >
              <ArrowLeft size={14} />
              Voltar
            </Link>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#1a1a1a] mb-1">
              Meus Favoritos
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-600">
              {favoriteBooks.length} livro
              {favoriteBooks.length !== 1 ? "s" : ""}{" "}
              {favoriteBooks.length === 1 ? "avaliado" : "avaliados"}
            </p>
          </div>

          {/* Conteúdo */}
          {favoriteBooks.length === 0 ? (
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 md:p-12 text-center">
              <div className="mb-4">
                <Star
                  size={40}
                  className="mx-auto text-gray-300 mb-3 sm:mb-4"
                />
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1a1a1a] mb-2">
                Nenhum livro avaliado ainda
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-4 sm:mb-6">
                Leia livros e dê suas avaliações para vê-los aqui
              </p>
              <Link
                href="/books"
                className="inline-block bg-[#1a1a1a] hover:bg-gray-800 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-lg sm:rounded-xl transition"
              >
                Ir para Biblioteca
              </Link>
            </div>
          ) : (
            <>
              {/* Grid de Favoritos */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-8 sm:mb-12">
                {favoriteBooks.map((book) => {
                  const safeCoverUrl =
                    book.cover_url && !book.cover_url.includes("unsplash")
                      ? book.cover_url
                      : null;

                  return (
                    <Link
                      key={book.id}
                      href={`/books/${book.id}`}
                      className="group bg-white rounded-lg sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-[#ef7e77] transition-all duration-300 hover:-translate-y-0.5 sm:hover:-translate-y-1 flex flex-col h-full"
                    >
                      {/* Capa do Livro */}
                      <div
                        className="relative w-full"
                        style={{ aspectRatio: "2/3" }}
                      >
                        {safeCoverUrl ? (
                          <Image
                            src={safeCoverUrl}
                            alt={book.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300 bg-[#f0e7db]"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#f0e7db] flex flex-col items-center justify-center gap-1 text-[#bfa094]">
                            <div className="text-2xl sm:text-3xl">📚</div>
                            <span className="text-xs font-bold uppercase tracking-widest opacity-50">
                              Sem Capa
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Informações */}
                      <div className="flex-1 p-2 sm:p-3 md:p-4 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-[#1a1a1a] text-xs sm:text-sm line-clamp-2 mb-0.5 sm:mb-1 group-hover:text-[#ef7e77] transition">
                            {book.title}
                          </h3>
                          <p className="text-xs text-gray-600 line-clamp-1 mb-1.5 sm:mb-2 md:mb-3">
                            {book.author}
                          </p>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1">
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={12}
                                className={`${
                                  star <= Math.round(book.rating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-bold text-gray-700">
                            {book.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Estatísticas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-2xl shadow-sm border border-gray-100 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-[#ef7e77] mb-1">
                    {favoriteBooks.length}
                  </div>
                  <p className="text-xs text-gray-600 uppercase tracking-wider">
                    Avaliados
                  </p>
                </div>

                <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-2xl shadow-sm border border-gray-100 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-yellow-500 mb-1">
                    {(
                      favoriteBooks.reduce(
                        (sum, book) => sum + book.rating,
                        0,
                      ) / favoriteBooks.length
                    ).toFixed(1)}
                  </div>
                  <p className="text-xs text-gray-600 uppercase tracking-wider">
                    Nota Média
                  </p>
                </div>

                <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-2xl shadow-sm border border-gray-100 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-green-500 mb-1">
                    {favoriteBooks.filter((b) => b.rating >= 4.5).length}
                  </div>
                  <p className="text-xs text-gray-600 uppercase tracking-wider">
                    5 Estrelas
                  </p>
                </div>

                <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-2xl shadow-sm border border-gray-100 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-500 mb-1">
                    {favoriteBooks
                      .reduce((sum, book) => sum + (book.pages_read || 0), 0)
                      .toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-600 uppercase tracking-wider">
                    Páginas
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
