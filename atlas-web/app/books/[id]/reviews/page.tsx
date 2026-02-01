"use client";

import { Sidebar } from "@/components/Sidebar";
import { ReviewItem } from "@/components/ReviewItem";
import { useState, useEffect } from "react";
import { BookOpen, ArrowLeft, MessageCircle } from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";

type Review = {
  id: number;
  rating: number;
  text?: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    username: string;
    avatarUrl?: string;
  };
};

type BookData = {
  id: number;
  title: string;
  author: string;
  cover_url?: string;
  summary?: string;
};

export default function BookReviewsPage({
  params,
}: {
  params: { id: string };
}) {
  const [book, setBook] = useState<BookData | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const token = Cookies.get("atlas_token");
    if (token) {
      // Decodificar JWT para pegar userId
      const parts = token.split(".");
      if (parts.length === 3) {
        try {
          const decoded = JSON.parse(atob(parts[1]));
          setUserId(decoded.userId);
        } catch (err) {
          console.error(err);
        }
      }
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const token = Cookies.get("atlas_token");
        console.log("Token:", token ? "exists" : "missing");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // Fetch livro
        const bookRes = await fetch(
          `http://localhost:3000/books/${params.id}`,
          {
            headers,
          },
        );
        console.log("Book response status:", bookRes.status);

        if (bookRes.ok) {
          const bookData = await bookRes.json();
          setBook(bookData);
        } else {
          console.error(
            "Failed to fetch book:",
            bookRes.status,
            bookRes.statusText,
          );
        }

        // Fetch reviews
        const reviewsRes = await fetch(
          `http://localhost:3000/books/${params.id}/reviews`,
        );
        console.log("Reviews response status:", reviewsRes.status);

        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          setReviews(reviewsData);
        } else {
          console.error(
            "Failed to fetch reviews:",
            reviewsRes.status,
            reviewsRes.statusText,
          );
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Erro ao carregar");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.id]);

  const handleReviewDeleted = (id: number) => {
    setReviews(reviews.filter((r) => r.id !== id));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[var(--background)]">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin">
            <BookOpen size={32} className="text-[#ef7e77]" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="flex min-h-screen bg-[var(--background)]">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Livro não encontrado
          </h1>
          <Link
            href="/books"
            className="flex items-center gap-2 text-[#ef7e77] hover:text-[#e86b62] transition"
          >
            <ArrowLeft size={20} />
            Voltar para Biblioteca
          </Link>
        </div>
      </div>
    );
  }

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-6">
          {/* Header */}
          <Link
            href={`/books/${book.id}`}
            className="flex items-center gap-2 text-[#ef7e77] hover:text-[#e86b62] transition mb-6"
          >
            <ArrowLeft size={20} />
            Voltar
          </Link>

          {/* Livro Info */}
          <div className="bg-white dark:bg-[var(--card)] rounded-3xl shadow-sm border border-gray-100 dark:border-[var(--card-border)] p-8 mb-8">
            <div className="flex gap-6 mb-6">
              {book.cover_url && (
                <img
                  src={book.cover_url}
                  alt={book.title}
                  className="w-24 h-36 rounded-lg object-cover shadow-md"
                />
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-serif font-bold text-[#1a1a1a] dark:text-white mb-2">
                  {book.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {book.author}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${
                            i < Math.round(Number(avgRating))
                              ? "text-yellow-400"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-lg font-semibold text-[#1a1a1a] dark:text-white">
                      {avgRating}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MessageCircle size={18} />
                    <span>
                      {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews */}
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle size={48} className="mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Nenhum review ainda
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Seja o primeiro a deixar um review sobre este livro!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewItem
                  key={review.id}
                  id={review.id}
                  rating={review.rating}
                  text={review.text}
                  createdAt={review.createdAt}
                  user={review.user}
                  isOwn={userId === review.user.id}
                  onDelete={handleReviewDeleted}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
