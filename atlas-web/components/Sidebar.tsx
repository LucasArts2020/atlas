"use client";

import {
  Home,
  BookOpen,
  Clock,
  Bookmark,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { icon: Home, path: "/", label: "Início" },
    { icon: BookOpen, path: "/books", label: "Livros" },
    { icon: Clock, path: "/timer", label: "Timer" }, // Exemplo
    { icon: Bookmark, path: "/favorites", label: "Favoritos" },
    { icon: Settings, path: "/settings", label: "Config" },
  ];

  return (
    <aside className="w-20 bg-[#f8f5f2] h-screen fixed left-0 top-0 flex flex-col items-center py-8 border-r border-gray-200/50 z-20">
      {/* Logo / Menu Icon */}
      <div className="mb-12">
        <div className="text-2xl font-serif font-bold">M</div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 flex flex-col gap-8 w-full items-center">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`p-3 rounded-full transition relative group ${
                isActive
                  ? "bg-[#ef7e77] text-white shadow-lg shadow-red-200"
                  : "text-gray-400 hover:text-gray-800"
              }`}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />

              {/* Tooltip simples */}
              <span className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button className="text-gray-400 hover:text-red-500 transition">
        <LogOut size={22} />
      </button>
    </aside>
  );
}
