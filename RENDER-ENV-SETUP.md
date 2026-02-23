# Render Environment Variables Configuration

Set these environment variables on your Render backend:

## Option 1: Development Mode (Recommended for Testing)
This allows all localhost origins automatically:

```
NODE_ENV=development
```

## Option 2: Specific Origins (More Secure)
Set specific allowed origins:

```
NODE_ENV=production
ALLOWED_ORIGINS=http://localhost:3001,http://localhost:3002,http://localhost:5173,http://localhost:5174
```

## For Production Deployment
When you deploy your frontend to Vercel, update:

```
NODE_ENV=production
ALLOWED_ORIGINS=https://your-client.vercel.app,https://your-admin.vercel.app
```

## Steps to Update on Render:
1. Go to https://dashboard.render.com
2. Select your backend service (prb-1)
3. Click "Environment" in the left sidebar
4. Add/Update the environment variables above
5. Click "Save Changes"
6. Render will automatically redeploy your backend

After saving, wait 1-2 minutes for the redeployment to complete.
