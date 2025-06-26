import requests
from bs4 import BeautifulSoup
import firebase_admin
from firebase_admin import credentials, firestore
import datetime
import time
import json
import os

# Initialize Firebase Admin SDK with credentials from file
cred = credentials.Certificate('firebase_credentials.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

def scrape_news():
    # Using two news sites - El País América and BBC Mundo
    urls = [
        ("https://elpais.com/america/", "El País América"),
        ("https://www.bbc.com/mundo", "BBC Mundo")
    ]
    articles = []
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    for url, source in urls:
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.text, "html.parser")
        if source == "El País América":
            for article in soup.select("article"):
                try:
                    title_elem = article.select_one("h2")
                    summary_elem = article.select_one("p") or article.select_one("div.c_d")
                    image_elem = article.select_one("img")
                    if title_elem:
                        title = title_elem.get_text(strip=True)
                        content = summary_elem.get_text(strip=True) if summary_elem else "No hay resumen disponible"
                        published_at = datetime.datetime.now()
                        image_url = image_elem['src'] if image_elem and image_elem.has_attr('src') else None
                        if title and not any(a['title'] == title for a in articles):
                            articles.append({
                                "title": title,
                                "content": content,
                                "publishedAt": published_at,
                                "source": source,
                                "imageUrl": image_url
                            })
                            print(f"Scraped article from El País América: {title}")
                except Exception as e:
                    print(f"Error processing article from El País América: {e}")
        elif source == "BBC Mundo":
            for article in soup.select("div.gs-c-promo"):
                try:
                    title_elem = article.select_one("h3")
                    summary_elem = article.select_one("p")
                    image_elem = article.select_one("img")
                    if title_elem:
                        title = title_elem.get_text(strip=True)
                        content = summary_elem.get_text(strip=True) if summary_elem else "No hay resumen disponible"
                        published_at = datetime.datetime.now()
                        image_url = image_elem['src'] if image_elem and image_elem.has_attr('src') else None
                        if title and not any(a['title'] == title for a in articles):
                            articles.append({
                                "title": title,
                                "content": content,
                                "publishedAt": published_at,
                                "source": source,
                                "imageUrl": image_url
                            })
                            print(f"Scraped article from BBC Mundo: {title}")
                except Exception as e:
                    print(f"Error processing article from BBC Mundo: {e}")
    return articles

from firebase_admin import firestore

def publish_news_to_firebase(articles):
    for article in articles:
        # Convert datetime to Firestore Timestamp field
        timestamp = firestore.Timestamp.from_datetime(article['publishedAt'])
        article['timestamp'] = timestamp
        article['publishedAt'] = timestamp
        # Check if article already exists by title
        docs = db.collection("news").where("title", "==", article["title"]).stream()
        if any(docs):
            print(f"Article '{article['title']}' already exists. Skipping.")
            continue
        # Add new article
        try:
            db.collection("news").add(article)
            print(f"Published article '{article['title']}' to Firebase.")
        except Exception as e:
            print(f"Failed to publish article '{article['title']}': {e}")

def main():
    print("Iniciando el bot de noticias...")
    while True:
        try:
            print("\nObteniendo noticias nuevas...")
            articles = scrape_news()
            if articles:
                print(f"Se encontraron {len(articles)} artículos")
                publish_news_to_firebase(articles)
                print("Artículos publicados en Firebase")
            else:
                print("No se encontraron nuevos artículos")
            # Esperar 30 minutos antes de la siguiente actualización
            print("Esperando 30 minutos para la próxima actualización...")
            time.sleep(1800)
        except Exception as e:
            print(f"Error en el ciclo principal: {e}")
            time.sleep(60)  # Esperar 1 minuto si hay error

if __name__ == "__main__":
    main()
