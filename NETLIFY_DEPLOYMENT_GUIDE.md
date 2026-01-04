# Netlify Deployment Guide for Beergeel Clinic System

## Step-by-Step Guide to Deploy on Netlify (Free)

### Method 1: Deploy via Netlify Dashboard (Easiest - Recommended)

#### Step 1: Create Netlify Account
1. Go to https://www.netlify.com/
2. Click **"Sign up"** (top right)
3. Choose **"Sign up with GitHub"** (recommended - uses your existing GitHub account)
4. Authorize Netlify to access your GitHub account

#### Step 2: Connect Your Repository
1. Once logged in, click **"Add new site"** → **"Import an existing project"**
2. Choose **"Deploy with GitHub"**
3. Authorize Netlify if prompted
4. Select your repository: **`beergeel/beergeel`**
5. Click **"Connect"**

#### Step 3: Configure Build Settings
Netlify will auto-detect your React app, but verify these settings:

**Build command:** `npm run build`
**Publish directory:** `build`
**Base directory:** (leave empty)

These should be pre-filled correctly. If not, enter them manually.

#### Step 4: Add Environment Variables (if needed)
If your app uses environment variables (like Supabase keys):
1. Go to **Site settings** → **Environment variables**
2. Add any variables needed (e.g., `REACT_APP_SUPABASE_URL`, `REACT_APP_SUPABASE_ANON_KEY`)
3. Click **"Deploy site"**

#### Step 5: Deploy!
1. Click **"Deploy site"** button
2. Wait for build to complete (2-5 minutes)
3. Your site will be live at: `https://random-name-123456.netlify.app`
4. You can customize the domain name later

#### Step 6: Customize Domain (Optional)
1. Go to **Site settings** → **Domain management**
2. Click **"Change site name"**
3. Enter a name like: `beergeel-clinic` (must be unique)
4. Your site will be at: `https://beergeel-clinic.netlify.app`

---

### Method 2: Deploy via Netlify CLI (Command Line)

#### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### Step 2: Login to Netlify
```bash
netlify login
```
This will open your browser for authentication.

#### Step 3: Initialize and Deploy
```bash
# Build your project first
npm run build

# Deploy to Netlify
netlify deploy

# For production deployment:
netlify deploy --prod
```

---

### Method 3: Drag & Drop (Quick Test)

1. Build your project locally:
   ```bash
   npm run build
   ```

2. Go to https://app.netlify.com/drop

3. Drag and drop the `build` folder

4. Your site will be live in seconds!

**Note:** This method doesn't connect to GitHub, so you'll need to redeploy manually each time you make changes.

---

## Automatic Deployments

Once connected via Method 1 (GitHub), Netlify will automatically:
- ✅ Deploy every time you push to the `main` branch
- ✅ Create preview deployments for pull requests
- ✅ Show build logs and status

---

## Troubleshooting

### Build Fails
- Check build logs in Netlify dashboard
- Make sure all dependencies are in `package.json`
- Ensure build command is correct: `npm run build`

### Environment Variables Not Working
- Make sure variables start with `REACT_APP_` for Create React App
- Redeploy after adding environment variables

### Routing Not Working (404 errors)
- The `netlify.toml` file should handle this with the redirect rule
- Make sure the file exists in your repository root

### Site Not Updating
- Trigger a new deployment: **Deploys** → **Trigger deploy** → **Deploy site**

---

## Important Notes

1. **Free Tier Limits:**
   - 100 GB bandwidth per month
   - 300 build minutes per month
   - Unlimited sites

2. **Custom Domain (Free):**
   - You can add a custom domain for free
   - Go to Domain settings → Add custom domain

3. **SSL Certificate:**
   - Free SSL (HTTPS) is automatically enabled
   - Your site will be secure by default

---

## After Deployment

Your Beergeel Clinic System will be live and accessible worldwide!

**Next Steps:**
1. Test your deployed site
2. Share the URL with your team
3. Set up a custom domain if needed
4. Monitor usage in Netlify dashboard

---

## Need Help?

- Netlify Docs: https://docs.netlify.com/
- Netlify Community: https://answers.netlify.com/

