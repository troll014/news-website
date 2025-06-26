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
            publishedAt: data.publishedAt.toDate(),
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
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-black">Noticias</h1>
      {loading ? (
        <p>Cargando noticias...</p>
      ) : news.length === 0 ? (
        <p>No hay noticias disponibles.</p>
      ) : (
        news.map((article) => (
          <article key={article.id} className="mb-6 border-b border-gray-300 pb-4">
            <h2 className="text-2xl font-semibold mb-2">{article.title}</h2>
            <p className="text-gray-700 mb-2">{article.content}</p>
            <time className="text-sm text-gray-500">
              {article.publishedAt.toLocaleDateString()}
            </time>
          </article>
        ))
      )}
    </main>
  );
}
