# AI-Generated Thumbnails for Articles

## Problem
Many Beehiiv articles don't have unique cover images set, resulting in duplicate thumbnails across articles.

## Solution
Use free AI image generation (Pollinations.ai) to create unique thumbnails for articles that share the default image, stored permanently in Vercel Blob Storage.

---

## Tech Stack

| Component | Service | Cost |
|-----------|---------|------|
| Image Generation | Pollinations.ai | FREE |
| Image Storage | Vercel Blob Storage | FREE (1GB) |
| Caching | JSON file mapping | FREE |

---

## Implementation Plan

### Step 1: Install Vercel Blob Dependency
```bash
npm install @vercel/blob
```

### Step 2: Create Image Generation Utility

**Create: `/api/lib/image-generator.js`**

Functions needed:
- `generatePrompt(article)` - Create image prompt from title/subtitle
- `generateImage(prompt)` - Call Pollinations.ai API
- `uploadToBlob(imageUrl, postId)` - Upload to Vercel Blob
- `getOrCreateThumbnail(article)` - Main orchestrator

**Prompt Engineering:**
```javascript
function generatePrompt(article) {
  const basePrompt = "professional magazine cover art, editorial illustration";
  const category = article.category || "news";
  const keywords = article.title.substring(0, 100);
  return `${basePrompt}, ${category} theme, ${keywords}, vibrant colors, high quality`;
}
```

### Step 3: Add Thumbnail Mapping Storage

**Create: `/api/data/thumbnails.json`**
- Maps `post_id` → `generated_thumbnail_url`
- Checked before generating new images
- Ensures consistency across visitors

### Step 4: Update Articles API

**Modify: `/api/articles.js`**

Add logic to `transformPost()`:
```javascript
async function transformPost(post) {
  let thumbnailUrl = post.thumbnail_url;

  // Check if using default/shared thumbnail
  if (isDefaultThumbnail(thumbnailUrl)) {
    // Check if we already generated one
    const cachedUrl = getCachedThumbnail(post.id);
    if (cachedUrl) {
      thumbnailUrl = cachedUrl;
    } else {
      // Generate and store new thumbnail
      thumbnailUrl = await generateAndStoreThumbnail(post);
      cacheThumbnail(post.id, thumbnailUrl);
    }
  }

  return {
    // ... other fields
    image: thumbnailUrl,
  };
}
```

### Step 5: Environment Variables

**Add to `.env`:**
```bash
# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here
```

Get token from: `npx vercel blob install`

---

## Files to Create

| File | Purpose |
|------|---------|
| `/api/lib/image-generator.js` | AI image generation + blob upload |
| `/api/data/thumbnails.json` | Cache of generated thumbnails |

## Files to Modify

| File | Changes |
|------|---------|
| `/api/articles.js` | Add AI thumbnail generation for default images |
| `package.json` | Add `@vercel/blob` dependency |
| `.env` | Add `BLOB_READ_WRITE_TOKEN` |

---

## Pollinations.ai API

**Free Image Generation:**
```
GET https://image.pollinations.ai/prompt/{encoded_prompt}
```

**Parameters:**
- `prompt`: URL-encoded text description
- `width`: 1024 (optional)
- `height`: 1024 (optional)
- `seed`: random for consistency (optional)
- `nologo`: true (remove watermark)

**Example:**
```
https://image.pollinations.ai/prompt/magazine%20cover%20weekend%20guide?width=1024&height=1024&nologo=true
```

---

## Flow Diagram

```
1. Fetch articles from Beehiiv
2. For each article:
   ├─ Has unique thumbnail? → Use it
   └─ Using default/shared thumbnail?
       ├─ Check thumbnails.json cache
       ├─ Cached? → Use cached URL
       └─ Not cached?
           ├─ Generate prompt from title
           ├─ Call Pollinations.ai
           ├─ Upload to Vercel Blob
           ├─ Save URL to thumbnails.json
           └─ Return new URL
3. Return articles to frontend
```

---

## Estimated Costs

| Service | Usage | Monthly Cost |
|---------|-------|-------------|
| Pollinations.ai | ~14 images (one-time) | $0 |
| Vercel Blob | ~14 images @ ~200KB each | $0 (under 1GB free tier) |
| **Total** | | **$0/month** |

---

## Rollout Plan

1. Install dependencies (`@vercel/blob`)
2. Set up Vercel Blob (`npx vercel blob install`)
3. Create `image-generator.js` utility
4. Update `articles.js` to use AI generation
5. Test with existing articles
6. Regenerate thumbnails on new article fetch
