const express = require('express');
const app = express();
const summarizeRoute = require('./summarize'); // 🔁 Route file

app.use(express.json()); // ✅ To parse JSON requests
app.use('/summarize', summarizeRoute); // 🔗 Route path

app.get('/', (req, res) => {
  res.send('✅ VerdictForge Backend is live!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
