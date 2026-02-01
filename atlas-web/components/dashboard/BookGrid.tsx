import Link from "next/link";
import Image from "next/image";
import { BookOpen, X } from "lucide-react";
import { Book } from "@/types";

interface Props {
  books: Book[];
  query: string;
}

export function BookGrid({ books, query }: Props) {
  return (
    <section className="mb-16">
      <div className="flex justify-between items-end mb-8">
        <h2 className="font-serif text-3xl font-bold text-[#1a1a1a]">
          {query ? `Search results for "${query}"` : "Popular in Library"}
        </h2>
        {query && (
          <Link
            href="/"
            className="text-xs text-red-500 hover:underline flex items-center gap-1 font-medium"
          >
            <X size={14} /> Clear filters
          </Link>
        )}
      </div>

      <div className="flex flex-wrap gap-6">
        {books.length > 0 ? (
          books.map((book) => {
            const safeCover =
              book.cover_url && !book.cover_url.includes("unsplash")
                ? book.cover_url
                : null;
            return (
              <Link
                href={`/books/${book.id}`}
                key={book.id}
                className="group cursor-pointer w-36 md:w-44 flex-shrink-0"
              >
                <div className="relative aspect-[2/3] w-full mb-3 rounded-xl overflow-hidden shadow-sm group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300 bg-white border border-gray-100">
                  {safeCover ? (
                    <Image
                      src={safeCover}
                      alt={book.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                      <BookOpen size={24} />
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
            );
          })
        ) : (
          <div className="w-full py-20 text-center text-gray-400">
            <p className="text-lg mb-2">Nenhum livro encontrado 😔</p>
            {query && (
              <Link
                href="/"
                className="text-[#ef7e77] font-bold hover:underline"
              >
                Limpar busca
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
