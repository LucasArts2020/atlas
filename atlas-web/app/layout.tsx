import { Inter, Playfair_Display } from "next/font/google"; // Importe a Playfair
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      {/* Adicionei a cor de fundo creme aqui: bg-[#f8f5f2] */}
      <body
        className={`${inter.variable} ${playfair.variable} bg-[var(--background)] text-[var(--foreground)]`}
      >
        <ThemeProvider />
        {children}
      </body>
    </html>
  );
}
