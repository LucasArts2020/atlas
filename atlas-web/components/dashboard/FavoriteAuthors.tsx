import { Book } from "@/types";

export function FavoriteAuthors({ books }: { books: Book[] }) {
  const uniqueAuthors = Array.from(new Set(books.map((b) => b.author))).slice(
    0,
    5,
  );

  return (
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
                <div className="w-full h-full rounded-full overflow-hidden relative bg-[#f8f5f2] flex items-center justify-center text-[#ef7e77] font-bold text-xl border-2 border-[#ef7e77]/20 group-hover:bg-[#ef7e77] group-hover:text-white transition duration-300">
                  {author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()}
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
  );
}
