import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "books.google.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Usado para as capas
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com", // <--- ADICIONE ESTE (Para os avatares)
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
    ],
  },
};

export default nextConfig;
