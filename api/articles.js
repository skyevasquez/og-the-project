// Fetch articles from Beehiiv API with caching
// GET /api/articles - Returns all published posts
// GET /api/articles?id={postId} - Returns specific post

import crypto from 'crypto';
import dotenv from 'dotenv';
import { getOrCreateThumbnail, flushThumbnailCache } from './lib/image-generator.js';
dotenv.config();

const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY;
const BEEHIIV_PUBLICATION_ID = process.env.BEEHIIV_PUBLICATION_ID;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Simple in-memory cache (resets on server restart)
let cache = {
  data: null,
  timestamp: 0,
};

function getCategoryMap() {
  return {
    'news': 'News',
    'lifestyle': 'Lifestyle',
    'events': 'Events',
    'spotlight': 'Spotlight',
    'hot topic': 'Hot Topic',
    'hot topics': 'Hot Topic',
    'culture': 'Culture',
  };
}

function mapToCategory(tag) {
  const categoryMap = getCategoryMap();
  return categoryMap[tag?.toLowerCase()] || 'News';
}

function formatDate(unixTimestamp) {
  if (!unixTimestamp) return 'Oct 24, 2025';
  try {
    return new Date(unixTimestamp * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return 'Oct 24, 2025';
  }
}

function extractContentBlocks(content) {
  if (!content || !content.blocks) return [''];

  return content.blocks
    .filter(block => block.type === 'paragraph' || block.type === 'text')
    .map(block => block.content?.text || block.content || '')
    .filter(text => text.length > 0);
}

async function transformPost(post) {
  // Generate or get cached thumbnail (AI-generated for default images)
  const imageUrl = await getOrCreateThumbnail(post);

  return {
    id: post.id,
    title: post.title || '',
    excerpt: post.subtitle || post.preview_text || post.excerpt || '',
    content: extractContentBlocks(post.content),
    category: mapToCategory(post.tag || post.category),
    author: post.authors?.[0] || post.author?.name || 'The OG Project',
    date: formatDate(post.publish_date),
    image: imageUrl || '',
    isFeatured: post.featured || false,
    slugUrl: post.slug_url || post.web_url || '',
  };
}

async function fetchPostsFromBeehiiv() {
  const publicationId = BEEHIIV_PUBLICATION_ID?.startsWith('pub_')
    ? BEEHIIV_PUBLICATION_ID
    : `pub_${BEEHIIV_PUBLICATION_ID}`;

  const response = await fetch(
    `https://api.beehiiv.com/v2/publications/${publicationId}/posts`,
    {
      headers: {
        'Authorization': `Bearer ${BEEHIIV_API_KEY}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Beehiiv API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.data || [];
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

  // Check environment variables
  if (!BEEHIIV_API_KEY || !BEEHIIV_PUBLICATION_ID) {
    return res.status(500).json({
      message: 'Server configuration error',
      error: 'Missing Beehiiv credentials'
    });
  }

  try {
    const { id } = req.query;
    const now = Date.now();

    // Check cache
    if (cache.data && (now - cache.timestamp) < CACHE_TTL) {
      const articles = cache.data;

      if (id) {
        const article = articles.find(a => a.id === id);
        if (!article) {
          return res.status(404).json({ message: 'Article not found' });
        }
        return res.status(200).json(article);
      }

      return res.status(200).json(articles);
    }

    // Fetch from Beehiiv
    const posts = await fetchPostsFromBeehiiv();

    // Filter for published posts only and transform (async for AI thumbnails)
    const publishedPosts = posts.filter(post =>
      post.status === 'confirmed' || post.status === 'published' || post.status === 'live'
    );
    const articles = await Promise.all(publishedPosts.map(transformPost));

    // Flush thumbnail cache to disk after processing all articles
    await flushThumbnailCache();

    // Update cache
    cache = {
      data: articles,
      timestamp: now,
    };

    if (id) {
      const article = articles.find(a => a.id === id);
      if (!article) {
        return res.status(404).json({ message: 'Article not found' });
      }
      return res.status(200).json(article);
    }

    res.status(200).json(articles);

  } catch (error) {
    console.error('Articles API error:', error);

    // Return cached data if available on error
    if (cache.data) {
      const articles = cache.data;
      if (id) {
        const article = articles.find(a => a.id === id);
        if (article) return res.status(200).json(article);
      }
      return res.status(200).json(articles);
    }

    return res.status(500).json({
      message: 'Failed to fetch articles',
      error: error.message
    });
  }
}
