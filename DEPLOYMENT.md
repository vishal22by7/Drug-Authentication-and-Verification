# 🚀 Deployment Guide

## Option 1: GitHub + Vercel (Recommended) ⭐

### Step 1: Push to GitHub

1. **Initialize Git** (if not already done):
   ```bash
   git init
   ```

2. **Add all files**:
   ```bash
   git add .
   ```

3. **Commit**:
   ```bash
   git commit -m "Initial commit: Drug Authenticity Verification System"
   ```

4. **Create a new repository on GitHub**:
   - Go to https://github.com/new
   - Name it: `drug-auth-verification` (or your choice)
   - Don't initialize with README
   - Click "Create repository"

5. **Link and push**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/drug-auth-verification.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Vercel via GitHub

1. **Go to Vercel**: https://vercel.com

2. **Sign up/Login** with your GitHub account

3. **Click "Add New Project"**

4. **Import your GitHub repository**:
   - Select `drug-auth-verification`
   - Click "Import"

5. **Configure Project**:
   - Framework Preset: **Other** (or Express.js)
   - Root Directory: `./`
   - Build Command: Leave empty (or `npm install`)
   - Output Directory: Leave empty
   - Install Command: `npm install`

6. **Environment Variables** (Optional):
   - `PORT`: `3000`
   - `OPENFDA_API_KEY`: Your API key (if you have one)
   - `NODE_ENV`: `production`

7. **Click "Deploy"**

8. **Wait for deployment** (2-3 minutes)

9. **Get your deployment URL**:
   - After deployment completes, Vercel will show you a URL like: `https://your-app-name.vercel.app`
   - This is your live project URL! 🎉
   - You can also find it in: Vercel Dashboard → Your Project → Deployments → Click on latest deployment

10. **Access your project**:
    - Simply visit: `https://your-app-name.vercel.app` in your browser
    - The database will **auto-initialize on first request** (no manual setup needed!)

### Benefits:
✅ Automatic deployments on every push  
✅ Preview deployments for pull requests  
✅ Free SSL certificate  
✅ Global CDN  
✅ Easy rollback  
✅ Version control history  

---

## Option 2: Direct Vercel CLI Deployment

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Login
```bash
vercel login
```

### Step 3: Deploy
```bash
vercel
```

### Step 4: Follow Prompts
- Link to existing project? **No**
- Project name: `drug-auth-verification`
- Directory: `./`
- Override settings? **No**

### Step 5: Deploy to Production
```bash
vercel --prod
```

### Step 6: Access Your Project
- Visit: `https://your-app.vercel.app` in your browser
- The database will **auto-initialize on first request** (no manual setup needed!)

---

## ⚠️ Important Notes

### Database Initialization on Vercel

Since Vercel uses serverless functions, the database needs to be initialized after each deployment. You have two options:

**✅ Auto-initialization is now enabled!**

The database and events will automatically initialize on the first request to your deployed app. No manual setup needed!

If you need to manually re-initialize, you can still use:
```bash
curl -X POST https://your-app.vercel.app/api/init-db
curl -X POST https://your-app.vercel.app/api/add-events
```

### Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:
- `PORT`: `3000`
- `OPENFDA_API_KEY`: (optional, your API key)
- `NODE_ENV`: `production`

---

## 🎯 Recommendation

**Use Option 1 (GitHub + Vercel)** because:
- ✅ Better for collaboration
- ✅ Automatic deployments
- ✅ Version control
- ✅ Preview deployments
- ✅ Free hosting
- ✅ Easy to update (just push to GitHub)

---

## 📝 Quick Commands Summary

```bash
# Initialize Git
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git push -u origin main

# Then deploy via Vercel Dashboard (GitHub integration)
# After deployment, visit: https://your-app-name.vercel.app
```

## 🌐 How to Access Your Deployed Project

### Step 1: Get Your Deployment URL

After deployment completes, you'll see your URL in:

**Option A: Vercel Dashboard**
1. Go to https://vercel.com/dashboard
2. Click on your project name
3. You'll see the deployment URL at the top (e.g., `https://drug-auth-verification.vercel.app`)

**Option B: Deployment Logs**
- After deployment, Vercel shows: `✅ Production: https://your-app.vercel.app`

**Option C: Project Settings**
1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Domains"
3. Your default domain is listed there

### Step 2: Visit Your Project

Simply open the URL in your browser:
```
https://your-app-name.vercel.app
```

### Step 3: Test the Application

1. **Home Page**: `https://your-app-name.vercel.app`
2. **Scan a QR Code**: Use codes like `DRG001`, `DRG003`, `DRG005`
3. **View Results**: Check drug verification results
4. **Supply Chain**: View supply chain history

### Step 4: Share Your Project

You can share your deployment URL with anyone! It's live and accessible worldwide.

**Note**: The database auto-initializes on first request, so everything works immediately!

---

## 🔧 Troubleshooting

**Database not persisting?**
- Vercel uses `/tmp` directory which is ephemeral
- Consider using Vercel Postgres for production
- Or use external database (MongoDB Atlas, Supabase, etc.)

**Build fails?**
- Check `vercel.json` configuration
- Ensure all dependencies are in `package.json`
- Check build logs in Vercel dashboard

**API routes not working?**
- Ensure `vercel.json` routes are correct
- Check serverless function logs in Vercel dashboard

