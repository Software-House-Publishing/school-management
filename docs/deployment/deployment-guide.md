# Deployment Guide

## Overview

This document provides comprehensive instructions for deploying the School Management System frontend to production environments.

## Prerequisites

### System Requirements
- Node.js v18 or higher
- npm or yarn package manager
- Git for version control
- Access to deployment platform (Vercel, Netlify, AWS, etc.)

### Environment Variables
Create a `.env.production` file with the following variables:

```env
# Application Configuration
VITE_APP_NAME=School Management System
VITE_API_URL=https://api.yourdomain.com/api/v1
VITE_APP_URL=https://app.yourdomain.com

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Analytics (Optional)
VITE_GA_TRACKING_ID=your-google-analytics-id
VITE_SENTRY_DSN=your-sentry-dsn

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_TRACKING=true
```

## Build Process

### Local Build
```bash
# Install dependencies
npm install

# Run type checking
npm run check

# Run linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

### Build Output
The build process generates:
- `dist/` directory with optimized assets
- Minified JavaScript and CSS files
- Source maps for debugging
- Service worker for PWA functionality

## Deployment Options

### Option 1: Vercel (Recommended)

#### Automatic Deployment
1. Connect GitHub repository to Vercel
2. Configure build settings:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

#### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Follow prompts to configure project
```

#### Vercel Configuration (`vercel.json`)
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_SUPABASE_URL": "@supabase_url",
    "VITE_SUPABASE_ANON_KEY": "@supabase_anon_key"
  }
}
```

### Option 2: Netlify

#### Automatic Deployment
1. Connect repository to Netlify
2. Configure build settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
3. Add environment variables in Netlify dashboard
4. Enable automatic deployments

#### Manual Deployment
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

#### Netlify Configuration (`netlify.toml`)
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[context.production.environment]
  VITE_API_URL = "https://api.yourdomain.com/api/v1"
```

### Option 3: AWS S3 + CloudFront

#### S3 Bucket Setup
1. Create S3 bucket with static website hosting
2. Configure bucket policy for public access
3. Enable static website hosting
4. Set index and error documents

#### CloudFront Distribution
1. Create CloudFront distribution
2. Set S3 bucket as origin
3. Configure custom error pages
4. Set up SSL certificate

#### Deployment Script
```bash
#!/bin/bash
# deploy.sh

# Build the project
npm run build

# Sync files to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"

echo "Deployment completed!"
```

### Option 4: Docker Deployment

#### Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Nginx Configuration
```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Enable gzip compression
        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    }
}
```

#### Docker Deployment
```bash
# Build Docker image
docker build -t school-management-frontend .

# Run container
docker run -d -p 80:80 --name school-management school-management-frontend

# Or use docker-compose
docker-compose up -d
```

## Performance Optimization

### Build Optimization
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['lucide-react', 'sonner'],
          utils: ['date-fns', 'clsx', 'tailwind-merge'],
        },
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
```

### Asset Optimization
- Compress images using tools like ImageOptim or TinyPNG
- Use WebP format for better compression
- Implement lazy loading for images
- Use CDN for static assets

### Monitoring and Analytics
```typescript
// src/utils/analytics.ts
export function initializeAnalytics() {
  if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
    // Initialize Google Analytics
    gtag('config', import.meta.env.VITE_GA_TRACKING_ID);
  }

  if (import.meta.env.VITE_ENABLE_ERROR_TRACKING === 'true') {
    // Initialize Sentry
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.MODE,
      tracesSampleRate: 1.0,
    });
  }
}
```

## Security Configuration

### Content Security Policy
```html
<!-- Add to index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
               style-src 'self' 'unsafe-inline';
               img-src 'self' data: https:;
               font-src 'self';
               connect-src 'self' https://api.yourdomain.com https://*.supabase.co;">
```

### Environment Variables Security
- Never commit `.env` files to version control
- Use platform-specific environment variable management
- Rotate API keys regularly
- Use different keys for different environments

## Post-Deployment Checklist

### Functionality Testing
- [ ] All routes load correctly
- [ ] Authentication works properly
- [ ] API calls succeed
- [ ] Forms submit successfully
- [ ] File uploads work
- [ ] Real-time features function

### Performance Testing
- [ ] Page load times are acceptable (< 3 seconds)
- [ ] Assets are properly cached
- [ ] Bundle size is optimized
- [ ] Lighthouse score is good (> 90)

### Security Testing
- [ ] HTTPS is enforced
- [ ] Security headers are present
- [ ] No sensitive data in console
- [ ] Input validation works

### Monitoring Setup
- [ ] Error tracking is active
- [ ] Analytics are collecting data
- [ ] Performance monitoring is enabled
- [ ] Uptime monitoring is configured

## Rollback Strategy

### Quick Rollback
```bash
# For Vercel
vercel --prod --rollback

# For Netlify
# Use Netlify dashboard to rollback

# For AWS
# Use previous S3 bucket version
aws s3 sync s3://your-bucket-name-previous/ s3://your-bucket-name --delete
```

### Database Rollback
- Maintain database backups
- Use migration rollback procedures
- Test rollback process regularly

## Troubleshooting

### Common Deployment Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Environment Variable Issues**
   - Verify all required variables are set
   - Check for typos in variable names
   - Ensure correct values for production

3. **Routing Issues**
   - Configure SPA routing correctly
   - Check for missing redirects
   - Verify base path configuration

4. **Performance Issues**
   - Optimize bundle size
   - Implement code splitting
   - Use proper caching strategies

### Getting Help
- Check deployment platform documentation
- Review build logs for errors
- Consult team members
- Create detailed issue reports with logs