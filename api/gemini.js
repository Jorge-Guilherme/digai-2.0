import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyDqfWwUOwIFWQdrPsFEQT4EB2770iLIKCI';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + GEMINI_API_KEY;

app.post('/api/gemini', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    const data = await response.json();
    console.log('Gemini API response:', JSON.stringify(data, null, 2));
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sem resposta.';
    res.json({ text });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao conectar ao Gemini.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log('Gemini proxy rodando na porta', PORT);
});
