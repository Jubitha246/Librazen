# Librazen Deployment Guide

This guide will help you deploy your Librazen project to Vercel (frontend) and Render (backend).

## Prerequisites

1. **GitHub Account**: Your code should be in a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Render Account**: Sign up at [render.com](https://render.com)
4. **MongoDB Atlas**: For database hosting

## Step 1: Backend Deployment (Render)

### 1.1 Prepare Your Backend

1. **Update Environment Variables**:
   - Create a `.env` file in your backend directory with:
   ```
   NODE_ENV=production
   PORT=10000
   MongoDBURI=your_mongodb_atlas_connection_string
   ```

2. **Ensure Dependencies**: Make sure all dependencies are in `package.json`

### 1.2 Deploy to Render

1. **Connect GitHub Repository**:
   - Go to [render.com](https://render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub account
   - Select your repository

2. **Configure the Service**:
   - **Name**: `librazen-backend`
   - **Root Directory**: `backend` (if your backend is in a subdirectory)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Set Environment Variables**:
   - Click on "Environment" tab
   - Add the following variables:
     - `NODE_ENV`: `production`
     - `PORT`: `10000`
     - `MongoDBURI`: Your MongoDB Atlas connection string

4. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL (e.g., `https://librazen-backend.onrender.com`)

## Step 2: Frontend Deployment (Vercel)

### 2.1 Prepare Your Frontend

1. **Update API Configuration**:
   - In `backend/Frontend/src/config/api.js`, the API URL will be set via environment variable
   - Create a `.env.local` file in the frontend directory:
   ```
   VITE_API_URL=https://your-backend-app.onrender.com
   ```

2. **Test Locally**:
   ```bash
   cd backend/Frontend
   npm install
   npm run build
   ```

### 2.2 Deploy to Vercel

1. **Connect Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure the Project**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `backend/Frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Set Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add:
     - `VITE_API_URL`: `https://your-backend-app.onrender.com`

4. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete
   - Your frontend will be available at `https://your-app.vercel.app`

## Step 3: Update CORS Configuration

After getting your frontend URL, update the backend CORS configuration:

1. **Update `backend/index.js`**:
   ```javascript
   app.use(cors({
     origin: process.env.NODE_ENV === 'production' 
       ? ['https://your-frontend-app.vercel.app', 'http://localhost:3000'] 
       : 'http://localhost:3000',
     credentials: true
   }));
   ```

2. **Redeploy Backend**:
   - Push changes to GitHub
   - Render will automatically redeploy

## Step 4: Final Configuration

### 4.1 Update Frontend Environment

1. **In Vercel Dashboard**:
   - Go to your project settings
   - Update `VITE_API_URL` with your actual backend URL

2. **Redeploy Frontend**:
   - Trigger a new deployment in Vercel

### 4.2 Test Your Application

1. **Test User Registration/Login**
2. **Test Book Management** (Admin)
3. **Test Book Borrowing** (User)
4. **Test File Uploads**

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure your frontend URL is correctly added to CORS origins
   - Check that environment variables are set correctly

2. **Database Connection**:
   - Verify MongoDB Atlas connection string
   - Ensure IP whitelist includes Render's IPs

3. **File Upload Issues**:
   - Check that uploads directory exists
   - Verify file permissions

4. **Environment Variables**:
   - Double-check all environment variables are set
   - Ensure variable names match exactly

### Debugging

1. **Check Render Logs**:
   - Go to your Render service
   - Click "Logs" tab
   - Look for error messages

2. **Check Vercel Logs**:
   - Go to your Vercel project
   - Click "Functions" tab
   - Check for build errors

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to Git
2. **CORS**: Only allow necessary origins
3. **MongoDB**: Use strong passwords and IP whitelisting
4. **HTTPS**: Both Vercel and Render provide HTTPS by default

## Maintenance

1. **Regular Updates**: Keep dependencies updated
2. **Monitoring**: Set up monitoring for your applications
3. **Backups**: Regular database backups
4. **Logs**: Monitor application logs for issues

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Render and Vercel documentation
3. Check your application logs
4. Verify all environment variables are set correctly
