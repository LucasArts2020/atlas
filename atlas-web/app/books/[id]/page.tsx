import { Sidebar } from "@/components/Sidebar";
import { BookDetails } from "@/components/BookDetails";
import { cookies } from "next/headers";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

async function getBook(id: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("atlas_token")?.value;

    // Debug: Vamos ver o que está acontecendo no terminal
    console.log(`🔍 Buscando livro ID: ${id}`);

    if (!token) {
      console.log("❌ Sem token de autenticação");
      return null;
    }

    const res = await fetch(`http://localhost:3000/books/${id}`, {
      cache: "no-store", // Garante que sempre pegue o dado fresco
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      console.log(`❌ Erro na API: ${res.status} - ${res.statusText}`);
      return null;
    }

    const json = await res.json();
    console.log("✅ Livro encontrado:", json.title || json.data?.title);

    // Adaptação caso sua API retorne { data: { ... } } ou direto { ... }
    return json.data || json;
  } catch (error) {
    console.error("❌ Erro fatal ao buscar livro:", error);
    return null;
  }
}

export default async function BookPage(props: Props) {
  const params = await props.params;
  const book = await getBook(params.id);

  if (!book) {
    return (
      <div className="min-h-screen bg-[#f8f5f2] text-[#1a1a1a] font-sans flex">
        <div className="fixed left-0 top-0 h-full z-30">
          <Sidebar />
        </div>
        <main className="flex-1 ml-20 p-8 md:p-12 min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-3xl font-serif font-bold mb-2">
            Livro não encontrado 😔
          </h1>
          <p className="text-gray-500 mb-6">
            Não conseguimos carregar os detalhes do livro ID: {params.id}
          </p>
          <Link
            href="/"
            className="bg-[#1a1a1a] text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition"
          >
            Voltar para a Estante
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5f2] text-[#1a1a1a] font-sans flex">
      <div className="fixed left-0 top-0 h-full z-30">
        <Sidebar />
      </div>

      <main className="flex-1 ml-20 p-8 md:p-12 min-h-screen">
        <BookDetails book={book} />
      </main>
    </div>
  );
}
