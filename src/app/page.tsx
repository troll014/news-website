"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  publishedAt: Date;
}

export default function HomePage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      try {
        const q = query(collection(db, "news"), orderBy("publishedAt", "desc"));
        const querySnapshot = await getDocs(q);
        const newsData: NewsArticle[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          newsData.push({
            id: doc.id,
            title: data.title,
            content: data.content,
            publishedAt: new Date(data.publishedAt),
          });
        });
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
    <main className="max-w-5xl mx-auto p-8 bg-white min-h-screen font-sans">
      <h1 className="text-5xl font-extrabold mb-12 text-gray-900 tracking-tight font-serif border-b border-gray-300 pb-4">
        Noticias
      </h1>
      {loading ? (
        <p className="text-center text-gray-600 text-lg">Cargando noticias...</p>
      ) : news.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No hay noticias disponibles.</p>
      ) : (
        <div className="space-y-8">
          {news.map((article) => (
            <article
              key={article.id}
              className="p-6 border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-3xl font-semibold mb-3 text-gray-900">{article.title}</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">{article.content}</p>
              <time className="text-sm text-gray-500">
                {article.publishedAt.toLocaleDateString()}
              </time>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
