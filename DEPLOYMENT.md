# OG THE PROJECT - Deployment & Setup Guide

## 📦 Table of Contents

1. [GitHub Setup](#github-setup)
2. [Beehiiv Integration](#beehiiv-integration)
3. [Hostinger Deployment](#hostinger-deployment)
4. [Environment Variables](#environment-variables)

---

## 🔧 GitHub Setup

### Initial Repository Setup

1. **Create a new repository on GitHub:**
   - Go to <https://github.com/new>
   - Repository name: `og-the-project`
   - Description: "The OG Project - Ocala & Gainesville's Weekly Cheat Sheet"
   - Choose: Public or Private
   - Do NOT initialize with README (we already have one)

2. **Connect your local repository to GitHub:**

   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/og-the-project.git
   git branch -M main
   git add .
   git commit -m "Initial commit: OG Project website"
   git push -u origin main
   ```

### Regular Updates

```bash
git add .
git commit -m "Your commit message"
git push
```

---

## 📧 Beehiiv Integration

### Step 1: Get Your Beehiiv API Credentials

1. **Log in to Beehiiv:**
   - Go to <https://app.beehiiv.com/>

2. **Navigate to Settings:**
   - Click on your publication name
   - Go to **Settings** → **Integrations** → **API**

3. **Create an API Key:**
   - Click "Create API Key"
   - Name it: "Website Subscription Form"
   - Copy the API key (you won't see it again!)

4. **Get your Publication ID:**
   - Still in API settings, copy your **Publication ID**

### Step 2: Configure Environment Variables

1. **Create a `.env.local` file in your project root:**

   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local` and add your credentials:**

   ```
   BEEHIIV_API_KEY=your_actual_api_key_here
   BEEHIIV_PUBLICATION_ID=your_actual_publication_id_here
   ```

3. **Update the API handler:**
   - Open `api/subscribe.js`
   - Replace `{PUBLICATION_ID}` in the URL with your actual publication ID:

   ```javascript
   const BEEHIIV_API_URL = 'https://api.beehiiv.com/v2/publications/YOUR_PUBLICATION_ID/subscriptions';
   ```

### Step 3: Test the Integration Locally

1. **Start the development server:**
   
   This command now starts both the backend API server and the frontend:

   ```bash
   npm run dev
   ```

2. **Test a subscription:**
   - Go to <http://localhost:3001>
   - Scroll to the newsletter section
   - Enter a test email
   - Check your Beehiiv dashboard to confirm the subscriber was added

### Troubleshooting API Issues

If you encounter issues with the signup form:

1. **"Server configuration error"**:
   - Check your `.env` file. Ensure `BEEHIIV_API_KEY` and `BEEHIIV_PUBLICATION_ID` are set correctly.
   - Restart the server (`npm run dev`) after changing `.env` files.

2. **"Valid email is required"**:
   - The API validates email format. Ensure you are testing with a valid email structure (e.g., `user@example.com`).

3. **"Failed to subscribe"**:
   - Check the terminal console where you ran `npm run dev`. The server logs detailed error messages from Beehiiv.
   - Common Beehiiv errors:
     - Invalid Publication ID (ensure it starts with `pub_` if required, though the code handles this).
     - API Key permissions (ensure the key has "read" and "write" access).
     - Rate limiting (too many requests in a short time).

4. **CORS or Network Errors**:
   - Ensure you are accessing the site via `localhost` as configured.
   - The `vite.config.ts` is set up to proxy `/api` requests to the backend server.

---

## 🌐 Hostinger Deployment

### Prerequisites

- Active Hostinger account with website hosting
- Access to cPanel or Hostinger's File Manager
- Your website domain configured

### Option 1: Deploy via Git (Recommended)

1. **In Hostinger hPanel:**
   - Go to **Advanced** → **Git Version Control**
   - Click **Create**
   - Enter your GitHub repository URL
   - Select branch: `main`
   - Set deployment path: `/public_html`
   - Click **Create**

2. **Set up automatic deployments:**
   - In GitHub, go to repository **Settings** → **Webhooks**
   - Add the webhook URL provided by Hostinger
   - Set Content type: `application/json`
   - Select: Just the push event

3. **Build and deploy:**

   ```bash
   npm run build
   ```

   - Upload the contents of the `dist` folder to your deployment path

### Option 2: Manual Upload via FTP

1. **Build your project:**

   ```bash
   npm run build
   ```

2. **Connect to Hostinger via FTP:**
   - Use FileZilla or Hostinger's File Manager
   - Upload all files from the `dist/` folder to `/public_html/`

3. **Verify the deployment:**
   - Visit your domain
   - Test all functionality

### Set Environment Variables on Hostinger

1. **In Hostinger hPanel:**
   - Go to **Advanced** → **Environment Variables**
   - Or edit via FTP: Add to `.htaccess` or create a config file

2. **Add your environment variables:**

   ```
   BEEHIIV_API_KEY=your_api_key
   BEEHIIV_PUBLICATION_ID=your_publication_id
   ```

3. **For Node.js/serverless functions:**
   - If using Hostinger's Node.js hosting, add variables in the Node.js app settings
   - For serverless functions, you may need to use Vercel or Netlify instead

### Important: API Endpoint Setup

**Note:** Hostinger's standard hosting doesn't support serverless functions by default. You have two options:

**Option A: Use Vercel for API endpoints (Recommended)**

1. Deploy to Vercel for free: <https://vercel.com>
2. Import your GitHub repository
3. Vercel will automatically detect the `/api` folder and create serverless functions
4. Update your Newsletter component to point to the Vercel API endpoint

**Option B: Use Beehiiv's hosted forms**

1. In Beehiiv dashboard, create an embedded form
2. Copy the embed code
3. Replace the current Newsletter component with Beehiiv's form

---

## 🔐 Environment Variables

### Required Variables

| Variable | Description | Where to Get It |
|----------|-------------|-----------------|
| `BEEHIIV_API_KEY` | Your Beehiiv API authentication key | Beehiiv Dashboard → Settings → Integrations → API |
| `BEEHIIV_PUBLICATION_ID` | Your publication's unique identifier | Same as above |

### Setting Variables by Environment

**Local Development:**

```
.env.local
```

**Production (Hostinger):**

- hPanel → Environment Variables

**Production (Vercel - for API):**

- Project Settings → Environment Variables

---

## 🚀 Deployment Checklist

Before going live, ensure:

- [ ] All images are loading correctly
- [ ] Newsletter signup works (test with real email)
- [ ] Navigation works on all pages
- [ ] Mobile responsive design is working
- [ ] Social media links are updated with real URLs
- [ ] Environment variables are set in production
- [ ] SSL certificate is active (HTTPS)
- [ ] Domain is pointing to the correct server
- [ ] Google Analytics or tracking is set up (optional)
- [ ] Test form submissions
- [ ] Check browser console for errors

---

## 📞 Support Resources

- **Beehiiv Docs:** <https://docs.beehiiv.com/>
- **Hostinger Support:** <https://support.hostinger.com/>
- **GitHub Docs:** <https://docs.github.com/>

---

## 🔄 Workflow

### Making Changes

1. **Make your changes locally**
2. **Test locally:**

   ```bash
   npm run dev
   ```

3. **Commit to Git:**

   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```

4. **Deploy:**
   - If using Git deployment: Automatic
   - If using manual: Build and upload via FTP

---

**Need help?** Check the inline comments in the code or reach out to your development team.
