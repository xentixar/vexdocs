---
title: "Deployment Guide - Vexdocs v1.0"
description: "Complete deployment guide for Vexdocs v1.0. Learn how to build and deploy your documentation to various hosting platforms."
keywords: "vexdocs deployment, static site hosting, github pages, netlify, vercel, documentation deployment"
---

# 🚀 Deployment Guide - Vexdocs v1.0

This comprehensive guide covers building and deploying your Vexdocs site to various hosting platforms, from simple static hosts to advanced CI/CD setups.

## 📋 Pre-Deployment Checklist

Before deploying your documentation, ensure everything is ready:

### ✅ Content Review
- [ ] All pages have proper titles and descriptions
- [ ] Links work correctly (internal and external)
- [ ] Images are optimized and loading properly
- [ ] Navigation structure makes sense
- [ ] Spelling and grammar checked

### ✅ Configuration Validation
- [ ] `config.json` is valid JSON
- [ ] Theme colors work well together
- [ ] SEO settings are configured
- [ ] All referenced assets exist

### ✅ Technical Checks
- [ ] Build completes without errors
- [ ] Site works on mobile devices
- [ ] Search functionality works
- [ ] All versions (if multiple) are accessible

## 🏗️ Building Your Site

### Local Build Process

```bash
# Clean any previous builds
npm run clean

# Build optimized static site
npm run build

# Verify build completed
ls dist/
```

### Build Output Structure

```
dist/
├── index.html              # Main page
├── assets/                 # Optimized assets
│   ├── css/
│   │   └── main.css       # Minified styles
│   └── js/
│       ├── app.js         # Minified JavaScript
│       └── markdown-parser.js
├── api/                    # API endpoints as JSON
│   ├── config.json
│   └── navigation.json
└── v1.0/                   # Version-specific content
    ├── index.html
    ├── getting-started.html
    └── ...
```

### Build Optimizations

The build process automatically:
- **Minifies HTML, CSS, and JavaScript** for faster loading
- **Optimizes images** and compresses assets
- **Generates SEO-friendly meta tags** for each page
- **Creates search indices** for navigation
- **Adds proper cache headers** for static files

## 🌐 Hosting Platforms

### GitHub Pages (Free)

Perfect for open-source projects and personal documentation.

#### Method 1: Manual Deployment

```bash
# Build your site
npm run build

# Navigate to build output
cd dist

# Initialize git repository
git init
git add .
git commit -m "Deploy documentation"

# Add your repository as remote
git remote add origin https://github.com/username/repository.git

# Push to gh-pages branch
git push origin main:gh-pages
```

#### Method 2: GitHub Actions (Automated)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Documentation

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '16'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build documentation
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

#### GitHub Pages Configuration

1. **Repository Settings** → **Pages**
2. **Source**: Deploy from a branch
3. **Branch**: `gh-pages` / `(root)`
4. **Custom domain** (optional): `docs.yoursite.com`

**Pros:**
- ✅ Free hosting
- ✅ Easy integration with GitHub repos
- ✅ Automatic SSL certificates
- ✅ Good for open-source projects

**Cons:**
- ❌ Limited to public repos (on free plan)
- ❌ No server-side processing
- ❌ 1GB bandwidth/month limit

### Netlify (Free Tier Available)

Excellent for professional documentation sites with advanced features.

#### Method 1: Git Integration

1. **Connect Repository**: Link your GitHub/GitLab repo
2. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Deploy**: Automatic on every push

#### Method 2: Manual Deploy

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build your site
npm run build

# Deploy
netlify deploy

# Production deployment
netlify deploy --prod --dir=dist
```

#### Netlify Configuration

Create `netlify.toml` in your project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "16"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000"
```

**Pros:**
- ✅ Excellent free tier
- ✅ Form handling and serverless functions
- ✅ Branch previews
- ✅ Custom domains with SSL
- ✅ CDN and performance optimization

**Cons:**
- ❌ Bandwidth limits on free tier
- ❌ Build minute limits

### Vercel (Free Tier Available)

Ideal for modern static sites with excellent performance.

#### Method 1: Git Integration

1. **Import Project**: Connect your repository
2. **Framework Preset**: Static Site
3. **Build Settings**:
   - Build command: `npm run build`
   - Output directory: `dist`

#### Method 2: CLI Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Build your site
npm run build

# Deploy
vercel --prod
```

#### Vercel Configuration

Create `vercel.json`:

```json
{
  "version": 2,
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
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

**Pros:**
- ✅ Excellent performance and CDN
- ✅ Automatic deployments
- ✅ Preview deployments
- ✅ Analytics and monitoring

**Cons:**
- ❌ Function execution limits on free tier
- ❌ Bandwidth limits

### AWS S3 + CloudFront

Professional hosting solution for enterprise documentation.

#### Setup Process

```bash
# Install AWS CLI
pip install awscli

# Configure AWS credentials
aws configure

# Create S3 bucket
aws s3 mb s3://your-docs-bucket

# Build your site
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-docs-bucket --delete

# Create CloudFront distribution (via AWS Console)
```

#### S3 Bucket Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-docs-bucket/*"
    }
  ]
}
```

**Pros:**
- ✅ Highly scalable
- ✅ Excellent global performance
- ✅ Advanced caching controls
- ✅ Integration with other AWS services

**Cons:**
- ❌ More complex setup
- ❌ Costs scale with usage
- ❌ Requires AWS knowledge

### Firebase Hosting

Google's hosting solution with excellent performance.

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize project
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

### Traditional Web Hosting

For shared hosting or VPS deployments:

```bash
# Build your site
npm run build

# Upload dist/ contents via FTP/SFTP
# Or use rsync for VPS
rsync -avz dist/ user@server:/var/www/html/
```

## 🔧 Advanced Deployment

### Custom Domain Setup

#### DNS Configuration

```
# A Record (for root domain)
Type: A
Name: @
Value: [hosting provider IP]

# CNAME Record (for subdomain)
Type: CNAME  
Name: docs
Value: [hosting provider domain]
```

#### SSL Certificate

Most modern hosting providers offer automatic SSL:
- **GitHub Pages**: Automatic with custom domains
- **Netlify**: Automatic Let's Encrypt certificates
- **Vercel**: Automatic SSL for all deployments
- **CloudFront**: AWS Certificate Manager integration

### Environment-Specific Builds

#### Multiple Environments

```bash
# Development build
NODE_ENV=development npm run build

# Staging build  
NODE_ENV=staging npm run build

# Production build
NODE_ENV=production npm run build
```

#### Environment-Specific Configuration

```json
{
  "title": "MyProject Docs",
  "description": "Production documentation",
  "theme": {
    "primaryColor": "#2563eb"
  }
}
```

```json
{
  "title": "MyProject Docs (Staging)",
  "description": "Staging documentation", 
  "theme": {
    "primaryColor": "#f59e0b"
  }
}
```

### CI/CD Pipeline Examples

#### GitLab CI/CD

Create `.gitlab-ci.yml`:

```yaml
stages:
  - build
  - deploy

build:
  stage: build
  image: node:16
  script:
    - npm install
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour

deploy:
  stage: deploy
  image: alpine:latest
  script:
    - apk add --no-cache rsync openssh
    - rsync -avz dist/ $DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH
  only:
    - main
```

#### Jenkins Pipeline

```groovy
pipeline {
    agent any
    
    stages {
        stage('Install') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Deploy') {
            steps {
                sh 'aws s3 sync dist/ s3://your-docs-bucket --delete'
                sh 'aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"'
            }
        }
    }
}
```

## 📊 Performance Optimization

### Build Optimization

```bash
# Clean build for production
npm run clean && npm run build

# Verify file sizes
du -sh dist/*

# Check for large files
find dist/ -size +1M -type f
```

### Asset Optimization

**Images:**
```bash
# Install image optimization tools
npm install -g imagemin-cli

# Optimize images
imagemin docs/assets/*.{jpg,png} --out-dir=docs/assets/optimized/
```

**Gzip Compression:**
```bash
# Pre-compress files for hosting
gzip -k dist/**/*.{html,css,js,json}
```

### CDN Configuration

**Cache Headers:**
```
# HTML files (short cache)
Cache-Control: public, max-age=300

# CSS/JS files (long cache with versioning)
Cache-Control: public, max-age=31536000

# Images (medium cache)
Cache-Control: public, max-age=2592000
```

## 🔍 Monitoring and Analytics

### Google Analytics Setup

Add to your site (if using custom template):

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Performance Monitoring

**Core Web Vitals:**
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms  
- **CLS (Cumulative Layout Shift)**: < 0.1

**Tools for Monitoring:**
- Google PageSpeed Insights
- WebPageTest
- Lighthouse (built into Chrome DevTools)

### Uptime Monitoring

**Free Services:**
- UptimeRobot
- StatusCake
- Pingdom (free tier)

## 🔧 Troubleshooting Deployment

### Common Issues

#### Build Failures

```bash
# Check Node.js version
node --version

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try building locally
npm run build
```

#### Missing Files After Deployment

```bash
# Check .gitignore doesn't exclude required files
cat .gitignore

# Verify all assets exist
find docs/assets -name "*.png" -o -name "*.jpg" -o -name "*.svg"

# Check case sensitivity (Linux servers)
# Make sure file references match exact case
```

#### SSL Certificate Issues

```bash
# Check certificate status
curl -I https://your-docs-site.com

# Verify DNS propagation
nslookup your-docs-site.com

# Check hosting provider SSL settings
```

#### Performance Issues

```bash
# Check file sizes
ls -lah dist/

# Verify compression is enabled
curl -H "Accept-Encoding: gzip" -I https://your-docs-site.com

# Test from different locations
# Use tools like WebPageTest or GTmetrix
```

### Debug Deployment

#### Local Testing

```bash
# Serve built files locally
npm run serve

# Test on different devices
# Use browser dev tools device simulation

# Check console for errors
# Verify all links work
```

#### Remote Testing

```bash
# Test with curl
curl -I https://your-docs-site.com

# Check specific pages
curl https://your-docs-site.com/getting-started/

# Verify redirects work
curl -L https://your-docs-site.com/old-page
```

## 📋 Deployment Checklist

### Pre-Launch
- [ ] Content review complete
- [ ] All links tested
- [ ] Mobile responsiveness verified
- [ ] SEO metadata configured
- [ ] Build process working locally
- [ ] Hosting platform configured
- [ ] Custom domain setup (if applicable)
- [ ] SSL certificate active

### Post-Launch
- [ ] Site accessible at all URLs
- [ ] Search functionality working
- [ ] Navigation working properly
- [ ] Performance metrics acceptable
- [ ] Analytics tracking active (if configured)
- [ ] Monitoring setup
- [ ] Backup strategy in place

### Ongoing Maintenance
- [ ] Regular content updates
- [ ] Link checking (monthly)
- [ ] Performance monitoring
- [ ] Dependency updates
- [ ] Security updates
- [ ] Backup verification

---

*Your Vexdocs site is now ready for the world! Remember to keep your content fresh and monitor performance regularly. Check out our [Configuration Guide](../configuration.md) for ongoing customization options.*
