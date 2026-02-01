"use client";

import { Sidebar } from "@/components/Sidebar";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  User,
  BookOpen,
  Heart,
  Clock,
  Star,
  ArrowLeft,
  Settings,
} from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";

type Tab = "profile" | "books" | "favorites" | "activity";

type UserData = {
  name: string;
  stats: {
    books: number;
    thisYear: number;
    favorites: number;
  };
  favoriteBooks: Array<{
    id: number;
    title: string;
    cover_url?: string | null;
  }>;
  recentActivity: Array<{
    id: number;
    type: string;
    book: string;
    rating?: number;
    date: string;
  }>;
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const token = Cookies.get("atlas_token");
        if (!token) {
          console.error("Token não encontrado");
          return;
        }

        // Busca perfil
        const profileRes = await fetch("http://localhost:3000/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!profileRes.ok) {
          throw new Error(`Profile error: ${profileRes.status}`);
        }
        const profileData = await profileRes.json();
        console.log("Profile data:", profileData);

        // Busca favoritos
        const favoritesRes = await fetch("http://localhost:3000/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!favoritesRes.ok) {
          throw new Error(`Favorites error: ${favoritesRes.status}`);
        }
        const favoritesData = await favoritesRes.json();
        console.log("Favorites data:", favoritesData);

        // Busca atividade
        const activityRes = await fetch(
          "http://localhost:3000/profile/activity",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (!activityRes.ok) {
          throw new Error(`Activity error: ${activityRes.status}`);
        }
        const activityData = await activityRes.json();
        console.log("Activity data:", activityData);

        setUserData({
          name: profileData?.user?.name || "Usuário",
          stats: profileData?.stats || { books: 0, thisYear: 0, favorites: 0 },
          favoriteBooks: (Array.isArray(favoritesData)
            ? favoritesData
            : []
          ).map((book: any) => ({
            id: book.id,
            title: book.title,
            cover_url: book.cover_url || null,
          })),
          recentActivity: Array.isArray(activityData) ? activityData : [],
        });
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f5f2] text-[#1a1a1a] font-sans flex">
        <div className="fixed left-0 top-0 h-full z-30">
          <Sidebar />
        </div>
        <main className="flex-1 ml-20 p-6 sm:p-8 md:p-10 lg:p-12 min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ef7e77]"></div>
        </main>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-[#f8f5f2] text-[#1a1a1a] font-sans flex">
        <div className="fixed left-0 top-0 h-full z-30">
          <Sidebar />
        </div>
        <main className="flex-1 ml-20 p-6 sm:p-8 md:p-10 lg:p-12 min-h-screen flex items-center justify-center">
          <p className="text-gray-500">Erro ao carregar dados do usuário</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5f2] text-[#1a1a1a] font-sans flex">
      <div className="fixed left-0 top-0 h-full z-30">
        <Sidebar />
      </div>

      <main className="flex-1 ml-20 p-6 sm:p-8 md:p-10 lg:p-12 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Header com Voltar */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition"
            >
              <ArrowLeft size={16} />
              Voltar
            </Link>
          </div>

          {/* Banner e Avatar */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            {/* Banner */}
            <div className="relative h-40 sm:h-48 z-0">
              <div className="absolute inset-0 bg-gradient-to-r from-[#ef7e77] via-[#f8a08d] to-[#eecbc4] pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.45),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.25),transparent_50%)] pointer-events-none" />
              <div className="absolute inset-0 opacity-30 bg-[linear-gradient(135deg,rgba(255,255,255,0.25)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.25)_50%,rgba(255,255,255,0.25)_75%,transparent_75%,transparent)] bg-[length:24px_24px] pointer-events-none" />
            </div>

            {/* Avatar e Info */}
            <div className="px-6 sm:px-8 md:px-10 pb-6 relative z-10">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-16 sm:-mt-20">
                {/* Avatar */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-[#ef7e77] to-[#f8a08d] flex items-center justify-center shadow-xl border-4 border-white flex-shrink-0 relative z-10">
                  <User size={56} className="text-white sm:w-16 sm:h-16" />
                </div>

                {/* Nome e Stats */}
                <div className="flex-1 pt-4 sm:pt-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1a1a1a]">
                        {userData.name}
                      </h1>
                    </div>
                    <Link
                      href="/settings"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1a1a1a] hover:bg-gray-800 text-white font-bold text-sm rounded-lg transition"
                    >
                      <Settings size={16} />
                      Configurações
                    </Link>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-6 text-center">
                    <div>
                      <div className="text-2xl font-bold text-[#ef7e77]">
                        {userData.stats.books}
                      </div>
                      <div className="text-xs text-gray-600 uppercase tracking-wider">
                        Livros
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#ef7e77]">
                        {userData.stats.thisYear}
                      </div>
                      <div className="text-xs text-gray-600 uppercase tracking-wider">
                        Este Ano
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#ef7e77]">
                        {userData.stats.favorites}
                      </div>
                      <div className="text-xs text-gray-600 uppercase tracking-wider">
                        Favoritos
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-x-auto">
            <nav className="flex gap-2 px-4 py-3 min-w-max">
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                  activeTab === "profile"
                    ? "bg-[#ef7e77] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Perfil
              </button>
              <button
                onClick={() => setActiveTab("books")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                  activeTab === "books"
                    ? "bg-[#ef7e77] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Biblioteca
              </button>
              <button
                onClick={() => setActiveTab("favorites")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                  activeTab === "favorites"
                    ? "bg-[#ef7e77] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Favoritos
              </button>
              <button
                onClick={() => setActiveTab("activity")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                  activeTab === "activity"
                    ? "bg-[#ef7e77] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Atividade
              </button>
            </nav>
          </div>

          {/* Content Area */}
          <div className="space-y-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <>
                {/* Livros Favoritos */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1a1a1a] flex items-center gap-2">
                      <Heart className="text-[#ef7e77]" size={24} />
                      Livros Favoritos
                    </h2>
                  </div>
                  {userData.favoriteBooks.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                      {userData.favoriteBooks.slice(0, 4).map((book) => (
                        <Link
                          key={book.id}
                          href={`/books/${book.id}`}
                          className="group"
                        >
                          <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-gray-100 shadow-md group-hover:shadow-xl transition-all duration-300">
                            {book.cover_url ? (
                              <Image
                                src={book.cover_url}
                                alt={book.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-br from-[#ef7e77]/20 to-[#f8a08d]/20 flex items-center justify-center">
                                <BookOpen
                                  size={48}
                                  className="text-[#ef7e77]"
                                />
                              </div>
                            )}
                          </div>
                          <h3 className="mt-3 text-sm font-medium text-[#1a1a1a] group-hover:text-[#ef7e77] transition line-clamp-2">
                            {book.title}
                          </h3>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Heart size={64} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">
                        Você ainda não tem livros favoritos
                      </p>
                    </div>
                  )}
                </div>

                {/* Atividade Recente */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1a1a1a] flex items-center gap-2">
                      <Clock className="text-[#ef7e77]" size={24} />
                      Atividade Recente
                    </h2>
                  </div>
                  {userData.recentActivity.length > 0 ? (
                    <div className="space-y-4">
                      {userData.recentActivity.slice(0, 5).map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start gap-4 p-4 rounded-xl bg-[#f8f5f2] hover:bg-[#f0ede8] transition"
                        >
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              activity.type === "review"
                                ? "bg-[#ef7e77] text-white"
                                : activity.type === "favorite"
                                  ? "bg-pink-500 text-white"
                                  : "bg-blue-500 text-white"
                            }`}
                          >
                            {activity.type === "review" && <Star size={20} />}
                            {activity.type === "favorite" && (
                              <Heart size={20} />
                            )}
                            {activity.type === "reading" && (
                              <BookOpen size={20} />
                            )}
                            {activity.type === "added" && (
                              <BookOpen size={20} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-600 mb-1">
                              {activity.type === "review" && "Avaliou"}
                              {activity.type === "favorite" &&
                                "Marcou como favorito"}
                              {activity.type === "reading" && "Começou a ler"}
                              {activity.type === "added" && "Adicionou"}
                            </p>
                            <p className="font-medium text-[#1a1a1a] mb-1">
                              {activity.book}
                            </p>
                            {activity.rating && activity.rating > 0 && (
                              <div className="flex items-center gap-1 mb-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={14}
                                    className={
                                      i < activity.rating
                                        ? "fill-[#ef7e77] text-[#ef7e77]"
                                        : "text-gray-300"
                                    }
                                  />
                                ))}
                              </div>
                            )}
                            <p className="text-xs text-gray-500">
                              {activity.date}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Clock size={64} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">
                        Nenhuma atividade registrada
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Books Tab */}
            {activeTab === "books" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1a1a1a] mb-6">
                  Todos os Livros
                </h2>
                <div className="text-center py-12">
                  <BookOpen size={64} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">
                    Lista completa de livros em breve...
                  </p>
                </div>
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === "favorites" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1a1a1a] mb-6 flex items-center gap-2">
                  <Heart className="text-[#ef7e77]" size={24} />
                  Meus Favoritos
                </h2>
                {userData.favoriteBooks.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
                    {userData.favoriteBooks.map((book) => (
                      <Link
                        key={book.id}
                        href={`/books/${book.id}`}
                        className="group"
                      >
                        <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-gray-100 shadow-md group-hover:shadow-xl transition-all duration-300">
                          {book.cover_url ? (
                            <Image
                              src={book.cover_url}
                              alt={book.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-[#ef7e77]/20 to-[#f8a08d]/20 flex items-center justify-center">
                              <BookOpen size={48} className="text-[#ef7e77]" />
                            </div>
                          )}
                        </div>
                        <h3 className="mt-3 text-sm font-medium text-[#1a1a1a] group-hover:text-[#ef7e77] transition line-clamp-2">
                          {book.title}
                        </h3>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart size={64} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">
                      Você ainda não tem livros favoritos
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === "activity" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1a1a1a] mb-6 flex items-center gap-2">
                  <Clock className="text-[#ef7e77]" size={24} />
                  Todas as Atividades
                </h2>
                {userData.recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {userData.recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-4 p-4 rounded-xl bg-[#f8f5f2] hover:bg-[#f0ede8] transition"
                      >
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            activity.type === "review"
                              ? "bg-[#ef7e77] text-white"
                              : activity.type === "favorite"
                                ? "bg-pink-500 text-white"
                                : "bg-blue-500 text-white"
                          }`}
                        >
                          {activity.type === "review" && <Star size={20} />}
                          {activity.type === "favorite" && <Heart size={20} />}
                          {activity.type === "reading" && (
                            <BookOpen size={20} />
                          )}
                          {activity.type === "added" && <BookOpen size={20} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-600 mb-1">
                            {activity.type === "review" && "Avaliou"}
                            {activity.type === "favorite" &&
                              "Marcou como favorito"}
                            {activity.type === "reading" && "Começou a ler"}
                            {activity.type === "added" && "Adicionou"}
                          </p>
                          <p className="font-medium text-[#1a1a1a] mb-1">
                            {activity.book}
                          </p>
                          {activity.rating && activity.rating > 0 && (
                            <div className="flex items-center gap-1 mb-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={
                                    i < activity.rating
                                      ? "fill-[#ef7e77] text-[#ef7e77]"
                                      : "text-gray-300"
                                  }
                                />
                              ))}
                            </div>
                          )}
                          <p className="text-xs text-gray-500">
                            {activity.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Clock size={64} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">
                      Nenhuma atividade registrada
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
