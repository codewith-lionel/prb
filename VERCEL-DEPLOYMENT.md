# Vercel Deployment Guide

## Prerequisites
- Backend hosted at: https://prb-1.onrender.com
- Vercel account

## Deploy Client App

1. **Push your code to GitHub** (if not already done)

2. **Import to Vercel**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import your repository
   - Set Root Directory: `client`

3. **Configure Environment Variables in Vercel**
   ```
   VITE_API_URL=https://prb-1.onrender.com/api
   ```

4. **Build Settings** (auto-detected)
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Deploy**

## Deploy Admin App

1. **Create New Project in Vercel**
   - Import the same repository
   - Set Root Directory: `admin`

2. **Configure Environment Variables in Vercel**
   ```
   VITE_API_URL=https://prb-1.onrender.com/api
   ```

3. **Build Settings** (auto-detected)
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Deploy**

## Update Backend CORS

After deploying, you'll get URLs like:
- Client: `https://your-client-app.vercel.app`
- Admin: `https://your-admin-app.vercel.app`

**Update these environment variables on Render:**

```
CLIENT_URL=https://your-client-app.vercel.app
ADMIN_URL=https://your-admin-app.vercel.app
```

Or if you want to allow both local and production:
```
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
ALLOWED_ORIGINS=https://your-client-app.vercel.app,https://your-admin-app.vercel.app
```

Then redeploy your backend on Render.

## Notes

- Vercel will automatically redeploy when you push to your main branch
- You can set up preview deployments for other branches
- Both client and admin can be deployed from the same repository by setting different root directories
