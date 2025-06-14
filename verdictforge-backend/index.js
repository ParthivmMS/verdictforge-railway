// index.js
const express = require("express");
const summarize = require("./summarize");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ VerdictForge Backend is Running");
});

app.post("/summarize", summarize);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
