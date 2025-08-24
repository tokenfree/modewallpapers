# ModeWallpapers - Render.com Deployment Guide

This guide will help you deploy your ModeWallpapers application to Render.com.

## Prerequisites

1. A Render.com account
2. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. A PostgreSQL database (you can create one on Render.com)

## Deployment Steps

### 1. Create a PostgreSQL Database (Optional)

If your app uses a database:
1. Go to your Render dashboard
2. Click "New +" and select "PostgreSQL"
3. Configure your database settings
4. Note the connection string for later

### 2. Deploy the Web Service

#### Option A: Using render.yaml (Recommended)
1. Push your code to your Git repository with the `render.yaml` file
2. Go to Render.com dashboard
3. Click "New +" and select "Blueprint"
4. Connect your repository
5. Render will automatically detect the `render.yaml` and create your services

#### Option B: Manual Setup
1. Go to Render.com dashboard
2. Click "New +" and select "Web Service"
3. Connect your Git repository
4. Configure the following settings:
   - **Build Command**: `./scripts/render-build.sh`
   - **Start Command**: `npm start`
   - **Environment**: `Node`
   - **Plan**: Select your preferred plan

### 3. Environment Variables

Set these environment variables in your Render service:

**Required:**
- `NODE_ENV`: `production`
- `DATABASE_URL`: Your PostgreSQL connection string
- `SESSION_SECRET`: A secure random string

**Optional (depending on your app features):**
- `GOOGLE_CLIENT_ID`: Your Google API client ID
- `GOOGLE_CLIENT_SECRET`: Your Google API client secret
- `PORT`: `10000` (Render will set this automatically)

### 4. Custom Domain (Optional)

If you want to use a custom domain:
1. Go to your service settings
2. Click "Custom Domains"
3. Add your domain and configure DNS

## Build Process

The build process will:
1. Install dependencies with `npm ci`
2. Run database migrations (if `DATABASE_URL` is set)
3. Build the React frontend with Vite
4. Bundle the Express server with esbuild

## Health Check

The app includes a health check endpoint at `/api/health` that Render uses to monitor your service.

## Troubleshooting

### Build Fails
- Check that all required environment variables are set
- Ensure your `package.json` has all necessary dependencies
- Review build logs for specific error messages

### Database Connection Issues
- Verify `DATABASE_URL` is correctly set
- Ensure your database is running and accessible
- Check if your database requires SSL connections

### Application Won't Start
- Check that the `start` command in `package.json` is correct
- Verify the build output exists in the `dist` directory
- Review application logs for startup errors

## Local Development

To run locally:
```bash
npm install
npm run dev
```

## Production Build (Local Testing)

To test the production build locally:
```bash
npm run build
npm start
```

## Support

For Render-specific issues, check:
- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com/)

For application issues, check the application logs in your Render dashboard.
