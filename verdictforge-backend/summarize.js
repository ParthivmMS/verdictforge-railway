export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ message: 'Invalid input' });
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
            content: `You are a legal AI trained to summarize Indian court judgments. Respond only with:

Legal Summary: <summary for lawyers>

Plain English Summary: <summary for non-lawyers>

No greetings, no explanations, just the exact two sections.`,
          },
          { role: 'user', content: text },
        ],
      }),
    });

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content?.trim() || '';

    const match = content.match(/Legal Summary:\s*([\s\S]*?)Plain English Summary:\s*([\s\S]*)/i);
    const legal = match?.[1]?.trim() || '[Could not extract legal summary]';
    const plain = match?.[2]?.trim() || '[Could not extract plain summary]';

    res.status(200).json({ legal, plain, raw: content });
  } catch (err) {
    console.error('[ERROR]', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
