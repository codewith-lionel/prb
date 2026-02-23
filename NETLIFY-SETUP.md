# Netlify Deployment Configuration

## Frontend Deployed to Netlify ✅
- Client URL: https://resonant-platypus-720b14.netlify.app
- Admin URL: https://ephemeral-jalebi-d20236.netlify.app

## URGENT: Update Render Backend CORS

Go to your Render dashboard and update the environment variable:

### Steps:
1. Open https://dashboard.render.com
2. Select your `prb-1` service
3. Click **Environment** tab
4. Find or add `ALLOWED_ORIGINS` and set it to:
   ```
   https://resonant-platypus-720b14.netlify.app,https://ephemeral-jalebi-d20236.netlify.app
   ```
   
5. If you also want to allow localhost for testing, use:
   ```
   https://resonant-platypus-720b14.netlify.app,https://ephemeral-jalebi-d20236.netlify.app,http://localhost:3001,http://localhost:3002
   ```

6. Click **Save Changes**
7. Wait 1-2 minutes for automatic redeployment

## Environment Variables Set on Netlify
Make sure these are set in **both** Netlify sites:

### Client Site (resonant-platypus-720b14)
- Go to Site settings → Environment variables
- Add: `VITE_API_URL = https://prb-1.onrender.com/api`

### Admin Site (ephemeral-jalebi-d20236)
- Go to Site settings → Environment variables
- Add: `VITE_API_URL = https://prb-1.onrender.com/api`

## Testing
After Render redeploys, test both sites:
- Client: https://resonant-platypus-720b14.netlify.app
- Admin: https://ephemeral-jalebi-d20236.netlify.app

The CORS error should be resolved on both sites!
