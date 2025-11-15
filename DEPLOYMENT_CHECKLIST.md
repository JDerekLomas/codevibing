# Deployment Checklist for CodeVibing

Use this checklist to ensure a smooth deployment to Vercel.

## Pre-Deployment

### Code Quality
- [ ] Run `npm run lint` - No linting errors
- [ ] Run `npm run build` - Build completes successfully
- [ ] Test application locally with `npm run dev`
- [ ] Verify all pages load correctly
- [ ] Check browser console for errors
- [ ] Test responsive design on mobile/tablet

### Environment Variables
- [ ] Obtain Anthropic API key from https://console.anthropic.com
- [ ] Verify API key works locally by adding to `.env.local`
- [ ] Test API endpoints that use Claude
- [ ] Document all required environment variables
- [ ] (Optional) Set up Supabase project if using database features
- [ ] (Optional) Set up Cloudinary if using image uploads

### Git Repository
- [ ] All changes committed to Git
- [ ] Repository pushed to GitHub/GitLab/Bitbucket
- [ ] `.env.local` and `.env` are NOT in repository (check `.gitignore`)
- [ ] Sensitive keys and secrets removed from code
- [ ] Choose main branch for production deployments

## Deployment

### Vercel Account Setup
- [ ] Create Vercel account at https://vercel.com
- [ ] Connect Vercel to your Git provider (GitHub/GitLab/Bitbucket)
- [ ] Verify email address

### Project Import
- [ ] Import project from Git repository
- [ ] Select correct repository
- [ ] Use default build settings (Next.js auto-detected)
- [ ] Name your project appropriately

### Environment Variables in Vercel
- [ ] Add `ANTHROPIC_API_KEY` (required)
- [ ] Add `CLAUDE_MODEL` (optional, defaults to claude-3-5-sonnet-latest)
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL` (if using database)
- [ ] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` (if using database)
- [ ] Add `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (if using images)
- [ ] Add `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` (if using images)
- [ ] Add `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` (if using analytics)
- [ ] Set environment scope: Production, Preview, Development

### Initial Deployment
- [ ] Click "Deploy" button
- [ ] Wait for build to complete (typically 2-5 minutes)
- [ ] Check build logs for errors
- [ ] Deployment succeeds

## Post-Deployment Verification

### Functional Testing
- [ ] Visit deployed URL
- [ ] Homepage loads correctly
- [ ] Navigate to Gallery page
- [ ] Test Playground functionality
- [ ] Test Create/Upload features
- [ ] Verify API routes work (check Network tab)
- [ ] Test on multiple browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile device

### Performance & Monitoring
- [ ] Check Vercel Analytics for page load times
- [ ] Enable Speed Insights in Vercel dashboard
- [ ] Set up error monitoring (Vercel logs)
- [ ] Verify Core Web Vitals are acceptable
- [ ] Check Lighthouse score (aim for 90+)

### Security
- [ ] Verify HTTPS is enabled (automatic on Vercel)
- [ ] Check security headers are present (Network tab > Response Headers)
- [ ] Ensure API keys are not exposed in client-side code
- [ ] Test CSP (Content Security Policy) if configured
- [ ] Verify no sensitive data in public routes

## Optional Enhancements

### Custom Domain
- [ ] Purchase domain if needed
- [ ] Add domain in Vercel dashboard (Settings > Domains)
- [ ] Update DNS records (A, CNAME)
- [ ] Wait for DNS propagation (up to 48 hours)
- [ ] Verify HTTPS certificate is issued
- [ ] Test custom domain

### Monitoring & Analytics
- [ ] Set up Plausible Analytics
- [ ] Configure error tracking (Sentry, LogRocket, etc.)
- [ ] Set up uptime monitoring
- [ ] Configure alerts for failures

### CI/CD Pipeline
- [ ] Enable automatic deployments from Git
- [ ] Set up preview deployments for PRs
- [ ] Configure deployment protection (optional)
- [ ] Add branch protection rules in Git

### Optimization
- [ ] Enable Image Optimization
- [ ] Configure caching headers
- [ ] Set up Edge Functions if needed
- [ ] Enable ISR (Incremental Static Regeneration) for dynamic pages
- [ ] Consider Edge Middleware for auth/redirects

## Maintenance

### Regular Tasks
- [ ] Monitor deployment logs weekly
- [ ] Check for dependency updates monthly
- [ ] Rotate API keys quarterly
- [ ] Review and update environment variables as needed
- [ ] Monitor usage and costs
- [ ] Backup database (if applicable)

### Scaling Considerations
- [ ] Monitor function execution times
- [ ] Check for cold starts
- [ ] Review bundle size and optimize
- [ ] Consider upgrading Vercel plan if needed
- [ ] Implement caching strategies
- [ ] Use Edge Functions for frequently accessed routes

## Troubleshooting

If deployment fails:
1. [ ] Review build logs in Vercel dashboard
2. [ ] Verify environment variables are set correctly
3. [ ] Test build locally: `npm run build`
4. [ ] Check Node.js version compatibility
5. [ ] Verify all dependencies are in `package.json`
6. [ ] Check Vercel status page for outages

If runtime errors occur:
1. [ ] Check Function Logs in Vercel dashboard
2. [ ] Verify API keys are valid and have permissions
3. [ ] Test API endpoints with Postman/curl
4. [ ] Check for CORS issues
5. [ ] Verify database connectivity (if applicable)

## Resources

- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs
- Anthropic API Docs: https://docs.anthropic.com
- CodeVibing Issues: https://github.com/JDerekLomas/codevibing/issues

---

**Deployment Date:** _________________

**Deployed By:** _________________

**Production URL:** _________________

**Notes:**
_____________________________________________________________________
_____________________________________________________________________
_____________________________________________________________________
