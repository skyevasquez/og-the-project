import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import subscribeHandler from './api/subscribe.js';
import articlesHandler from './api/articles.js';
import verifySubscriberHandler from './api/verify-subscriber.js';
import checkSubscriptionHandler from './api/check-subscription.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// API Routes
app.post('/api/subscribe', async (req, res) => {
  await subscribeHandler(req, res);
});

app.get('/api/articles', async (req, res) => {
  await articlesHandler(req, res);
});

app.post('/api/verify-subscriber', async (req, res) => {
  await verifySubscriberHandler(req, res);
});

app.get('/api/check-subscription', async (req, res) => {
  await checkSubscriptionHandler(req, res);
});

app.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
});
