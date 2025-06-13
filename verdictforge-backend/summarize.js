const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ message: 'Invalid request body' });
  }

  try {
    const response = await fetch('https://api.deepinfra.com/v1/text/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.DEEPINFRA_API_KEY}`, // ✅ ENV var used here
      },
      body: JSON.stringify({
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        messages: [
          {
            role: 'system',
            content: `You are a legal AI trained to summarize Indian court judgments. Reply with:

Legal Summary: <summary for lawyers>
Plain English Summary: <simplified summary for non-lawyers>`,
          },
          { role: 'user', content: text },
        ],
      }),
    });

    const result = await response.json();
    const content = result?.choices?.[0]?.message?.content?.trim() || '';

    const match = content.match(/Legal Summary:\s*([\s\S]*?)Plain English Summary:\s*([\s\S]*)/i);
    const legal = match?.[1]?.trim() || 'N/A';
    const plain = match?.[2]?.trim() || 'N/A';

    res.status(200).json({ legal, plain, raw: content });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
