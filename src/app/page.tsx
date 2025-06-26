"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import Navigation from "../components/Navigation";

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
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-4">
          Últimas Noticias
        </h1>
        
        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="bg-white">
                <CardHeader>
                  <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No hay noticias disponibles.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {news.map((article) => (
              <Card key={article.id} className="bg-white hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <h2 className="text-2xl font-semibold text-gray-900 leading-tight">
                    {article.title}
                  </h2>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {article.content && article.content !== "No hay resumen disponible"
                      ? article.content
                      : "Resumen no disponible."}
                  </p>
                  <time className="text-sm text-gray-500">
                    {article.publishedAt.toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
