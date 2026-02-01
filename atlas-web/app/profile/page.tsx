"use client";

import { Sidebar } from "@/components/Sidebar";
import { useState } from "react";
import {
  User,
  Mail,
  Calendar,
  BookOpen,
  Settings,
  Edit2,
  Camera,
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Lucas Silva");
  const [email, setEmail] = useState("lucas@example.com");
  const [bio, setBio] = useState(
    "Apaixonado por leitura e literatura clássica. Sempre em busca de novas histórias para explorar.",
  );

  // Estatísticas (você pode buscar do backend depois)
  const stats = {
    booksRead: 24,
    currentlyReading: 3,
    wantToRead: 15,
    totalPages: 5234,
  };

  const handleSaveProfile = () => {
    // Aqui você chamaria uma API para salvar os dados
    setIsEditing(false);
    // Toast de sucesso
  };

  return (
    <div className="min-h-screen bg-[#f8f5f2] text-[#1a1a1a] font-sans flex">
      <div className="fixed left-0 top-0 h-full z-30">
        <Sidebar />
      </div>

      <main className="flex-1 ml-20 p-8 md:p-12 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Header com Voltar */}
          <div className="mb-8">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block transition"
            >
              ← Voltar
            </Link>
          </div>

          {/* Seção de Perfil */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Banner */}
            <div className="h-32 bg-gradient-to-r from-[#ef7e77] via-[#f8a08d] to-[#eecbc4] relative">
              <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition hover:scale-110 transform">
                <Camera size={20} className="text-[#ef7e77]" />
              </button>
            </div>

            {/* Conteúdo */}
            <div className="px-6 md:px-12 py-8">
              {/* Avatar e Nome */}
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-end mb-8">
                <div className="relative -mt-20">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#ef7e77] to-[#f8a08d] flex items-center justify-center shadow-xl border-4 border-white">
                    <User size={64} className="text-white" />
                  </div>
                  <button className="absolute bottom-0 right-0 bg-[#ef7e77] text-white p-2 rounded-full shadow-lg hover:shadow-xl transition hover:scale-110 transform">
                    <Camera size={18} />
                  </button>
                </div>

                <div className="flex-1">
                  {!isEditing ? (
                    <div>
                      <h1 className="text-4xl font-serif font-bold text-[#1a1a1a] mb-2">
                        {name}
                      </h1>
                      <p className="text-gray-600 flex items-center gap-2">
                        <Mail size={18} />
                        {email}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Nome
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-2 bg-[#f8f5f2] border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#ef7e77]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-2 bg-[#f8f5f2] border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#ef7e77]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    if (isEditing) handleSaveProfile();
                    else setIsEditing(true);
                  }}
                  className="px-6 py-3 bg-[#1a1a1a] hover:bg-gray-800 text-white font-bold rounded-xl transition flex items-center gap-2 shadow-lg"
                >
                  <Edit2 size={18} />
                  {isEditing ? "Salvar" : "Editar"}
                </button>
              </div>

              {/* Bio */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Bio
                </label>
                {!isEditing ? (
                  <p className="text-gray-600 leading-relaxed">{bio}</p>
                ) : (
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-4 py-3 bg-[#f8f5f2] border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#ef7e77] resize-none"
                    rows={4}
                  />
                )}
              </div>

              {/* Divider */}
              <hr className="border-gray-200 my-8" />

              {/* Estatísticas */}
              <div className="mb-8">
                <h2 className="text-2xl font-serif font-bold text-[#1a1a1a] mb-6">
                  Suas Estatísticas
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#f8f5f2] p-6 rounded-2xl text-center hover:shadow-md transition">
                    <BookOpen
                      size={28}
                      className="text-[#ef7e77] mx-auto mb-2"
                    />
                    <div className="text-3xl font-bold text-[#1a1a1a]">
                      {stats.booksRead}
                    </div>
                    <div className="text-xs text-gray-600 uppercase tracking-wider mt-1">
                      Livros Lidos
                    </div>
                  </div>

                  <div className="bg-[#f8f5f2] p-6 rounded-2xl text-center hover:shadow-md transition">
                    <BookOpen
                      size={28}
                      className="text-blue-500 mx-auto mb-2"
                    />
                    <div className="text-3xl font-bold text-[#1a1a1a]">
                      {stats.currentlyReading}
                    </div>
                    <div className="text-xs text-gray-600 uppercase tracking-wider mt-1">
                      Lendo Agora
                    </div>
                  </div>

                  <div className="bg-[#f8f5f2] p-6 rounded-2xl text-center hover:shadow-md transition">
                    <BookOpen
                      size={28}
                      className="text-yellow-500 mx-auto mb-2"
                    />
                    <div className="text-3xl font-bold text-[#1a1a1a]">
                      {stats.wantToRead}
                    </div>
                    <div className="text-xs text-gray-600 uppercase tracking-wider mt-1">
                      Quer Ler
                    </div>
                  </div>

                  <div className="bg-[#f8f5f2] p-6 rounded-2xl text-center hover:shadow-md transition">
                    <BookOpen
                      size={28}
                      className="text-green-500 mx-auto mb-2"
                    />
                    <div className="text-3xl font-bold text-[#1a1a1a]">
                      {stats.totalPages}
                    </div>
                    <div className="text-xs text-gray-600 uppercase tracking-wider mt-1">
                      Páginas Lidas
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações Adicionais */}
              <div className="mb-8">
                <h2 className="text-xl font-serif font-bold text-[#1a1a1a] mb-4">
                  Informações da Conta
                </h2>
                <div className="space-y-3 bg-[#f8f5f2] p-6 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Calendar size={18} />
                      Membro desde
                    </span>
                    <span className="font-bold text-[#1a1a1a]">
                      Janeiro de 2024
                    </span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Plano</span>
                    <span className="font-bold text-[#1a1a1a] bg-white px-3 py-1 rounded-full text-sm">
                      Premium
                    </span>
                  </div>
                </div>
              </div>

              {/* Botão para Configurações */}
              <div className="flex gap-4">
                <Link
                  href="/user"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] hover:bg-gray-800 text-white font-bold rounded-xl transition shadow-lg flex-1 justify-center"
                >
                  <Edit2 size={20} />
                  Editar Perfil
                </Link>
                <Link
                  href="/settings"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-[#1a1a1a] font-bold rounded-xl transition flex-1 justify-center"
                >
                  <Settings size={20} />
                  Configurações
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
