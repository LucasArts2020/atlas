import { Flame, TrendingUp } from "lucide-react";

export function DailyActivity() {
  // Mock de dados (igual ao original)
  const today = new Date();
  const days = Array.from({ length: 112 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (111 - i));
    return d;
  });

  return (
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
                className={`w-2.5 h-2.5 rounded-sm ${
                  isActive ? "bg-[#ef7e77]" : "bg-gray-100"
                }`}
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
  );
}
