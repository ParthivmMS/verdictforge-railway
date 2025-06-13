import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import summarizeRoute from './summarize.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post('/summarize', summarizeRoute);

app.get('/', (req, res) => res.send("✅ VerdictForge backend is working!"));

app.listen(process.env.PORT || 3000, () => {
  console.log('✅ Server running...');
});
