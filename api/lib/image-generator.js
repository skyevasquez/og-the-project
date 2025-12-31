// AI Thumbnail Generation using Gemini
// Generates unique, contextual thumbnails for articles using Google's Gemini AI
// Implements a background queue to respect API rate limits

import { GoogleGenAI } from '@google/genai';
import { writeFile, readFile, mkdir, access } from 'fs/promises';
import { join, dirname } from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Path to thumbnail cache file
const CACHE_FILE = join(process.cwd(), 'api/data/thumbnails.json');
const THUMBNAILS_DIR = join(process.cwd(), 'public/thumbnails');

// Initialize Gemini client
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
let genaiClient = null;

function getGenAIClient() {
  if (!genaiClient && GEMINI_API_KEY) {
    genaiClient = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  }
  return genaiClient;
}

// In-memory cache and write mutex
let memoryCache = null;
let loadPromise = null;
let writePromise = null;

// Queue System
const generationQueue = [];
let isProcessingQueue = false;
const RATE_LIMIT_DELAY = 10000; // 10 seconds between requests for free tier

// Default/shared thumbnail URLs that indicate need for AI generation
// Any URL containing these strings is considered a "default" that needs replacing
const DEFAULT_THUMBNAIL_PATTERNS = [
  '/uploads/asset/file/92218839', // The shared default asset
  '/uploads/publication/logo/',  // Logo images
  'beehiiv-images-production.s3.amazonaws.com/uploads/publication/logo' // Full logo path
];

/**
 * Check if a thumbnail is the default/shared one
 */
function isDefaultThumbnail(thumbnailUrl, postId) {
  if (!thumbnailUrl) return true;

  // Skip AI generation for the welcome/intro posts if desired, 
  // but usually we want to replace the generic logo even there.
  if (postId && postId.includes('welcome')) return false;

  return DEFAULT_THUMBNAIL_PATTERNS.some(pattern =>
    thumbnailUrl.includes(pattern)
  );
}

/**
 * Extract keywords for fallback image
 */
function extractKeywords(article) {
  const text = `${article.title} ${article.category || ''}`.toLowerCase();

  if (text.includes('food') || text.includes('restaurant') || text.includes('dining')) return 'food,dining';
  if (text.includes('music') || text.includes('concert') || text.includes('band')) return 'concert,music';
  if (text.includes('traffic') || text.includes('road') || text.includes('car')) return 'traffic,city';
  if (text.includes('holiday') || text.includes('christmas')) return 'holiday,celebration';
  if (text.includes('nature') || text.includes('park') || text.includes('spring')) return 'nature,park';
  if (text.includes('gators') || text.includes('football') || text.includes('sports')) return 'sports,stadium';

  // Default based on category
  const category = (article.category || 'news').toLowerCase();
  return `city,${category}`;
}

/**
 * Get a high-quality fallback URL (LoremFlickr)
 * Used immediately while AI image is generating or if API fails
 */
function getFallbackUrl(article) {
  const keywords = extractKeywords(article);
  // Using post ID to ensure the same post gets the same random image
  const seed = article.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `https://loremflickr.com/1024/1024/${keywords}?lock=${seed}`;
}

/**
 * Build a contextual prompt for thumbnail generation
 */
function buildPrompt(article) {
  const title = article.title || 'Newsletter Article';
  const category = article.category || article.tag || 'News';
  const excerpt = article.subtitle || article.preview_text || '';

  return `Create a professional editorial magazine thumbnail image for an article titled "${title}". 
Category: ${category}
${excerpt ? `Brief: ${excerpt.substring(0, 100)}` : ''}

Style guidelines:
- Modern, clean editorial photography style
- Vibrant colors with good contrast
- Professional magazine-quality composition
- No text or words in the image
- 16:9 aspect ratio composition`;
}

/**
 * Process the Generation Queue
 */
async function processQueue() {
  if (isProcessingQueue || generationQueue.length === 0) return;

  isProcessingQueue = true;

  while (generationQueue.length > 0) {
    const article = generationQueue[0]; // Peek

    try {
      // Double check cache in case it was done in parallel (unlikely in single thread but good practice)
      const cached = await getCachedThumbnail(article.id);
      if (cached) {
        generationQueue.shift(); // Remove
        continue;
      }

      console.log(`[Queue] Processing: ${article.title.substring(0, 30)}...`);
      const generatedUrl = await generateImageWithGemini(article);

      if (generatedUrl) {
        await setCachedThumbnail(article.id, generatedUrl);
        console.log(`[Queue] Success for ${article.id}`);
      } else {
        console.log(`[Queue] Failed for ${article.id}, keeping fallback`);
      }

    } catch (error) {
      console.error(`[Queue] Error processing ${article.id}:`, error.message);
    } finally {
      // Always remove the item we just processed/attempted
      generationQueue.shift();

      // Wait before next request to respect rate limits
      if (generationQueue.length > 0) {
        console.log(`[Queue] Waiting ${RATE_LIMIT_DELAY}ms before next item... (${generationQueue.length} remaining)`);
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
      }
    }
  }

  isProcessingQueue = false;
  console.log('[Queue] All items processed');
}

/**
 * Generate image using Gemini AI and save to disk
 */
async function generateImageWithGemini(article) {
  const client = getGenAIClient();

  if (!client) {
    console.warn('Gemini API key not configured');
    return null;
  }

  try {
    const prompt = buildPrompt(article);
    // Use the confirmed working experimental model
    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
      config: {
        responseModalities: ['Text', 'Image'],
      },
    });

    // Extract image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const imageData = part.inlineData.data;
        const mimeType = part.inlineData.mimeType || 'image/png';
        const extension = mimeType.includes('jpeg') || mimeType.includes('jpg') ? 'jpg' : 'png';

        const safeId = article.id.replace(/[^a-zA-Z0-9_-]/g, '_');
        const filename = `${safeId}.${extension}`;
        const filepath = join(THUMBNAILS_DIR, filename);

        await mkdir(THUMBNAILS_DIR, { recursive: true });

        const buffer = Buffer.from(imageData, 'base64');
        await writeFile(filepath, buffer);

        return `/thumbnails/${filename}`;
      }
    }
    return null;
  } catch (error) {
    if (error.message.includes('429')) {
      console.warn('Gemini Rate Limit Hit (429)');
    } else {
      console.error(`Gemini Error: ${error.message}`);
    }
    return null;
  }
}

/**
 * Load cache from disk into memory
 */
async function loadCache() {
  if (memoryCache) return memoryCache;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    try {
      const data = await readFile(CACHE_FILE, 'utf-8');
      memoryCache = JSON.parse(data);
    } catch {
      memoryCache = {};
    }
    loadPromise = null;
    return memoryCache;
  })();

  return loadPromise;
}

/**
 * Write cache to disk
 */
async function writeCache() {
  if (writePromise) await writePromise;

  writePromise = (async () => {
    if (memoryCache) {
      try {
        await mkdir(dirname(CACHE_FILE), { recursive: true });
        await writeFile(CACHE_FILE, JSON.stringify(memoryCache, null, 2));
      } catch (error) {
        console.error('Failed to write thumbnail cache:', error.message);
      }
    }
    writePromise = null;
  })();
  return writePromise;
}

/**
 * Get cached thumbnail URL for a post
 */
async function getCachedThumbnail(postId) {
  const cache = await loadCache();
  const cachedPath = cache[postId];

  if (!cachedPath) return null;

  // Verify the cached file still exists
  try {
    const filepath = join(process.cwd(), 'public', cachedPath);
    await access(filepath);
    return cachedPath;
  } catch {
    delete cache[postId];
    return null;
  }
}

async function setCachedThumbnail(postId, url) {
  if (!memoryCache) await loadCache();
  memoryCache[postId] = url;
  await writeCache();
}

/**
 * Main function: Get or create thumbnail
 */
async function getOrCreateThumbnail(article) {
  // User requested to use the original Beehiiv image directly
  // Bypassing all AI generation and default detection logic
  return article.thumbnail_url;
}

async function flushThumbnailCache() {
  if (writePromise) await writePromise;
}

export {
  getOrCreateThumbnail,
  isDefaultThumbnail,
  getCachedThumbnail,
  setCachedThumbnail,
  flushThumbnailCache,
};
