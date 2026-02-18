# Deployment Guide - Primetrade.ai Application

This guide covers deploying the Primetrade.ai application to various cloud platforms.

## Table of Contents
1. [MongoDB Atlas Setup](#mongodb-atlas-setup)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Environment Variables](#environment-variables)
5. [Post-Deployment](#post-deployment)

## MongoDB Atlas Setup

### 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (M0 Free tier is sufficient for development)

### 2. Configure Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Create a username and password (save these!)
4. Set privileges to "Read and write to any database"

### 3. Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Or add your deployment platform's IP addresses

### 4. Get Connection String
1. Go to "Database" and click "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with `primetrade`

Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/primetrade?retryWrites=true&w=majority`

## Backend Deployment

### Option 1: Render (Recommended - Free Tier)

1. **Create Account**
   - Go to [Render](https://render.com)
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the backend directory

3. **Configure Service**
   ```
   Name: primetrade-backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Add Environment Variables**
   ```
   PORT=5000
   MONGODB_URI=<your-mongodb-atlas-uri>
   JWT_SECRET=<generate-a-secure-random-string>
   JWT_EXPIRE=7d
   NODE_ENV=production
   FRONTEND_URL=<your-frontend-url>
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL (e.g., `https://primetrade-backend.onrender.com`)

### Option 2: Railway

1. **Create Account**
   - Go to [Railway](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect Node.js

3. **Add Environment Variables**
   - Go to Variables tab
   - Add the same variables as Render

4. **Configure**
   - Railway will automatically deploy
   - Note your backend URL

### Option 3: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login and Create App**
   ```bash
   heroku login
   cd backend
   heroku create primetrade-backend
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URI=<your-uri>
   heroku config:set JWT_SECRET=<your-secret>
   heroku config:set JWT_EXPIRE=7d
   heroku config:set NODE_ENV=production
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

3. **Configure**
   - Follow the prompts
   - Set build command: `npm run build`
   - Set output directory: `dist`

4. **Add Environment Variables**
   - Go to Vercel dashboard
   - Select your project → Settings → Environment Variables
   - Add: `VITE_API_URL=<your-backend-url>/api`

5. **Redeploy**
   ```bash
   vercel --prod
   ```

### Option 2: Netlify

1. **Create Account**
   - Go to [Netlify](https://netlify.com)
   - Sign up with GitHub

2. **Deploy**
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub
   - Select your repository
   - Set base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Environment Variables**
   - Go to Site settings → Environment variables
   - Add: `VITE_API_URL=<your-backend-url>/api`

4. **Deploy**
   - Click "Deploy site"

### Option 3: GitHub Pages (Static Only)

1. **Update vite.config.js**
   ```javascript
   export default {
     base: '/repository-name/',
     build: {
       outDir: 'dist'
     }
   }
   ```

2. **Install gh-pages**
   ```bash
   npm install -D gh-pages
   ```

3. **Add Deploy Script to package.json**
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     }
   }
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/primetrade
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
JWT_EXPIRE=7d
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.com
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.com/api
```

### Generating Secure JWT Secret

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# OpenSSL
openssl rand -hex 64

# Online
# Use: https://www.grc.com/passwords.htm
```

## Docker Deployment

### 1. Create Dockerfiles

**Backend Dockerfile**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

**Frontend Dockerfile**
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2. Create docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
      - JWT_EXPIRE=7d
      - NODE_ENV=production
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
```

### 3. Deploy with Docker

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## AWS Deployment

### Backend on EC2

1. **Launch EC2 Instance**
   - Ubuntu Server 22.04 LTS
   - t2.micro (free tier)
   - Configure security group (ports 22, 5000)

2. **Connect and Setup**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   
   # Clone repository
   git clone your-repo-url
   cd backend
   npm install
   
   # Create .env file
   nano .env
   # Add your environment variables
   
   # Start with PM2
   pm2 start server.js --name primetrade-backend
   pm2 startup
   pm2 save
   ```

3. **Setup Nginx Reverse Proxy**
   ```bash
   sudo apt-get install nginx
   sudo nano /etc/nginx/sites-available/primetrade
   ```
   
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   ```bash
   sudo ln -s /etc/nginx/sites-available/primetrade /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### Frontend on S3 + CloudFront

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Create S3 Bucket**
   - Go to AWS S3
   - Create bucket (e.g., primetrade-frontend)
   - Enable static website hosting

3. **Upload Files**
   ```bash
   aws s3 sync dist/ s3://primetrade-frontend
   ```

4. **Create CloudFront Distribution**
   - Origin: Your S3 bucket
   - Default root object: index.html
   - Error pages: 404 → /index.html (for SPA routing)

## Post-Deployment Checklist

### Security
- [ ] Change all default passwords
- [ ] Use strong JWT secret (64+ characters)
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable MongoDB authentication
- [ ] Use environment variables (never commit secrets)

### Performance
- [ ] Enable gzip compression
- [ ] Set up CDN for static assets
- [ ] Configure caching headers
- [ ] Monitor response times
- [ ] Set up database indexes

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure logging
- [ ] Set up uptime monitoring
- [ ] Monitor database performance
- [ ] Set up alerts

### Testing
- [ ] Test all API endpoints
- [ ] Test authentication flow
- [ ] Test CRUD operations
- [ ] Test on different devices
- [ ] Test error scenarios

### Documentation
- [ ] Update README with live URLs
- [ ] Document environment variables
- [ ] Create API documentation
- [ ] Document deployment process

## SSL/HTTPS Setup

### Using Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

## Monitoring & Logging

### PM2 Monitoring
```bash
pm2 monit
pm2 logs
pm2 status
```

### Application Logs
```javascript
// Add to server.js
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## Troubleshooting

### Backend Issues
- Check logs: `pm2 logs`
- Check environment variables
- Verify MongoDB connection
- Check firewall rules

### Frontend Issues
- Clear browser cache
- Check API URL in .env
- Verify CORS settings
- Check network tab in DevTools

### Database Issues
- Verify MongoDB Atlas IP whitelist
- Check connection string
- Verify database user permissions

## Cost Estimation

### Free Tier Options
- **MongoDB Atlas**: Free M0 cluster (512MB)
- **Render**: Free tier (750 hours/month)
- **Vercel**: Free tier (unlimited)
- **Netlify**: Free tier (100GB bandwidth)

### Paid Options (Monthly)
- **MongoDB Atlas M10**: $57/month
- **Render Standard**: $7/month
- **AWS EC2 t2.micro**: $8.50/month
- **Vercel Pro**: $20/month

## Support

For deployment issues:
1. Check platform documentation
2. Review error logs
3. Verify environment variables
4. Test locally first
5. Check platform status pages

## Conclusion

This application is designed to be easily deployed to any modern cloud platform. Choose the option that best fits your needs:

- **Easiest**: Render + Vercel
- **Most Control**: AWS EC2 + S3
- **Best Performance**: AWS with CloudFront
- **Most Affordable**: Free tiers on Render/Vercel

Happy deploying! 🚀
