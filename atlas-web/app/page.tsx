import { Sidebar } from "@/components/Sidebar";
import { Flame, User } from "lucide-react";
import { NewBookButton } from "@/components/NewBookButton";
import { SearchInput } from "@/components/SearchInput";
import { cookies } from "next/headers";
import Link from "next/link";
import { Book } from "@/types";

// Importação dos Novos Componentes
import { ContinueReading } from "@/components/dashboard/ContinueReading";
import { DailyActivity } from "@/components/dashboard/DailyActivity";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { BookGrid } from "@/components/dashboard/BookGrid";
import { FavoriteAuthors } from "@/components/dashboard/FavoriteAuthors";

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

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function Home(props: Props) {
  const allBooks = await getBooks();
  const params = await props.searchParams;
  const query = params.q?.toLowerCase() || "";

  // Filtro
  const filteredBooks = allBooks.filter((book) => {
    return (
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query)
    );
  });

  const displayBooks = filteredBooks.slice(0, 8);

  return (
    <div className="min-h-screen bg-[#f8f5f2] text-[#1a1a1a] font-sans flex">
      <div className="fixed left-0 top-0 h-full z-30">
        <Sidebar />
      </div>

      <main className="flex-1 ml-20 p-8 md:p-12 min-h-screen transition-all">
        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            <SearchInput />
            <div className="flex items-center gap-4 w-full md:w-auto">
              <NewBookButton />
              <Link
                href="/profile"
                className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm cursor-pointer border border-gray-100 hover:border-[#ef7e77] transition overflow-hidden text-gray-400 hover:text-[#ef7e77]"
              >
                <User size={24} />
              </Link>
            </div>
          </header>

          {!query && (
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* COLUNA 1 e 2: Livro Atual */}
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
                {/* Componente Continue Reading */}
                <div className="h-full">
                  <ContinueReading books={allBooks} />
                </div>
              </div>

              {/* COLUNA 3: Atividade */}
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
                {/* Componente Daily Activity */}
                <DailyActivity />
              </div>
            </section>
          )}

          {/* ESTATÍSTICAS E METAS */}
          <StatsCards books={allBooks} />

          {/* LISTA DE LIVROS */}
          <BookGrid books={displayBooks} query={query} />

          {/* AUTORES */}
          <FavoriteAuthors books={allBooks} />
        </div>
      </main>
    </div>
  );
}
