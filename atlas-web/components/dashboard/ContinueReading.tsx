import Link from "next/link";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import { Book } from "@/types"; // Importe do seu arquivo de tipos

export function ContinueReading({ books }: { books: Book[] }) {
  const currentBook = books.find((b) => b.status === "lendo");

  if (!currentBook) {
    return (
      <div className="bg-white p-10 rounded-3xl border border-dashed border-gray-300 text-center h-full flex flex-col items-center justify-center min-h-[300px]">
        <BookOpen className="mx-auto text-gray-300 mb-4" size={40} />
        <p className="text-gray-500 font-medium">
          Você não está lendo nenhum livro no momento.
        </p>
      </div>
    );
  }

  const progress =
    currentBook.pages_total > 0
      ? Math.round((currentBook.pages_read / currentBook.pages_total) * 100)
      : 0;

  // Proteção contra imagem quebrada
  const safeCover =
    currentBook.cover_url && !currentBook.cover_url.includes("unsplash")
      ? currentBook.cover_url
      : null;

  return (
    <Link href={`/books/${currentBook.id}`} className="block h-full">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 items-start hover:shadow-md transition duration-300 cursor-pointer group h-full">
        <div className="relative w-32 sm:w-40 aspect-[2/3] rounded-xl overflow-hidden shadow-lg flex-shrink-0 bg-gray-100">
          {safeCover ? (
            <Image
              src={safeCover}
              alt={currentBook.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <BookOpen size={32} />
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
            <p className="text-gray-500 font-medium">{currentBook.author}</p>
          </div>
          <div className="mt-6">
            <div className="flex justify-between text-sm font-bold text-gray-600 mb-2">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#ef7e77] rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
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
  );
}
