# Vercel Deployment Guide for Uni Tracker

## Prerequisites
- Vercel account (sign up at https://vercel.com)
- Vercel CLI installed: `npm i -g vercel`
- PostgreSQL database (Neon, Supabase, or similar)

## Deployment Steps

### 1. Prepare Your Database
Since you're using a PostgreSQL database (currently from Replit), you'll need to either:
- **Option A**: Keep using Replit's database (copy the DATABASE_URL)
- **Option B**: Create a new database on Neon (https://neon.tech) or Supabase (https://supabase.com)

### 2. Install Vercel CLI
```bash
npm i -g vercel
```

### 3. Login to Vercel
```bash
vercel login
```

### 4. Deploy to Vercel
```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? Select your account
- Link to existing project? **No**
- What's your project's name? `uni-tracker` (or your preferred name)
- In which directory is your code located? `./`
- Want to override settings? **No**

### 5. Set Environment Variables

After initial deployment, add your environment variables:

```bash
vercel env add DATABASE_URL
```
Paste your PostgreSQL connection string when prompted.

```bash
vercel env add SESSION_SECRET
```
Enter a random secure string (e.g., generate with `openssl rand -base64 32`).

### 6. Redeploy with Environment Variables
```bash
vercel --prod
```

## Important Notes

### Database Connection
- Your DATABASE_URL should be a PostgreSQL connection string
- If using Replit's database, copy it from your environment variables
- For production, consider using Neon (https://neon.tech) which is free and serverless

### Authentication
The app uses Replit Auth, which requires configuration:
- Update the callback URL in your Replit Auth settings to point to your Vercel domain
- Example: `https://your-app.vercel.app/api/callback`

### Focus Sounds
✅ **Working**: Focus sounds use Web Audio API to generate ambient tones directly in the browser - no external files or CORS issues!

## Troubleshooting

### Build Fails
- Ensure all dependencies are in `package.json`
- Check build logs: `vercel logs`

### Database Connection Errors
- Verify DATABASE_URL is set correctly
- Check if your database allows connections from Vercel's IP ranges
- For Neon/Supabase, ensure SSL is configured

### API Routes Not Working
- Check `vercel.json` configuration
- Ensure routes are correctly mapped
- View deployment logs: `vercel logs --follow`

## Custom Domain (Optional)
Once deployed, you can add a custom domain:
1. Go to your project on Vercel dashboard
2. Navigate to Settings > Domains
3. Add your custom domain
4. Update DNS records as instructed

## Local Development with Vercel
```bash
vercel dev
```

This runs your app locally using Vercel's environment.
