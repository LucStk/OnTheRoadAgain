// server.js (version ES module)
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/autocomplete', async (req, res) => {
  const { input } = req.query;

  if (!input) {
    return res.status(400).json({ error: 'Missing input parameter' });
  }

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
      params: {
        input,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Google Maps API call failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
