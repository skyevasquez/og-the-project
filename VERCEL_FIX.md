# Beehiiv Integration Fix for Vercel Deployment

## Problem

The newsletter subscription form was giving a "function error" when deployed to Vercel. This is because the serverless function wasn't configured properly and/or the environment variables weren't set.

## Solution

### Step 1: Update vercel.json (DONE ✅)

The `vercel.json` file has been updated to explicitly configure the serverless function.

### Step 2: Set Environment Variables in Vercel

You **MUST** add your Beehiiv credentials to Vercel's environment variables:

1. Go to your Vercel dashboard: <https://vercel.com/dashboard>
2. Select your project (ogtheproject.com)
3. Click on **Settings** → **Environment Variables**
4. Add the following variables:

   | Variable Name | Value | Where to Get It |
   |--------------|-------|-----------------|
   | `BEEHIIV_API_KEY` | Your API key | Beehiiv Dashboard → Settings → Integrations → API |
   | `BEEHIIV_PUBLICATION_ID` | `pub_eb9f83dd-bdbf-4c2f-bd4a-b30a7acb2038` | Already provided ✓ |

5. Make sure to add them for **Production**, **Preview**, and **Development** environments

### Step 3: Get Your Beehiiv Credentials

If you don't have your Beehiiv credentials yet:

1. Log in to Beehiiv: <https://app.beehiiv.com/>
2. Go to **Settings** → **Integrations**
3. Find the **API** section
4. Copy your **API Key**
5. Copy your **Publication ID** (it should start with `pub_` or be a UUID)

### Step 4: Redeploy

After adding the environment variables:

1. Go to your Vercel project → **Deployments**
2. Click the three dots (...) on the latest deployment
3. Click **Redeploy**

OR simply push a new commit to trigger a deployment:

```bash
git add .
git commit -m "Fix Beehiiv integration for Vercel"
git push
```

### Step 5: Test

After deployment:

1. Visit your deployed site
2. Try to subscribe to the newsletter with a test email
3. Check your Beehiiv dashboard to confirm the subscriber was added

## Troubleshooting

### Error: "Server configuration error"

- Your environment variables aren't set in Vercel
- Double-check the variable names match exactly: `BEEHIIV_API_KEY` and `BEEHIIV_PUBLICATION_ID`

### Error: "401 Unauthorized"

- Your API key is incorrect
- Regenerate your API key in Beehiiv and update it in Vercel

### Error: "404 Not Found"

- Your Publication ID is incorrect
- Double-check the ID from your Beehiiv dashboard

### Still Getting "Function Error"

1. Check the Vercel function logs:
   - Go to your project in Vercel
   - Click on the failing deployment
   - Click on **Functions** tab
   - Click on `/api/subscribe`
   - Check the logs for specific error messages

2. Common issues:
   - Missing environment variables
   - Incorrect Beehiiv API endpoint
   - Invalid API key format

## Verification Checklist

- [ ] `vercel.json` has been updated with functions configuration
- [ ] `BEEHIIV_API_KEY` is set in Vercel environment variables
- [ ] `BEEHIIV_PUBLICATION_ID` is set in Vercel environment variables
- [ ] Environment variables are set for all environments (Production, Preview, Development)
- [ ] Project has been redeployed after setting environment variables
- [ ] Test subscription form on deployed site
- [ ] Verified subscriber appears in Beehiiv dashboard

## Need More Help?

- Check Vercel function logs for detailed error messages
- Check Beehiiv API documentation: <https://docs.beehiiv.com/>
- Review the deployment guide: `DEPLOYMENT.md`
