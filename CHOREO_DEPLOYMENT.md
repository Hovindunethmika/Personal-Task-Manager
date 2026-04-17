# Choreo Deployment Guide

This guide will help you deploy the Task Manager application on Choreo.

## Prerequisites

1. **Choreo Account**: Sign up at [https://console.choreo.dev](https://console.choreo.dev)
2. **GitHub Repository**: Push your code to GitHub
3. **GitHub Access Token**: Create a personal access token with `repo` permissions

## Step 1: Prepare Your Repository

Ensure your repository has the following structure at the root:
```
.
├── choreo.yaml              (Deployment configuration)
├── task-manager/            (Go backend)
│   ├── Dockerfile
│   ├── go.mod
│   ├── go.sum
│   ├── cmd/
│   ├── config/
│   ├── internal/
│   └── .dockerignore
└── task-manager-frontend/   (React frontend)
    ├── package.json
    ├── public/
    ├── src/
    ├── .env.production
    └── .env.development
```

## Step 2: Create Application in Choreo

1. Log in to [Choreo Console](https://console.choreo.dev)
2. Click **Create Component** or **New Project**
3. Select **Multi-Service Application**
4. Choose **GitHub** as the source
5. Connect your GitHub account and select your repository

## Step 3: Configure Components

### Backend Service
1. Click **Add Component** → **Backend Service**
2. Select your repository and branch
3. **Build Pack**: Select **Dockerfile**
4. **Dockerfile Path**: `task-manager/Dockerfile`
5. **Port**: `8080`
6. Environment Variables:
   - `GIN_MODE`: `release`
   - `DB_PATH`: `/app/data/tasks.db`

### Frontend Service
1. Click **Add Component** → **Web Application**
2. **Build Pack**: Select **Node.js**
3. **Directory**: `task-manager-frontend`
4. **Node Version**: `18`
5. **Build Command**: `npm run build`
6. **Start Command**: `npm start`
7. Environment Variables:
   - `REACT_APP_API_URL`: Get the backend service URL from Choreo and set it here

## Step 4: Set Up API Communication

After deploying the backend service:
1. Copy the backend service's public endpoint URL
2. Update the frontend's environment variable `REACT_APP_API_URL` with the backend URL
3. Redeploy the frontend

## Step 5: Deploy

1. Review all settings
2. Click **Deploy**
3. Wait for both services to build and deploy successfully

## Environment Configuration

### Backend Environment Variables
- `PORT`: Service port (default: 8080)
- `GIN_MODE`: `debug` or `release` (default: release for production)
- `DB_PATH`: Path to SQLite database

### Frontend Environment Variables
- `REACT_APP_API_URL`: Backend API URL (e.g., `https://your-backend.choreo.dev`)

## Monitoring

In the Choreo Console, you can:
- View service logs
- Monitor resource usage
- Check deployment status
- Scale services as needed

## Troubleshooting

### Database Issues
- SQLite stores data at `/app/data/tasks.db`
- Ensure the backend has write permissions to this directory

### API Connection Issues
- Verify `REACT_APP_API_URL` is set correctly
- Check CORS settings on the backend
- Ensure both services are running

### Build Failures
- Check build logs in Choreo Console
- Verify Go dependencies are properly declared in `go.mod`
- Ensure Node.js dependencies are in `package.json`

## Additional Resources

- [Choreo Documentation](https://wso2.com/choreo/docs/)
- [Choreo API Reference](https://wso2.com/choreo/docs/api/)
- [Gin Framework Docs](https://gin-gonic.com/)
- [React Documentation](https://react.dev/)

## Support

For Choreo-specific issues, visit the [Choreo Support Page](https://wso2.com/choreo/support/).
