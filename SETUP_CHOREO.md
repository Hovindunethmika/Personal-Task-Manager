# Task Manager - Choreo Deployment Setup

This document explains all the files and configurations needed to deploy your Task Manager application on Choreo.

## Files Created/Modified for Choreo Deployment

### Backend (Go)
- **`task-manager/Dockerfile`** - Multi-stage Docker build for the Go backend
- **`task-manager/.dockerignore`** - Files to exclude from Docker image
- **`task-manager/.choreoignore`** - Files to exclude from Choreo deployment
- **`task-manager/config/config.go`** - Configuration loader (already present, uses environment variables)
- **`task-manager/internal/middleware/middleware.go`** - Updated CORS middleware to support environment-based origin control

### Frontend (React)
- **`task-manager-frontend/Dockerfile.dev`** - Development Docker file for React
- **`task-manager-frontend/.dockerignore`** - Files to exclude from Docker image
- **`task-manager-frontend/.env.development`** - Development environment variables
- **`task-manager-frontend/.env.production`** - Production environment variables
- **`task-manager-frontend/src/api/tasks.js`** - Updated to use REACT_APP_API_URL environment variable

### Deployment Configuration
- **`choreo.yaml`** - Main Choreo deployment configuration (at project root)
- **`docker-compose.yml`** - Local testing with Docker Compose
- **`CHOREO_DEPLOYMENT.md`** - Detailed deployment guide

## Environment Variables

### Backend Service Variables
```bash
PORT=8080                    # Port the service runs on
GIN_MODE=release            # Set to "release" for production
DB_PATH=/app/data/tasks.db  # Path to SQLite database
ALLOWED_ORIGINS=*           # CORS origins (set to specific domains in production)
```

### Frontend Service Variables
```bash
REACT_APP_API_URL=https://your-backend-url.choreo.dev
```

## Quick Start

### 1. Local Testing with Docker Compose

```bash
cd "personal task manager"
docker-compose up
```

Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:8080

### 2. Deploy to Choreo

**Step 1:** Push your code to GitHub

```bash
git add .
git commit -m "Add Choreo deployment configuration"
git push origin main
```

**Step 2:** In Choreo Console:
1. Create a new project or component
2. Connect your GitHub repository
3. Configure the backend service (Go with Dockerfile)
4. Configure the frontend service (Node.js React app)
5. Set environment variables as described above
6. Deploy

**Step 3:** After deployment:
1. Get the backend service URL from Choreo
2. Update the frontend's `REACT_APP_API_URL` with the backend URL
3. Redeploy the frontend

## Production Checklist

- [ ] Environment variables are correctly set in Choreo
- [ ] Backend `ALLOWED_ORIGINS` is set to your frontend domain (not `*`)
- [ ] `GIN_MODE` is set to `release`
- [ ] Database path is set to persistent storage location
- [ ] Frontend `REACT_APP_API_URL` points to the correct backend URL
- [ ] Both services have health checks enabled
- [ ] Monitoring and logging are configured

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Choreo Platform                       │
├──────────────────────┬──────────────────────────────────┤
│   Frontend Service   │      Backend Service             │
│   (React/Node.js)    │      (Go/Gin)                    │
│   Port: 3000         │      Port: 8080                  │
│   Build: npm build   │      Build: Docker               │
│   - App.jsx          │      - main.go                   │
│   - API client       │      - handlers                  │
│   - Components       │      - database                  │
│   - Hooks            │      - middleware                │
└──────────────────────┴──────────────────────────────────┘
         ↓ REACT_APP_API_URL ↓
    Both services communicate via HTTP/REST
```

## Scaling & Performance

- **Backend**: Can be scaled to handle more requests
- **Frontend**: Static assets are cached by CDN
- **Database**: SQLite is suitable for small to medium loads; consider PostgreSQL for production scale

## Troubleshooting

### Issue: Database errors on deployment
- Ensure the `/app/data` directory exists
- Check backend logs for SQLite errors
- Verify `DB_PATH` environment variable is correctly set

### Issue: Frontend cannot reach backend
- Verify `REACT_APP_API_URL` is set correctly
- Check CORS settings and `ALLOWED_ORIGINS`
- Ensure backend service is running and healthy

### Issue: Build failures
- Check Dockerfile syntax
- Verify Node.js version compatibility
- Check Go version compatibility (1.25+)

## Security Notes

For production deployment:
1. Never commit `.env` files with secrets
2. Set `ALLOWED_ORIGINS` to specific domains, not `*`
3. Use HTTPS URLs for API communication
4. Enable authentication if needed
5. Keep dependencies updated

## Support & Resources

- [Choreo Documentation](https://wso2.com/choreo/docs/)
- [Gin Documentation](https://gin-gonic.com/docs/)
- [React Documentation](https://react.dev/)
- [Docker Documentation](https://docs.docker.com/)

---

For detailed deployment steps, see [CHOREO_DEPLOYMENT.md](./CHOREO_DEPLOYMENT.md)
