const express = require('express');
const cors = require('cors');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

// Example API endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// TODO: Add API routes to interact with Firebase if needed

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
