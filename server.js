import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import subscribeHandler from './api/subscribe.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// API Routes
app.post('/api/subscribe', async (req, res) => {
  await subscribeHandler(req, res);
});

app.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
});
