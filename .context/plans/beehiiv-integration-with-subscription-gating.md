# Beehiiv Integration with Subscription Gating

## Overview
Auto-sync articles from Beehiiv and gate full content behind subscription verification.

## User Preferences
- **Sync**: On-demand when user visits (with caching)
- **Verification**: Simple email check (no magic link)
- **Gating**: Show first paragraph + "Subscribe to read more" CTA

---

## Implementation Plan

### Phase 1: Article Sync API

**Create: `/api/articles.js`**
- Fetch posts from Beehiiv API: `GET /v2/publications/{id}/posts`
- Cache in Vercel KV or memory with 5-minute TTL
- Transform Beehiiv post format to Article interface
- Filter for published posts only

**Transform mapping:**
```javascript
{
  id: post.id,
  title: post.title,
  excerpt: post.subtitle || preview_text,
  content: post.content.blocks.filter(b => b.type === 'paragraph').map(b => b.content.text),
  category: mapCategory(post.tag),
  author: post.author?.name || 'OG Team',
  date: formatDate(post.published_at),
  image: post.cover_image_url,
}
```

### Phase 2: Subscription Verification API

**Create: `/api/verify-subscriber.js`**
- POST endpoint accepting email
- Check Beehiiv: `GET /v2/publications/{id}/subscriptions?email={email}`
- If subscribed: set HTTP-only cookie `og_subscriber=email:HMAC`
- Return `{ isSubscribed: true/false }`

**Create: `/api/check-subscription.js`**
- GET endpoint (no body)
- Validate cookie HMAC
- Return `{ isSubscribed: boolean }`

### Phase 3: Frontend Changes

**Modify: `/components/ArticlePage.tsx`**
- Fetch article from `/api/articles` instead of static import
- Show excerpt/first paragraph always
- If not subscribed: show "Subscribe to read more" + newsletter signup
- If subscribed: show full article content
- Check subscription status via `/api/check-subscription` on mount

**Create: `/hooks/useSubscription.ts`**
- `isSubscribed` state from cookie check
- `verifyEmail(email)` function
- `subscriberEmail` state

### Phase 4: Server & Config Updates

**Modify: `/server.js`**
- Add routes: `/api/articles`, `/api/verify-subscriber`, `/api/check-subscription`

**Modify: `/vercel.json`**
- Add serverless function configs for new API routes

**Add to `.env`:**
- `COOKIE_SECRET` - for signing subscriber cookies
- Already have: `BEEHIIV_API_KEY`, `BEEHIIV_PUBLICATION_ID`

---

## Files to Create

| File | Purpose |
|------|---------|
| `/api/articles.js` | Fetch & cache Beehiiv posts |
| `/api/verify-subscriber.js` | Check subscription & set cookie |
| `/api/check-subscription.js` | Validate cookie (lightweight) |
| `/hooks/useSubscription.ts` | Subscription state hook |

## Files to Modify

| File | Changes |
|------|---------|
| `/components/ArticlePage.tsx` | API fetch + gating logic |
| `/server.js` | Add API routes |
| `/vercel.json` | Configure serverless functions |

---

## User Flow

1. **Visitor arrives** → Sees article excerpt + "Subscribe to read more"
2. **Enters email** → API checks Beehiiv
3. **If subscribed** → Cookie set, full article reveals
4. **If not subscribed** → "Please subscribe first" + newsletter form
5. **Returning visitor** → Cookie auto-unlocks content

---

## Security Notes
- HTTP-only cookies prevent XSS
- HMAC prevents cookie tampering
- 30-day cookie expiration
- Appropriate for newsletter content (not sensitive data)
