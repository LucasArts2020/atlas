"use client";

import { Sidebar } from "@/components/Sidebar";
import { useState, useEffect } from "react";
import { Save, Moon, Sun, Bell, Lock, Trash2, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

type UserProfile = {
  name: string;
};

export default function SettingsPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "",
  });
  const [editedProfile, setEditedProfile] = useState<UserProfile>({
    name: "",
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = Cookies.get("atlas_token");
        if (!token) return;

        // Carrega tema do localStorage
        const savedTheme = localStorage.getItem("theme") as
          | "light"
          | "dark"
          | null;
        if (savedTheme) {
          setTheme(savedTheme);
        }

        const res = await fetch("http://localhost:3000/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        const profile = {
          name: data.user.name,
        };

        const userTheme = data.user.theme === "dark" ? "dark" : "light";
        setTheme(userTheme);

        setUserProfile(profile);
        setEditedProfile(profile);
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const handleSaveSettings = async () => {
    try {
      const token = Cookies.get("atlas_token");
      if (!token) return;

      // Salva tema
      localStorage.setItem("theme", theme);

      const res = await fetch("http://localhost:3000/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editedProfile.name,
          theme,
        }),
      });

      const responseData = await res.json();

      if (res.ok) {
        setUserProfile(editedProfile);
        localStorage.setItem("theme", theme);
        document.documentElement.classList.toggle("dark", theme === "dark");
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        console.error("Erro ao salvar perfil:", responseData);
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError("");

    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setPasswordError("Preencha todos os campos");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("As senhas não correspondem");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("Nova senha deve ter no mínimo 6 caracteres");
      return;
    }

    try {
      const token = Cookies.get("atlas_token");
      if (!token) return;

      const res = await fetch("http://localhost:3000/profile/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setPasswordSuccess(true);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(() => {
          setPasswordSuccess(false);
          setShowPasswordModal(false);
        }, 2000);
      } else {
        setPasswordError(data.error || "Erro ao alterar senha");
      }
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      setPasswordError("Erro ao alterar senha");
    }
  };

  const handleLogout = () => {
    Cookies.remove("atlas_token");
    router.push("/login");
  };

  return (
    <>
      {/* Modal de Alterar Senha */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--card)] rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">
              Alterar Senha
            </h2>

            {passwordError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-xl text-sm">
                ✅ Senha alterada com sucesso!
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha Atual
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ef7e77] focus:border-transparent outline-none"
                  placeholder="Digite sua senha atual"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nova Senha
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ef7e77] focus:border-transparent outline-none"
                  placeholder="Digite a nova senha"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ef7e77] focus:border-transparent outline-none"
                  placeholder="Confirme a nova senha"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleChangePassword}
                className="flex-1 px-4 py-2 bg-[#ef7e77] text-white font-medium rounded-xl hover:bg-[#e66b64] transition"
              >
                Alterar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans flex">
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
              <h1 className="text-4xl font-serif font-bold text-[var(--foreground)] mb-2">
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

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ef7e77]"></div>
              </div>
            ) : (
              <>
                {/* Perfil */}
                <div className="bg-[var(--card)] p-6 rounded-2xl shadow-sm border border-[var(--card-border)] mb-8">
                  <h2 className="text-xl font-bold text-[var(--foreground)] mb-6">
                    Informações do Perfil
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome
                      </label>
                      <input
                        type="text"
                        value={editedProfile.name}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ef7e77] focus:border-transparent outline-none"
                        placeholder="Seu nome completo"
                      />
                    </div>
                  </div>
                </div>

                {/* Settings Sections */}
                <div className="space-y-8">
                  {/* Tema */}
                  <div className="bg-[var(--card)] p-6 rounded-2xl shadow-sm border border-[var(--card-border)]">
                    <div className="flex items-center gap-3 mb-4">
                      {theme === "light" ? (
                        <Sun size={24} className="text-yellow-500" />
                      ) : (
                        <Moon size={24} className="text-blue-500" />
                      )}
                      <h2 className="text-xl font-bold text-[var(--foreground)]">
                        Tema
                      </h2>
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
                  <div className="bg-[var(--card)] p-6 rounded-2xl shadow-sm border border-[var(--card-border)]">
                    <div className="flex items-center gap-3 mb-4">
                      <Bell size={24} className="text-[#ef7e77]" />
                      <h2 className="text-xl font-bold text-[var(--foreground)]">
                        Notificações
                      </h2>
                    </div>
                    <p className="text-sm text-gray-600 mb-6">
                      Configure como você recebe notificações
                    </p>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-[var(--background)] rounded-xl">
                        <label className="font-medium text-[var(--foreground)]">
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

                      <div className="flex items-center justify-between p-4 bg-[var(--background)] rounded-xl">
                        <label className="font-medium text-[var(--foreground)]">
                          Notificações por Email
                        </label>
                        <button
                          onClick={() =>
                            setEmailNotifications(!emailNotifications)
                          }
                          className={`w-12 h-7 rounded-full transition flex items-center ${
                            emailNotifications ? "bg-[#ef7e77]" : "bg-gray-300"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full transition transform ${
                              emailNotifications
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Segurança */}
                  <div className="bg-[var(--card)] p-6 rounded-2xl shadow-sm border border-[var(--card-border)]">
                    <div className="flex items-center gap-3 mb-4">
                      <Lock size={24} className="text-blue-600" />
                      <h2 className="text-xl font-bold text-[var(--foreground)]">
                        Segurança
                      </h2>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Gerencie a segurança da sua conta
                    </p>
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="w-full py-3 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-xl transition border border-blue-200"
                    >
                      Alterar Senha
                    </button>
                  </div>

                  {/* Dados */}
                  <div className="bg-[var(--card)] p-6 rounded-2xl shadow-sm border border-[var(--card-border)]">
                    <div className="flex items-center gap-3 mb-4">
                      <Trash2 size={24} className="text-red-600" />
                      <h2 className="text-xl font-bold text-[var(--foreground)]">
                        Dados
                      </h2>
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
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
