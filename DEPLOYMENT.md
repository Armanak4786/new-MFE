# Deployment Guide

This guide explains how to deploy the Micro-Frontend (MFE) application.

## Architecture

The application consists of:
- **Shell (Authentication)**: Main application that loads remote modules
- **Remotes**: Dealer, Commercial, and Admin applications

## Deployment Options

### Option 1: Single Server Deployment (Recommended for Start)

All applications are served from a single Express server on different paths:
- Shell: `http://yourdomain.com/`
- Dealer: `http://yourdomain.com/dealer/`
- Commercial: `http://yourdomain.com/commercial/`
- Admin: `http://yourdomain.com/admin/`

### Option 2: Multi-Server Deployment

Each application runs on its own server:
- Shell: `http://shell.yourdomain.com`
- Dealer: `http://dealer.yourdomain.com`
- Commercial: `http://commercial.yourdomain.com`
- Admin: `http://admin.yourdomain.com`

## Quick Start (Single Server)

### 1. Build All Projects

```bash
npm run build:prod
```

This builds all projects in production mode.

### 2. Start the Server

```bash
npm run serve:prod
```

Or combine both:

```bash
npm run deploy
```

The server will start on port 3000 (or the port specified in the `PORT` environment variable).

### 3. Access the Application

- Shell (Authentication): http://localhost:3000/
- Dealer: http://localhost:3000/dealer/
- Commercial: http://localhost:3000/commercial/
- Admin: http://localhost:3000/admin/

## Production Deployment

### Environment Variables

You can set the following environment variables:

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Set to `production` for production builds

### Build and Deploy

```bash
# Build all projects
npm run build:prod

# Start production server
PORT=3000 npm run serve:prod
```

### Using PM2 (Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Start the server with PM2
pm2 start server.js --name mfe-app

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
```

### Using Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy built applications
COPY dist ./dist
COPY server.js ./

EXPOSE 3000

CMD ["node", "server.js"]
```

Build and run:

```bash
docker build -t mfe-app .
docker run -p 3000:3000 mfe-app
```

### Using Nginx (Reverse Proxy)

If you want to use Nginx as a reverse proxy:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /dealer {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    location /commercial {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    location /admin {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

## Multi-Server Deployment

If deploying to separate servers:

1. Update `src/environments/environment.prod.ts` with your remote URLs:

```typescript
export const environment = {
  production: true,
  remotes: {
    dealer: 'https://dealer.yourdomain.com',
    commercial: 'https://commercial.yourdomain.com',
    admin: 'https://admin.yourdomain.com',
  }
};
```

2. Update `module-federation.config.js` to use the correct remote URLs at build time.

3. Ensure CORS is properly configured on all remote servers.

## Troubleshooting

### Module Federation Not Loading

- Ensure all remote applications are built and accessible
- Check browser console for CORS errors
- Verify `remoteEntry.js` files are accessible at the configured URLs

### Assets Not Loading

- Ensure `auro-ui-assets` are included in all builds
- Check that asset paths are correct in `angular.json`

### Routing Issues

- Ensure the Express server serves `index.html` for all routes
- Check that base href is correctly configured

## Development vs Production

### Development
- Uses `http://localhost:4201`, `4202`, `4203` for remotes
- Hot reload enabled
- Source maps included

### Production
- Uses same-origin paths or configured remote URLs
- Optimized builds
- No source maps (unless configured)
