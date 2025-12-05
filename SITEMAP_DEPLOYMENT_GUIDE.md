# Sitemap Deployment Guide

## Environment Variables Configuration

Your sitemap URLs automatically update based on the deployment environment using the `NEXT_PUBLIC_SITE_BASE_URL` environment variable.

### Required Environment Variables

```bash
# Your website's base URL (changes per environment)
NEXT_PUBLIC_SITE_BASE_URL=https://yourdomain.com

# Elasticsearch configuration (same across environments usually)
NEXT_ES_URL=your_elasticsearch_url
NEXT_ES_API_KEY=your_api_key
```

## Platform-Specific Setup

### Vercel
1. Go to your project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add variables for each environment:

| Variable Name | Development | Preview | Production |
|--------------|-------------|---------|------------|
| `NEXT_PUBLIC_SITE_BASE_URL` | `http://localhost:3000` | `https://preview.yourdomain.com` | `https://yourdomain.com` |
| `NEXT_ES_URL` | (your ES URL) | (your ES URL) | (your ES URL) |
| `NEXT_ES_API_KEY` | (your API key) | (your API key) | (your API key) |

### Netlify
1. Go to **Site settings** → **Build & deploy** → **Environment**
2. Add environment variables:
   ```
   NEXT_PUBLIC_SITE_BASE_URL=https://yourdomain.com
   NEXT_ES_URL=your_elasticsearch_url
   NEXT_ES_API_KEY=your_api_key
   ```

### AWS Amplify
1. Go to **App settings** → **Environment variables**
2. Add your variables there

### Docker/Self-Hosted
Add to your `.env` file or docker-compose:
```yaml
environment:
  - NEXT_PUBLIC_SITE_BASE_URL=https://yourdomain.com
  - NEXT_ES_URL=your_elasticsearch_url
  - NEXT_ES_API_KEY=your_api_key
```

## Testing Different Environments

### Test Local Sitemap:
```bash
# Start dev server
npm run dev

# Visit
http://localhost:3000/sitemap.xml
```

### Test Production Build Locally:
```bash
# Build the production version
npm run build

# Start production server
npm start

# Visit
http://localhost:3000/sitemap.xml
```

### Verify URLs:
Check that the sitemap contains the correct base URL:
```xml
<url>
  <loc>https://yourdomain.com/brand/product/some-product</loc>
  <!-- Should match your NEXT_PUBLIC_SITE_BASE_URL -->
</url>
```

## Environment-Specific Files

### `.env.local` (Local development - NOT committed to git)
```bash
NEXT_PUBLIC_SITE_BASE_URL=http://localhost:3000
NEXT_ES_URL=your_elasticsearch_url
NEXT_ES_API_KEY=your_api_key
```

### `.env.production` (Optional - for production defaults)
```bash
NEXT_PUBLIC_SITE_BASE_URL=https://solanafireplaces.com
```

### `.env.staging` (Optional - for staging)
```bash
NEXT_PUBLIC_SITE_BASE_URL=https://staging.solanafireplaces.com
```

## Verification Checklist

After deployment, verify:

- [ ] Visit `https://yourdomain.com/sitemap.xml`
- [ ] Check that URLs use the correct domain (not localhost)
- [ ] Verify all product URLs are formatted correctly
- [ ] Check `https://yourdomain.com/robots.txt` points to correct sitemap
- [ ] Submit sitemap to Google Search Console
- [ ] Monitor for any crawl errors

## Common Issues

### ❌ Sitemap shows "localhost" URLs in production
**Solution:** Make sure `NEXT_PUBLIC_SITE_BASE_URL` is set in your hosting platform's environment variables.

### ❌ Sitemap shows default URL "https://yourdomain.com"
**Solution:** You forgot to set `NEXT_PUBLIC_SITE_BASE_URL`. Set it in your deployment platform.

### ❌ Sitemap is empty or has errors
**Solution:** Check that `NEXT_ES_URL` and `NEXT_ES_API_KEY` are correctly set and Elasticsearch is accessible from your hosting environment.

### ❌ Environment variable not updating
**Solution:**
1. Redeploy your application after changing environment variables
2. Make sure variable names match exactly (case-sensitive)
3. For `NEXT_PUBLIC_*` variables, they're embedded at build time, so you need to rebuild

## Important Notes

1. **`NEXT_PUBLIC_` prefix is required** for variables used in client-side code
2. **Environment variables are embedded at build time** - changing them requires a rebuild
3. **Never commit `.env.local`** to version control (it's in `.gitignore` by default)
4. **Sitemap regenerates on each request** unless you use caching (Next.js handles this automatically)

## Submit to Search Engines

### Google Search Console
1. Go to https://search.google.com/search-console
2. Add your property
3. Navigate to **Sitemaps** in the sidebar
4. Submit: `https://yourdomain.com/sitemap.xml`

### Bing Webmaster Tools
1. Go to https://www.bing.com/webmasters
2. Add your site
3. Submit sitemap: `https://yourdomain.com/sitemap.xml`

## Monitoring

Check your sitemap regularly:
```bash
# Quick check of sitemap size
curl -s https://yourdomain.com/sitemap.xml | grep -c "<url>"

# View first few URLs
curl -s https://yourdomain.com/sitemap.xml | grep "<loc>" | head -10
```
