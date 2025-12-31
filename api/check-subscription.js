// Lightweight endpoint to check if user has valid subscriber cookie
// GET /api/check-subscription
// Returns: { isSubscribed: boolean }

import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const COOKIE_SECRET = process.env.COOKIE_SECRET || 'change-me-in-production';
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days in ms

function verifyToken(token) {
  try {
    const [payloadB64, hmac] = token.split('.');
    if (!payloadB64 || !hmac) return false;

    const payload = Buffer.from(payloadB64, 'base64').toString();
    const expectedHmac = crypto.createHmac('sha256', COOKIE_SECRET)
      .update(payload)
      .digest('hex');

    if (hmac !== expectedHmac) return false;

    const [email, timestamp] = payload.split(':');
    const age = Date.now() - parseInt(timestamp);

    return age <= COOKIE_MAX_AGE;
  } catch {
    return false;
  }
}

function parseCookies(cookieHeader) {
  if (!cookieHeader) return {};

  return Object.fromEntries(
    cookieHeader.split(';').map(cookie => {
      const [name, value] = cookie.trim().split('=');
      return [name, value];
    })
  );
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const cookies = parseCookies(req.headers.cookie);
  const subscriberToken = cookies.og_subscriber;

  const isSubscribed = subscriberToken && verifyToken(subscriberToken);

  res.status(200).json({ isSubscribed: !!isSubscribed });
}
