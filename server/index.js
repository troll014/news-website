const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('./firebase_credentials.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Get all news articles
app.get('/api/news', async (req, res) => {
  try {
    const newsRef = db.collection('news');
    const snapshot = await newsRef.orderBy('timestamp', 'desc').get();
    
    const news = [];
    snapshot.forEach(doc => {
      news.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json(news);
  } catch (error) {
    console.error('Error fetching news:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch news' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
