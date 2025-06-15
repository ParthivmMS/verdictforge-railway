const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // if needed
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('✅ VerdictForge AI Backend is Running');
});

app.post('/api/summarize', async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ message: 'Invalid request body' });
  }

  try {
    const response = await fetch('https://api.deepinfra.com/v1/text/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DEEPINFRA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        messages: [
          {
            role: 'system',
            content: `You are a legal AI trained to summarize Indian court judgments. Reply with *only*:

Legal Summary: <your professional summary for lawyers>

Plain English Summary: <your simplified summary for non-lawyers>

Do not add anything else.`,
          },
          {
            role: 'user',
            content: text,
          },
        ],
      }),
    });

    const result = await response.json();
    const content = result?.choices?.[0]?.message?.content?.trim() || '';

    console.log('[DEBUG] AI Response:', content);

    // 🔍 Improved regex match
    const match = content.match(/Legal Summary:\s*([\s\S]*?)\s*Plain English Summary:\s*([\s\S]*)/i);
    const legal = match?.[1]?.trim() || content || 'N/A';
    const plain = match?.[2]?.trim() || 'N/A';

    res.status(200).json({ legal, plain, raw: content });
  } catch (error) {
    console.error('❌ Error summarizing:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
