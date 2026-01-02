# Deployment Guide

Comprehensive instructions for deploying the School Management System to production.

---

## Prerequisites

### System Requirements

- Node.js v18 or higher
- npm or yarn package manager
- Git for version control
- Access to deployment platform

### Environment Variables

Create `.env.production`:

```env
# Application
VITE_APP_NAME=School Management System
VITE_APP_URL=https://app.yourdomain.com
VITE_API_URL=https://api.yourdomain.com/api/v1

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key

# Analytics (Optional)
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_TRACKING=true
```

---

## Build Process

### Local Build

```bash
# Install dependencies
npm install

# Type checking
npm run check

# Linting
npm run lint

# Production build
npm run build

# Preview build
npm run preview
```

### Build Output

The build generates:
- `dist/` - Optimized static assets
- Minified JS and CSS
- Source maps for debugging
- Service worker (if configured)

---

## Deployment Options

### Option 1: Vercel (Recommended)

#### Automatic Deployment

1. Connect GitHub repository to Vercel
2. Configure build settings:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add environment variables in Vercel dashboard
4. Deploy on push to main branch

#### Manual Deployment

```bash
npm i -g vercel
vercel --prod
```

#### vercel.json Configuration

```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/index.html" }
  ],
  "env": {
    "VITE_SUPABASE_URL": "@supabase_url",
    "VITE_SUPABASE_ANON_KEY": "@supabase_anon_key"
  }
}
```

---

### Option 2: Netlify

#### Automatic Deployment

1. Connect repository to Netlify
2. Configure:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
3. Add environment variables
4. Enable automatic deployments

#### netlify.toml Configuration

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

---

### Option 3: AWS S3 + CloudFront

#### S3 Setup

1. Create S3 bucket with static website hosting
2. Configure bucket policy for public access
3. Set index document: `index.html`
4. Set error document: `index.html`

#### CloudFront Setup

1. Create distribution with S3 origin
2. Configure custom error pages (404 → /index.html)
3. Set up SSL certificate
4. Configure caching behaviors

#### Deployment Script

```bash
#!/bin/bash
npm run build

aws s3 sync dist/ s3://your-bucket-name --delete

aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"

echo "Deployment completed!"
```

---

### Option 4: Docker

#### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf

```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        root /usr/share/nginx/html;
        index index.html;

        # Gzip
        gzip on;
        gzip_types text/plain text/css application/javascript application/json;

        # SPA routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
    }
}
```

#### Docker Commands

```bash
# Build image
docker build -t school-management .

# Run container
docker run -d -p 80:80 school-management
```

---

## Performance Optimization

### Vite Build Configuration

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['lucide-react', 'sonner'],
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

- Compress images (WebP format)
- Implement lazy loading
- Use CDN for static assets
- Enable gzip/brotli compression

---

## Security Configuration

### Content Security Policy

```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self' https://www.googletagmanager.com;
               style-src 'self' 'unsafe-inline';
               img-src 'self' data: https:;
               connect-src 'self' https://api.yourdomain.com https://*.supabase.co;">
```

### Security Headers

Ensure these headers are set:
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

### Environment Security

- Never commit `.env` files
- Use platform secret management
- Rotate API keys regularly
- Use different keys per environment

---

## Post-Deployment Checklist

### Functionality

- [ ] All routes load correctly
- [ ] Authentication works
- [ ] API calls succeed
- [ ] Forms submit successfully
- [ ] File uploads work

### Performance

- [ ] Page load < 3 seconds
- [ ] Assets cached properly
- [ ] Bundle size optimized
- [ ] Lighthouse score > 90

### Security

- [ ] HTTPS enforced
- [ ] Security headers present
- [ ] No sensitive data in console
- [ ] Input validation works

### Monitoring

- [ ] Error tracking active
- [ ] Analytics collecting
- [ ] Performance monitoring enabled
- [ ] Uptime monitoring configured

---

## Rollback Strategy

### Quick Rollback

```bash
# Vercel
vercel --prod --rollback

# AWS
aws s3 sync s3://backup-bucket/ s3://production-bucket --delete
```

### Database Rollback

- Maintain regular backups
- Use migration rollback procedures
- Test rollback process regularly

---

## Troubleshooting

### Build Failures

1. Check Node.js version (v18+)
2. Verify all dependencies installed
3. Run `npm run check` for TypeScript errors

### Environment Issues

1. Verify all required variables set
2. Check for typos in variable names
3. Confirm correct production values

### Routing Issues

1. Configure SPA routing (/* → index.html)
2. Check for missing redirects
3. Verify base path configuration

### Performance Issues

1. Optimize bundle size
2. Implement code splitting
3. Use proper caching strategies

---

## See Also

- [Environment Setup](../01-setup/environment.md) - Environment configuration
- [Frontend Architecture](../02-architecture/frontend.md) - Technical overview
- [Quickstart](../01-setup/quickstart.md) - Development setup
