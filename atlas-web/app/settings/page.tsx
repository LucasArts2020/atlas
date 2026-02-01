"use client";

import { Sidebar } from "@/components/Sidebar";
import { useState } from "react";
import { Save, Moon, Sun, Bell, Lock, Trash2, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function SettingsPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveSettings = () => {
    // Aqui você poderia salvar as configurações no backend
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    Cookies.remove("atlas_token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#f8f5f2] text-[#1a1a1a] font-sans flex">
      <div className="fixed left-0 top-0 h-full z-30">
        <Sidebar />
      </div>

      <main className="flex-1 ml-20 p-8 md:p-12 min-h-screen">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block transition"
            >
              ← Voltar
            </Link>
            <h1 className="text-4xl font-serif font-bold text-[#1a1a1a] mb-2">
              Configurações
            </h1>
            <p className="text-gray-600">
              Personalize sua experiência no Atlas
            </p>
          </div>

          {/* Notificação de Sucesso */}
          {saved && (
            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-xl border border-green-300 animate-in fade-in">
              ✅ Configurações salvas com sucesso!
            </div>
          )}

          {/* Settings Sections */}
          <div className="space-y-8">
            {/* Tema */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                {theme === "light" ? (
                  <Sun size={24} className="text-yellow-500" />
                ) : (
                  <Moon size={24} className="text-blue-500" />
                )}
                <h2 className="text-xl font-bold text-[#1a1a1a]">Tema</h2>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Escolha entre modo claro ou escuro
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setTheme("light")}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition ${
                    theme === "light"
                      ? "bg-[#1a1a1a] text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Sun size={18} className="inline mr-2" />
                  Claro
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition ${
                    theme === "dark"
                      ? "bg-[#1a1a1a] text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Moon size={18} className="inline mr-2" />
                  Escuro
                </button>
              </div>
            </div>

            {/* Notificações */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <Bell size={24} className="text-[#ef7e77]" />
                <h2 className="text-xl font-bold text-[#1a1a1a]">
                  Notificações
                </h2>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Configure como você recebe notificações
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#f8f5f2] rounded-xl">
                  <label className="font-medium text-[#1a1a1a]">
                    Notificações do App
                  </label>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`w-12 h-7 rounded-full transition flex items-center ${
                      notifications ? "bg-[#ef7e77]" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition transform ${
                        notifications ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#f8f5f2] rounded-xl">
                  <label className="font-medium text-[#1a1a1a]">
                    Notificações por Email
                  </label>
                  <button
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    className={`w-12 h-7 rounded-full transition flex items-center ${
                      emailNotifications ? "bg-[#ef7e77]" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition transform ${
                        emailNotifications ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Segurança */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <Lock size={24} className="text-blue-600" />
                <h2 className="text-xl font-bold text-[#1a1a1a]">Segurança</h2>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Gerencie a segurança da sua conta
              </p>
              <button className="w-full py-3 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-xl transition border border-blue-200">
                Alterar Senha
              </button>
            </div>

            {/* Dados */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <Trash2 size={24} className="text-red-600" />
                <h2 className="text-xl font-bold text-[#1a1a1a]">Dados</h2>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Ações irreversíveis com seus dados
              </p>
              <button className="w-full py-3 px-4 bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-xl transition border border-red-200">
                Deletar Conta e Dados
              </button>
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-4 pt-6">
              <button
                onClick={handleSaveSettings}
                className="flex-1 bg-[#1a1a1a] hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-xl transition shadow-lg flex items-center justify-center gap-2"
              >
                <Save size={20} />
                Salvar Configurações
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-bold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2"
              >
                <LogOut size={20} />
                Sair
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
