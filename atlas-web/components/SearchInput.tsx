"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce"; // Instale: npm i use-debounce

export function SearchInput() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  // O "debounce" espera o usuário parar de digitar por 300ms antes de buscar
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }

    // Atualiza a URL sem recarregar a página
    replace(`/?${params.toString()}`);
  }, 300);

  return (
    <div className="relative w-full md:max-w-lg">
      <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
      <input
        type="text"
        placeholder="Search for books, authors..."
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("q")?.toString()}
        className="w-full bg-white border-none rounded-2xl py-3.5 pl-12 pr-4 outline-none shadow-sm focus:ring-2 focus:ring-[#ef7e77]/20 text-[#1a1a1a] font-medium placeholder-gray-400"
      />
    </div>
  );
}
