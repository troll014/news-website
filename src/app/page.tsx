"use client";

import React, { useEffect, useState } from "react";

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  publishedAt: string;
  imageUrl?: string;
}

export default function HomePage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:4000/api/news");
        const newsData: NewsArticle[] = await response.json();
        setNews(newsData);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-4">
          Últimas Noticias
        </h1>

        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No hay noticias disponibles.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {news.map((article) => (
              <div key={article.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden">
                {article.imageUrl && (
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-64 object-cover"
                  />
                )}
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">{article.title}</h2>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {article.content && article.content !== "No hay resumen disponible"
                      ? article.content
                      : "Resumen no disponible."}
                  </p>
                  <time className="text-sm text-gray-500">
                    {new Date(article.publishedAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
