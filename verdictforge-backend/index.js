// File: index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('🧠 VerdictForge AI Backend is Running');
});

app.post('/summarize', async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ message: 'Invalid request body' });
  }

  try {
    const response = await fetch('https://api.deepinfra.com/v1/text/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.DEEPINFRA_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        messages: [
          {
            role: 'system',
            content: `You are a legal AI trained to summarize Indian court judgments. Reply ONLY in this format:

Legal Summary: <summary for lawyers>

Plain English Summary: <summary for non-lawyers>

No introduction or conclusion. No extra text.`
          },
          {
            role: 'user',
            content: text
          }
        ]
      })
    });

    const result = await response.json();
    const content = result?.choices?.[0]?.message?.content?.trim() || '';

    const match = content.match(/Legal Summary:\s*([\s\S]*?)Plain English Summary:\s*([\s\S]*)/i);
    const legal = match?.[1]?.trim() || '[Could not extract legal summary]';
    const plain = match?.[2]?.trim() || '[Could not extract plain summary]';

    return res.status(200).json({ legal, plain, raw: content });

  } catch (error) {
    console.error('❌ API Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
