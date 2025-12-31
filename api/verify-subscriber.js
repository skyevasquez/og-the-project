// Verify if email is subscribed to Beehiiv publication
// POST /api/verify-subscriber
// Body: { email: string }
// Returns: { isSubscribed: boolean, email?: string, message?: string }

import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const COOKIE_SECRET = process.env.COOKIE_SECRET || 'change-me-in-production';
const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY;
const BEEHIIV_PUBLICATION_ID = process.env.BEEHIIV_PUBLICATION_ID;
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

function generateToken(email) {
  const timestamp = Date.now();
  const payload = `${email}:${timestamp}`;
  const hmac = crypto.createHmac('sha256', COOKIE_SECRET)
    .update(payload)
    .digest('hex');
  return `${Buffer.from(payload).toString('base64')}.${hmac}`;
}

function setSubscriberCookie(res, email) {
  const token = generateToken(email);
  const cookieValue = `og_subscriber=${token}; HttpOnly; Secure; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}; Path=/`;
  res.setHeader('Set-Cookie', cookieValue);
}

function clearSubscriberCookie(res) {
  res.setHeader('Set-Cookie', 'og_subscriber=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/');
}

async function checkBeehiivSubscription(email) {
  const publicationId = BEEHIIV_PUBLICATION_ID?.startsWith('pub_')
    ? BEEHIIV_PUBLICATION_ID
    : `pub_${BEEHIIV_PUBLICATION_ID}`;

  const response = await fetch(
    `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions?email=${encodeURIComponent(email)}`,
    {
      headers: {
        'Authorization': `Bearer ${BEEHIIV_API_KEY}`,
      },
    }
  );

  if (!response.ok) {
    return { exists: false, error: `API error: ${response.status}` };
  }

  const data = await response.json();
  const subscriptions = data.data || [];

  if (subscriptions.length === 0) {
    return { exists: false };
  }

  const subscription = subscriptions[0];
  // Check if subscription is active (not cancelled)
  const isActive = !subscription.cancelled_at && subscription.status !== 'cancelled';

  return { exists: true, isActive };
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({
      isSubscribed: false,
      message: 'Please provide a valid email address.'
    });
  }

  // Normalize email (lowercase, trim)
  const normalizedEmail = email.toLowerCase().trim();

  // Check environment variables
  if (!BEEHIIV_API_KEY || !BEEHIIV_PUBLICATION_ID) {
    return res.status(500).json({
      isSubscribed: false,
      message: 'Server configuration error.'
    });
  }

  try {
    // Check Beehiiv API for subscription
    const result = await checkBeehiivSubscription(normalizedEmail);

    if (result.exists && result.isActive) {
      // User is subscribed - set cookie
      setSubscriberCookie(res, normalizedEmail);
      return res.status(200).json({
        isSubscribed: true,
        email: normalizedEmail,
        message: 'Subscription verified! Full content unlocked.'
      });
    } else {
      // Not subscribed or subscription cancelled
      clearSubscriberCookie(res);
      return res.status(404).json({
        isSubscribed: false,
        message: "We couldn't find that email in our subscriber list. Please subscribe first to unlock full content."
      });
    }

  } catch (error) {
    console.error('Verification error:', error);
    return res.status(500).json({
      isSubscribed: false,
      message: 'Unable to verify subscription. Please try again later.'
    });
  }
}
