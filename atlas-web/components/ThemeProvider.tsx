"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";

export default function ThemeProvider() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;

    if (savedTheme) {
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
      return;
    }

    const token = Cookies.get("atlas_token");
    if (!token) return;

    fetch("http://localhost:3000/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const theme = data?.user?.theme === "dark" ? "dark" : "light";
        localStorage.setItem("theme", theme);
        document.documentElement.classList.toggle("dark", theme === "dark");
      })
      .catch(() => {
        document.documentElement.classList.toggle("dark", false);
      });
  }, []);

  return null;
}
