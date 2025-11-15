# Deploying CodeVibing to Vercel

This guide will help you deploy the CodeVibing application to Vercel.

## Prerequisites

- A Vercel account (sign up at https://vercel.com)
- Git repository (GitHub, GitLab, or Bitbucket)
- Required API keys (see Environment Variables section)

## Quick Deploy

### Option 1: Deploy via Vercel Dashboard

1. **Push your code to a Git repository** (if not already done)
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Import your project to Vercel**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select your CodeVibing repository
   - Configure your project settings

3. **Configure Environment Variables**

   Add these environment variables in the Vercel dashboard:

   **Required:**
   - `ANTHROPIC_API_KEY` - Your Anthropic API key for Claude
   - `CLAUDE_MODEL` - Model to use (e.g., `claude-3-5-sonnet-latest`)

   **Optional:**
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL (if using database)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name (for image uploads)
   - `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` - Cloudinary upload preset
   - `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` - Domain for Plausible analytics

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from the project directory**
   ```bash
   cd /Users/dereklomas/codevibing/codevibing
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? Yes
   - Which scope? Select your account
   - Link to existing project? No (first time) or Yes (subsequent deploys)
   - What's your project's name? codevibing
   - In which directory is your code located? ./
   - Want to override settings? No

5. **Add environment variables**
   ```bash
   vercel env add ANTHROPIC_API_KEY
   vercel env add CLAUDE_MODEL
   ```

6. **Deploy to production**
   ```bash
   vercel --prod
   ```

## Environment Variables Setup

### Getting API Keys

**Anthropic API Key:**
1. Sign up at https://console.anthropic.com
2. Go to API Keys section
3. Create a new API key
4. Copy the key and add it to Vercel

**Supabase (Optional - for database features):**
1. Create a project at https://supabase.com
2. Go to Settings > API
3. Copy the URL and anon/public key

**Cloudinary (Optional - for image uploads):**
1. Create account at https://cloudinary.com
2. Go to Dashboard to get cloud name
3. Go to Settings > Upload to create an upload preset

## Post-Deployment

### 1. Verify Deployment

Visit your deployed URL and check:
- Home page loads correctly
- Gallery displays properly
- Playground is functional
- No console errors

### 2. Custom Domain (Optional)

To add a custom domain:
1. Go to your project in Vercel dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update your DNS records as instructed

### 3. Monitoring

Vercel provides built-in monitoring:
- **Analytics**: Track page views and performance
- **Logs**: View real-time function logs
- **Speed Insights**: Monitor Core Web Vitals

## Automatic Deployments

Once connected to Git, Vercel will automatically:
- Deploy every push to `main` branch to production
- Create preview deployments for pull requests
- Run builds and tests before deploying

## Build Settings

The project uses default Next.js build settings:
- **Build Command**: `npm run build` (or `next build`)
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

These are automatically detected by Vercel and don't need configuration.

## Troubleshooting

### Build Fails

If the build fails:
1. Check the build logs in Vercel dashboard
2. Ensure all environment variables are set correctly
3. Verify the build works locally: `npm run build`
4. Check that all dependencies are in `package.json`

### Runtime Errors

If you see errors after deployment:
1. Check Function Logs in Vercel dashboard
2. Verify environment variables are set correctly
3. Check that API keys are valid and have proper permissions

### API Route Issues

For API route problems:
- Ensure functions don't exceed Vercel's 10-second timeout
- Check that serverless function size is under 50MB
- Verify Node.js version compatibility

## Performance Optimization

### Image Optimization

Next.js automatically optimizes images. Ensure:
- Images are properly configured in `next.config.js`
- Use Next.js `<Image>` component where possible

### Caching

Vercel automatically caches:
- Static assets (CSS, JS, images)
- Static pages
- API responses (configurable)

### Edge Functions (Optional)

Consider using Edge Functions for:
- Authentication
- Redirects
- A/B testing
- Geolocation-based content

## Security

### Environment Variables

- Never commit `.env.local` to Git
- Use Vercel's environment variable encryption
- Rotate API keys regularly
- Use different keys for preview vs production

### Headers

Consider adding security headers in `next.config.js`:
```javascript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'origin-when-cross-origin' }
      ]
    }
  ]
}
```

## Support

- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs
- CodeVibing Issues: https://github.com/JDerekLomas/codevibing/issues

## Next Steps

1. ✅ Build succeeds locally
2. ⬜ Push to Git repository
3. ⬜ Connect to Vercel
4. ⬜ Add environment variables
5. ⬜ Deploy to production
6. ⬜ Test deployed application
7. ⬜ Configure custom domain (optional)
8. ⬜ Set up monitoring and analytics
