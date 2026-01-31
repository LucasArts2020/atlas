import { Sidebar } from "@/components/Sidebar";
import {
  Flame,
  TrendingUp,
  BookOpen,
  X,
  Trophy,
  BookCheck,
  Layers,
  Clock,
} from "lucide-react";
import { NewBookButton } from "@/components/NewBookButton";
import { SearchInput } from "@/components/SearchInput";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

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

async function getBooks(): Promise<Book[]> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("atlas_token")?.value;
    if (!token) return [];

    const res = await fetch("http://localhost:3000/books", {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || json || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Definição de Tipos para Next.js 15
type Props = {
  searchParams: Promise<{ q?: string; category?: string }>;
};

export default async function Home(props: Props) {
  const allBooks = await getBooks();

  // Await nos params
  const params = await props.searchParams;
  const query = params.q?.toLowerCase() || "";

  // Filtros de Busca
  const filteredBooks = allBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query);
    return matchesSearch;
  });

  // --- CÁLCULOS DO DASHBOARD ---
  const readingBooks = allBooks.filter((b) => b.status === "lendo");
  const finishedBooks = allBooks.filter((b) => b.status === "lido");
  const recentBooks = filteredBooks.slice(0, 8);

  // Total de Páginas Lidas
  const totalPagesRead = allBooks.reduce((acc, book) => {
    if (book.status === "lido") return acc + book.pages_total;
    return acc + book.pages_read;
  }, 0);

  // Meta Anual
  const yearlyGoal = 20;
  const booksReadThisYear = finishedBooks.length;
  const yearlyProgress = Math.min(
    100,
    Math.round((booksReadThisYear / yearlyGoal) * 100),
  );

  // Média de Páginas (Cálculo Seguro)
  const totalBooksWithProgress =
    finishedBooks.length + (readingBooks.length > 0 ? 1 : 0);
  const avgPages =
    totalBooksWithProgress > 0
      ? Math.round(totalPagesRead / totalBooksWithProgress)
      : 0;

  // Autores Únicos
  const uniqueAuthors = Array.from(
    new Set(allBooks.map((b) => b.author)),
  ).slice(0, 5);

  // Livro Atual (Destaque)
  const currentBook = readingBooks[0];
  const progressPercentage =
    currentBook && currentBook.pages_total > 0
      ? Math.round((currentBook.pages_read / currentBook.pages_total) * 100)
      : 0;

  // Mock de Heatmap
  const today = new Date();
  const days = Array.from({ length: 112 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (111 - i));
    return d;
  });

  return (
    <div className="min-h-screen bg-[#f8f5f2] text-[#1a1a1a] font-sans flex">
      <div className="fixed left-0 top-0 h-full z-30">
        <Sidebar />
      </div>

      <main className="flex-1 ml-20 p-8 md:p-12 min-h-screen transition-all">
        <div className="max-w-7xl mx-auto">
          <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            <SearchInput />
            <div className="flex items-center gap-4 w-full md:w-auto">
              <NewBookButton />
              <Link
                href="/profile"
                className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm cursor-pointer border border-gray-100 hover:border-[#ef7e77] transition overflow-hidden"
              >
                <Image
                  src="https://source.unsplash.com/random/100x100?portrait"
                  alt="User"
                  width={48}
                  height={48}
                  className="rounded-full w-full h-full object-cover"
                />
              </Link>
            </div>
          </header>

          {/* Feedback de Filtro Ativo */}
          {query && (
            <div className="mb-8 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <span className="text-gray-500 text-sm">Filtering by:</span>
              <span className="bg-white px-3 py-1 rounded-full text-sm font-bold border border-gray-200 shadow-sm">
                "{query}"
              </span>
              <Link
                href="/"
                className="ml-2 text-xs text-red-500 hover:underline flex items-center gap-1 font-medium"
              >
                <X size={14} /> Clear filters
              </Link>
            </div>
          )}

          {!query && (
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* COLUNA 1 e 2: Continue Reading */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="flex justify-between items-end">
                  <h2 className="font-serif text-3xl font-bold text-[#1a1a1a]">
                    Continue Reading
                  </h2>
                  <Link
                    href="/books?filter=lendo"
                    className="text-sm font-bold text-gray-400 hover:text-[#ef7e77] cursor-pointer transition"
                  >
                    View Library
                  </Link>
                </div>

                {readingBooks.length > 0 ? (
                  <Link href={`/books/${currentBook.id}`} className="block">
                    {/* Transformei o card inteiro em Link para a página de detalhes */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 items-start hover:shadow-md transition duration-300 cursor-pointer group">
                      <div className="relative w-32 sm:w-40 aspect-[2/3] rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                        {currentBook.cover_url ? (
                          <Image
                            src={currentBook.cover_url}
                            alt={currentBook.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                            Sem Capa
                          </div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between h-full py-2 w-full">
                        <div>
                          <div className="flex gap-2 mb-2">
                            <span className="bg-[#ef7e77]/10 text-[#ef7e77] text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                              Reading Now
                            </span>
                          </div>
                          <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-2 leading-tight line-clamp-2 group-hover:text-[#ef7e77] transition">
                            {currentBook.title}
                          </h3>
                          <p className="text-gray-500 font-medium">
                            {currentBook.author}
                          </p>
                        </div>
                        <div className="mt-6">
                          <div className="flex justify-between text-sm font-bold text-gray-600 mb-2">
                            <span>Progress</span>
                            <span>{progressPercentage}%</span>
                          </div>
                          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#ef7e77] rounded-full transition-all duration-1000"
                              style={{ width: `${progressPercentage}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-400 mt-2">
                            <span className="font-bold text-gray-800">
                              {currentBook.pages_read}
                            </span>{" "}
                            pages read of{" "}
                            <span className="font-bold text-gray-800">
                              {currentBook.pages_total}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="bg-white p-10 rounded-3xl border border-dashed border-gray-300 text-center h-full flex flex-col items-center justify-center">
                    <BookOpen
                      className="mx-auto text-gray-300 mb-4"
                      size={40}
                    />
                    <p className="text-gray-500 font-medium">
                      Você não está lendo nenhum livro no momento.
                    </p>
                  </div>
                )}
              </div>

              {/* COLUNA 3: Activity Heatmap */}
              <div className="lg:col-span-1 flex flex-col gap-6">
                <div className="flex justify-between items-end">
                  <h2 className="font-serif text-2xl font-bold text-[#1a1a1a] flex items-center gap-2">
                    Activity{" "}
                    <Flame
                      size={20}
                      className="text-[#ef7e77] fill-[#ef7e77]"
                    />
                  </h2>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-full flex flex-col justify-center items-center hover:shadow-md transition duration-300">
                  <div className="flex gap-2 mb-6 w-full justify-between items-center">
                    <div>
                      <p className="text-3xl font-bold text-[#1a1a1a]">12</p>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                        Day Streak
                      </p>
                    </div>
                    <div className="h-10 w-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
                      <TrendingUp size={20} />
                    </div>
                  </div>
                  <div className="flex gap-1.5 self-center">
                    <div className="grid grid-rows-7 grid-flow-col gap-1.5">
                      {days.map((day, i) => {
                        const isActive = (i * 7 + 3) % 10 > 5;
                        return (
                          <div
                            key={i}
                            className={`w-2.5 h-2.5 rounded-sm ${isActive ? "bg-[#ef7e77]" : "bg-gray-100"}`}
                          ></div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="w-full mt-6 pt-4 border-t border-gray-100 flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    <span>Less</span>
                    <span>More</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* SEÇÃO: ESTATÍSTICAS E METAS */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-[#1a1a1a] mb-6">
              2026 Reading Goals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Meta de Livros */}
              <div className="bg-[#1a1a1a] text-white p-6 rounded-3xl shadow-lg flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                  <Trophy size={80} />
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                    Yearly Goal
                  </p>
                  <h3 className="text-3xl font-serif font-bold">
                    {booksReadThisYear}{" "}
                    <span className="text-lg text-gray-500 font-sans font-normal">
                      / {yearlyGoal}
                    </span>
                  </h3>
                </div>
                <div className="mt-4">
                  <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#ef7e77]"
                      style={{ width: `${yearlyProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {yearlyProgress}% completed
                  </p>
                </div>
              </div>

              {/* Card 2: Páginas Lidas */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-[#ef7e77]/30 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                      Total Pages
                    </p>
                    <h3 className="text-3xl font-serif font-bold text-[#1a1a1a]">
                      {totalPagesRead.toLocaleString()}
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                    <Layers size={20} />
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Across all your books
                </p>
              </div>

              {/* Card 3: Livros Terminados */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-[#ef7e77]/30 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                      Books Finished
                    </p>
                    <h3 className="text-3xl font-serif font-bold text-[#1a1a1a]">
                      {finishedBooks.length}
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
                    <BookCheck size={20} />
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Keep up the good work!
                </p>
              </div>

              {/* Card 4: Tempo Médio */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-[#ef7e77]/30 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                      Avg. Pages/Book
                    </p>
                    <h3 className="text-3xl font-serif font-bold text-[#1a1a1a]">
                      {avgPages}
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center">
                    <Clock size={20} />
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Book length average
                </p>
              </div>
            </div>
          </section>

          {/* LISTA DE LIVROS */}
          <section className="mb-16">
            <div className="flex justify-between items-end mb-8">
              <h2 className="font-serif text-3xl font-bold text-[#1a1a1a]">
                {query ? `Search results for "${query}"` : "Popular in Library"}
              </h2>
            </div>

            <div className="flex flex-wrap gap-6">
              {recentBooks.length > 0 ? (
                recentBooks.map((book) => (
                  // --- CORREÇÃO IMPORTANTE: Transformei o card em LINK para a página de detalhes ---
                  <Link
                    href={`/books/${book.id}`}
                    key={book.id}
                    className="group cursor-pointer w-36 md:w-44 flex-shrink-0"
                  >
                    <div className="relative aspect-[2/3] w-full mb-3 rounded-xl overflow-hidden shadow-sm group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300 bg-white">
                      {book.cover_url ? (
                        <Image
                          src={book.cover_url}
                          alt={book.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                          Capa
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <h3 className="font-serif font-bold text-[#1a1a1a] text-sm leading-tight line-clamp-2 group-hover:text-[#ef7e77] transition">
                      {book.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                      {book.author}
                    </p>
                  </Link>
                ))
              ) : (
                <div className="w-full py-20 text-center text-gray-400">
                  <p className="text-lg mb-2">Nenhum livro encontrado 😔</p>
                  <Link
                    href="/"
                    className="text-[#ef7e77] font-bold hover:underline"
                  >
                    Limpar busca
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* AUTORES */}
          <section className="pb-10">
            <h2 className="font-serif text-2xl font-bold text-[#1a1a1a] mb-6">
              Favorite Authors
            </h2>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-wrap gap-10 items-center justify-center md:justify-start">
              {uniqueAuthors.length > 0 ? (
                uniqueAuthors.map((author, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-3 cursor-pointer group"
                  >
                    <div className="w-20 h-20 rounded-full p-1 border-2 border-transparent group-hover:border-[#ef7e77] transition relative">
                      <div className="w-full h-full rounded-full overflow-hidden relative bg-gray-200">
                        <Image
                          src={`https://source.unsplash.com/random/100x100?portrait&sig=${i + 10}`}
                          alt={author}
                          fill
                          className="object-cover filter grayscale group-hover:grayscale-0 transition duration-500"
                        />
                      </div>
                    </div>
                    <p className="text-sm font-bold text-gray-500 group-hover:text-[#1a1a1a] transition">
                      {author.split(" ").slice(0, 2).join(" ")}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 italic">
                  Adicione livros para ver seus autores favoritos aqui.
                </p>
              )}
              <div className="flex flex-col items-center gap-3 cursor-pointer group">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 group-hover:border-[#ef7e77] group-hover:text-[#ef7e77] transition">
                  <span className="text-xl font-bold">+</span>
                </div>
                <p className="text-sm font-bold text-gray-400">View All</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
