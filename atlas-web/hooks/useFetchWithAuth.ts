import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export function useFetchWithAuth() {
  const router = useRouter();

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = Cookies.get("atlas_token");

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    // Se receber 401 (Token expirado ou inválido)
    if (response.status === 401) {
      // Remove o token
      Cookies.remove("atlas_token");
      // Redireciona para login
      router.push("/login");
      throw new Error("Token expirado. Faça login novamente.");
    }

    return response;
  };

  return { fetchWithAuth };
}
