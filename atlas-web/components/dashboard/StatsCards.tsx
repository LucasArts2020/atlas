import { Trophy, Layers, BookCheck, Clock } from "lucide-react";
import { Book } from "@/types";

export function StatsCards({ books }: { books: Book[] }) {
  // Lógica de Cálculo
  const finishedBooks = books.filter((b) => b.status === "lido");
  const readingBooks = books.filter((b) => b.status === "lendo");

  const totalPagesRead = books.reduce((acc, book) => {
    if (book.status === "lido") return acc + book.pages_total;
    return acc + book.pages_read;
  }, 0);

  const yearlyGoal = 20;
  const booksReadThisYear = finishedBooks.length;
  const yearlyProgress = Math.min(
    100,
    Math.round((booksReadThisYear / yearlyGoal) * 100),
  );

  const totalBooksWithProgress =
    finishedBooks.length + (readingBooks.length > 0 ? 1 : 0);
  const avgPages =
    totalBooksWithProgress > 0
      ? Math.round(totalPagesRead / totalBooksWithProgress)
      : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
      {/* Card 1: Meta */}
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

      {/* Card 2: Páginas */}
      <StatItem
        label="Total Pages"
        value={totalPagesRead.toLocaleString()}
        subtext="Across all your books"
        icon={Layers}
        color="blue"
      />

      {/* Card 3: Terminados */}
      <StatItem
        label="Books Finished"
        value={finishedBooks.length.toString()}
        subtext="Keep up the good work!"
        icon={BookCheck}
        color="green"
      />

      {/* Card 4: Média */}
      <StatItem
        label="Avg. Pages/Book"
        value={avgPages.toString()}
        subtext="Book length average"
        icon={Clock}
        color="purple"
      />
    </div>
  );
}

// Subcomponente simples para evitar repetição
function StatItem({ label, value, subtext, icon: Icon, color }: any) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-500",
    green: "bg-green-50 text-green-500",
    purple: "bg-purple-50 text-purple-500",
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-[#ef7e77]/30 transition">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
            {label}
          </p>
          <h3 className="text-3xl font-serif font-bold text-[#1a1a1a]">
            {value}
          </h3>
        </div>
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            colorClasses[color as keyof typeof colorClasses]
          }`}
        >
          <Icon size={20} />
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2">{subtext}</p>
    </div>
  );
}
