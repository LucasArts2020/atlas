"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Book, Clock, Heart, Settings, LogOut, User } from "lucide-react"; // Adicionei o User aqui
import Cookies from "js-cookie";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("atlas_token");
    router.push("/login");
  };

  const menuItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Book, label: "My Books", href: "/books" },
    { icon: Clock, label: "Timer", href: "/timer" },
    { icon: Heart, label: "Favorites", href: "/favorites" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 bg-[var(--background)] border-r border-[#eecbc4]/30 flex flex-col items-center py-8 z-50">
      {/* Logo / Brand */}
      <div className="mb-10">
        <div className="w-10 h-10 bg-[#1a1a1a] rounded-xl flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg shadow-[#ef7e77]/20">
          A.
        </div>
      </div>

      {/* Menu Principal */}
      <nav className="flex-1 flex flex-col gap-6 w-full px-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative group flex items-center justify-center w-full h-12 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-white text-[#ef7e77] shadow-sm shadow-gray-100"
                  : "text-gray-400 hover:text-[#1a1a1a] hover:bg-white/50"
              }`}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />

              {/* Tooltip */}
              <span className="absolute left-14 bg-[#1a1a1a] text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-xl translate-x-2 group-hover:translate-x-0">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer da Sidebar */}
      <div className="flex flex-col gap-6 items-center w-full px-2">
        <button
          onClick={handleLogout}
          className="text-gray-400 hover:text-red-500 transition-colors p-3 rounded-xl hover:bg-red-50"
          title="Sair"
        >
          <LogOut size={20} />
        </button>

        {/* Botão de Perfil */}
        <Link
          href="/profile"
          className={`relative group flex items-center justify-center w-full h-12 rounded-xl transition-all duration-300 ${
            pathname === "/profile"
              ? "bg-white text-[#ef7e77] shadow-sm shadow-gray-100"
              : "text-gray-400 hover:text-[#1a1a1a] hover:bg-white/50"
          }`}
          title="Perfil"
        >
          <User size={22} strokeWidth={pathname === "/profile" ? 2.5 : 2} />
          <span className="absolute left-14 bg-[#1a1a1a] text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-xl translate-x-2 group-hover:translate-x-0">
            Perfil
          </span>
        </Link>
      </div>
    </aside>
  );
}
