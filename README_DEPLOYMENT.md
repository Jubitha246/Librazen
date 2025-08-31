# Librazen Deployment

## Quick Start

1. **Run the setup script**:
   ```bash
   node setup-deployment.js
   ```

2. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

3. **Deploy Backend (Render)**:
   - Go to [render.com](https://render.com)
   - Create new Web Service
   - Connect your GitHub repo
   - Set root directory: `backend`
   - Environment variables:
     - `NODE_ENV`: `production`
     - `PORT`: `10000`
     - `MongoDBURI`: Your MongoDB connection string

4. **Deploy Frontend (Vercel)**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repo
   - Set root directory: `backend/Frontend`
   - Environment variable:
     - `VITE_API_URL`: Your Render backend URL

5. **Update CORS**:
   - Update `backend/index.js` with your Vercel URL
   - Redeploy backend

## Files Modified for Deployment

- ✅ `backend/Frontend/src/config/api.js` - API configuration
- ✅ `backend/Frontend/vercel.json` - Vercel configuration
- ✅ `backend/index.js` - CORS and production setup
- ✅ `backend/render.yaml` - Render configuration
- ✅ All frontend components updated to use API config

## Environment Variables

### Backend (Render)
```
NODE_ENV=production
PORT=10000
MongoDBURI=your_mongodb_connection_string
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend-app.onrender.com
```

## Support

See `DEPLOYMENT_GUIDE.md` for detailed instructions and troubleshooting.
