"use client";

import { Sidebar } from "@/components/Sidebar";
import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Cake,
  BookOpen,
  Award,
  ArrowLeft,
  Save,
} from "lucide-react";
import Link from "next/link";

export default function UserPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  // Estados do formulário
  const [formData, setFormData] = useState({
    name: "Lucas Silva",
    email: "lucas@example.com",
    phone: "(11) 99999-9999",
    birthDate: "1995-03-15",
    location: "São Paulo, SP",
    favoriteGenre: "Ficção Científica",
    bio: "Apaixonado por leitura e literatura clássica. Sempre em busca de novas histórias para explorar.",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Aqui você chamaria uma API para salvar os dados
    setSaved(true);
    setIsEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const genres = [
    "Ficção Científica",
    "Fantasia",
    "Romance",
    "Mistério",
    "Biografia",
    "História",
    "Autoajuda",
    "Poesia",
    "Aventura",
  ];

  return (
    <div className="min-h-screen bg-[#f8f5f2] text-[#1a1a1a] font-sans flex">
      <div className="fixed left-0 top-0 h-full z-30">
        <Sidebar />
      </div>

      <main className="flex-1 ml-20 p-8 md:p-12 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4 transition"
            >
              <ArrowLeft size={16} />
              Voltar ao Perfil
            </Link>
          </div>

          {/* Notificação de Sucesso */}
          {saved && (
            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-xl border border-green-300 animate-in fade-in flex items-center gap-3">
              <span className="text-xl">✅</span>
              <span className="font-medium">
                Dados atualizados com sucesso!
              </span>
            </div>
          )}

          {/* Seção Principal */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header do Card */}
            <div className="h-40 bg-gradient-to-r from-[#ef7e77] via-[#f8a08d] to-[#eecbc4] relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 -mb-12 rounded-2xl bg-gradient-to-br from-[#ef7e77] to-[#f8a08d] flex items-center justify-center shadow-xl border-4 border-white">
                  <User size={48} className="text-white" />
                </div>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="px-6 md:px-12 py-8 pt-20">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-4xl font-serif font-bold text-[#1a1a1a] mb-2">
                    {isEditing ? "Editar Perfil" : formData.name}
                  </h1>
                  {!isEditing && (
                    <p className="text-gray-600 flex items-center gap-2">
                      <Mail size={18} />
                      {formData.email}
                    </p>
                  )}
                </div>
                <button
                  onClick={() =>
                    isEditing ? handleSave() : setIsEditing(true)
                  }
                  className="px-6 py-3 bg-[#1a1a1a] hover:bg-gray-800 text-white font-bold rounded-xl transition shadow-lg flex items-center gap-2"
                >
                  {isEditing ? (
                    <>
                      <Save size={20} />
                      Salvar
                    </>
                  ) : (
                    "Editar Dados"
                  )}
                </button>
              </div>

              {/* Formulário */}
              <div className="space-y-6">
                {/* Nome */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <User size={18} className="inline mr-2" />
                    Nome Completo
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#f8f5f2] border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#ef7e77]"
                    />
                  ) : (
                    <p className="text-gray-800 text-lg">{formData.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <Mail size={18} className="inline mr-2" />
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#f8f5f2] border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#ef7e77]"
                    />
                  ) : (
                    <p className="text-gray-800">{formData.email}</p>
                  )}
                </div>

                {/* Telefone */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <Phone size={18} className="inline mr-2" />
                    Telefone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#f8f5f2] border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#ef7e77]"
                    />
                  ) : (
                    <p className="text-gray-800">{formData.phone}</p>
                  )}
                </div>

                {/* Data de Nascimento */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <Cake size={18} className="inline mr-2" />
                    Data de Nascimento
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#f8f5f2] border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#ef7e77]"
                    />
                  ) : (
                    <p className="text-gray-800">
                      {new Date(formData.birthDate).toLocaleDateString("pt-BR")}
                    </p>
                  )}
                </div>

                {/* Localização */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <MapPin size={18} className="inline mr-2" />
                    Localização
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#f8f5f2] border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#ef7e77]"
                      placeholder="Cidade, Estado"
                    />
                  ) : (
                    <p className="text-gray-800">{formData.location}</p>
                  )}
                </div>

                {/* Gênero Favorito */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <Award size={18} className="inline mr-2" />
                    Gênero Favorito
                  </label>
                  {isEditing ? (
                    <select
                      name="favoriteGenre"
                      value={formData.favoriteGenre}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#f8f5f2] border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#ef7e77]"
                    >
                      {genres.map((genre) => (
                        <option key={genre} value={genre}>
                          {genre}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-gray-800">{formData.favoriteGenre}</p>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <BookOpen size={18} className="inline mr-2" />
                    Sobre Você
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#f8f5f2] border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#ef7e77] resize-none"
                      rows={5}
                      placeholder="Conte um pouco sobre você..."
                    />
                  ) : (
                    <p className="text-gray-800 leading-relaxed">
                      {formData.bio}
                    </p>
                  )}
                </div>
              </div>

              {/* Divider */}
              <hr className="border-gray-200 my-8" />

              {/* Informações da Conta */}
              <div>
                <h2 className="text-xl font-serif font-bold text-[#1a1a1a] mb-4">
                  Informações da Conta
                </h2>
                <div className="bg-[#f8f5f2] p-6 rounded-2xl space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID de Usuário</span>
                    <span className="font-bold text-[#1a1a1a]">#12345</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Membro desde</span>
                    <span className="font-bold text-[#1a1a1a]">
                      Janeiro de 2024
                    </span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status da Conta</span>
                    <span className="font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">
                      Ativa
                    </span>
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              {isEditing && (
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-[#1a1a1a] hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2"
                  >
                    <Save size={20} />
                    Salvar Alterações
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
