# Attendance Tracking Web Application

A comprehensive web application for monitoring attendance at events and activities. Built with a modern SPA architecture using React frontend and Node.js REST API backend.

**Team**: CoffeBreak  
**Members**: Apostol Adina-Denisa, Birdac Ana-Maria

## ❀ Overview

This application enables event organizers to:
- Create and manage event groups and individual events
- Generate unique access codes (text + QR) for each event
- Monitor real-time attendance with timestamps
- Export attendance records in CSV/XLSX formats

Participants can:
- Confirm attendance by entering a code or scanning a QR code
- Register themselves and track their attendance history

## ❀ Technology Stack

**Backend**:
- Node.js + Express.js
- Sequelize ORM
- MariaDB/MySQL database
- Node-cron for scheduling

**Frontend**:
- React.js (single-page application)
- React Router for navigation
- Axios for API calls
- HTML5 for QR code scanning

**Deployment**:
- Azure App Service, AWS, or Render (free tier)
- GitHub for version control

## ❀ Project Structure

```
attendance-tracking-web-app/
├── backend/                    # REST API
│   ├── controllers/           # Business logic
│   ├── models/                # Database models
│   ├── routes/                # API routes
│   ├── utils/                 # Helper functions
│   ├── jobs/                  # Scheduled tasks
│   ├── index.js               # Server entry point
│   ├── dbConfig.js            # Database configuration
│   ├── package.json
│   ├── .env.example           # Environment template
│   └── README_COMPLETE.md     # Backend setup guide
│
├── frontend/                  # React SPA
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API service layer
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── README.md
│
├── docs/                      # Documentation
│   ├── project-plan.md
│   ├── specifications.md
│   └── api-schema.md
│
└── README.md                  # This file
```

## ❀ Quick Start

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your database credentials
nano .env

# Create the database (MariaDB)
CREATE DATABASE attendance_tracking_db CHARACTER SET utf8mb4;

# Start development server
npm run dev
```

**Expected output**:
```
DB connected
DB synced
Server running on port 4000
```

### Frontend Setup (Coming Soon)

```bash
cd frontend

# Install dependencies
npm install

# Create .env file for API base URL
echo "REACT_APP_API_URL=http://localhost:4000/api" > .env

# Start development server
npm start
```

Frontend will open at http://localhost:3000

## ❀ API Documentation

Comprehensive API endpoints at `/backend/README_COMPLETE.md`

**Main Endpoints**:
- `POST /api/event-groups` - Create event group
- `POST /api/events` - Create event
- `POST /api/attendance` - Confirm attendance
- `GET /api/attendance/event/:id/export/csv` - Export as CSV
- `GET /api/attendance/event/:id/export/xlsx` - Export as XLSX

## ❀ Deployment Guide

### Prerequisites for Deployment

1. GitHub account with repository push access
2. Cloud service account (choose one):
   - [Azure](https://azure.microsoft.com/free)
   - [AWS](https://aws.amazon.com/free)
   - [Render](https://render.com)

### Option 1: Deploy to Azure App Service

#### Step 1: Set Up Azure Resources

1. Go to [Azure Portal](https://portal.azure.com)
2. Create a **Resource Group** (e.g., "attendance-app-rg")
3. Create a **MariaDB Database**:
   - Name: `attendance-tracking-db`
   - Server admin login: `dbadmin`
   - Password: (secure password)
   - Pricing tier: Basic (free tier)
4. Create an **App Service**:
   - Runtime: Node.js 18 LTS
   - OS: Linux
   - Pricing: Free tier (F1)

#### Step 2: Configure Environment Variables

1. In Azure Portal, go to App Service → Configuration → Application settings
2. Add the following environment variables:

```env
DB_HOST=your-mariadb-server.mariadb.database.azure.com
DB_PORT=3306
DB_USER=dbadmin@your-server-name
DB_PASS=your_secure_password
DB_NAME=attendance_tracking_db
PORT=8080
NODE_ENV=production
QR_API=https://api.qrserver.com/v1/create-qr-code/?data=
```

#### Step 3: Deploy Backend

1. Initialize Git in your project:
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Connect Azure App Service to your GitHub repository:
   - In App Service → Deployment center
   - Select GitHub as source
   - Authorize and select your repository
   - Select branch (main)

3. Azure will automatically deploy on push to main

#### Step 4: Deploy Frontend

1. Create a separate App Service for React frontend (or use static hosting)
2. Build the React app:
```bash
cd frontend
npm run build
```

3. Deploy to Azure Static Web Apps or another App Service
4. Update API URL in frontend `.env`:
```env
REACT_APP_API_URL=https://your-backend-app.azurewebsites.net/api
```

### Option 2: Deploy to AWS (EC2 + RDS)

#### Step 1: Create RDS MariaDB Instance

1. Go to [AWS RDS Console](https://console.aws.amazon.com/rds)
2. Create database:
   - Engine: MariaDB
   - Template: Free tier
   - DB instance identifier: `attendance-db`
   - Master username: `admin`
   - Password: (secure password)
3. Note the **Endpoint** (e.g., `attendance-db.xxxxx.rds.amazonaws.com`)

#### Step 2: Create EC2 Instance

1. Go to [AWS EC2 Console](https://console.aws.amazon.com/ec2)
2. Launch instance:
   - AMI: Ubuntu 22.04 LTS (free tier eligible)
   - Instance type: t2.micro (free tier)
   - Security group: Allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS)
3. Connect via SSH:
```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

#### Step 3: Install Node.js and Deploy Backend

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Git
sudo apt install -y git

# Clone your repository
git clone https://github.com/yourusername/attendance-tracking-web-app.git
cd attendance-tracking-web-app/backend

# Install dependencies
npm install

# Create .env with RDS credentials
cat > .env << EOF
DB_HOST=your-rds-endpoint.rds.amazonaws.com
DB_PORT=3306
DB_USER=admin
DB_PASS=your_secure_password
DB_NAME=attendance_tracking_db
PORT=4000
NODE_ENV=production
EOF

# Create database
mysql -h your-rds-endpoint.rds.amazonaws.com -u admin -p -e "CREATE DATABASE attendance_tracking_db CHARACTER SET utf8mb4;"

# Install PM2 for process management
sudo npm install -g pm2

# Start backend with PM2
pm2 start index.js --name "attendance-api"
pm2 startup
pm2 save
```

#### Step 4: Set Up Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/default
```

Add this configuration:

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Test and enable Nginx
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 5: Deploy Frontend

Deploy the React build to the same EC2 or use S3 + CloudFront for static hosting.

### Option 3: Deploy to Render (Easiest)

Render.com offers a free tier perfect for students.

#### Step 1: Deploy Backend

1. Go to [Render.com](https://render.com) and sign up with GitHub
2. Create a new Web Service:
   - Select your GitHub repository
   - Runtime: Node
   - Build command: `npm install`
   - Start command: `npm start`
3. Add Environment Variables:
   - `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, `PORT`, `NODE_ENV`
4. Create a PostgreSQL database in Render (free tier)
5. Deploy

#### Step 2: Deploy Frontend

1. Create a new Static Site:
   - Select your repository
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/build`
2. Add environment variable:
   - `REACT_APP_API_URL=https://your-backend.onrender.com/api`
3. Deploy

### Database Backup & Maintenance

#### Backup MariaDB Data

**Azure**:
```bash
# Azure handles automatic backups
# Download backup through Azure Portal
```

**AWS**:
```bash
# Create manual snapshot in RDS console
# Export to S3 if needed
```

**Local Development**:
```bash
mysqldump -h localhost -u root -p attendance_tracking_db > backup.sql
```

#### Restore Database

```bash
mysql -h your-host -u username -p database_name < backup.sql
```

## ❀ Production Checklist

Before deploying to production:

- [ ] All environment variables configured
- [ ] Database credentials secured (use strong passwords)
- [ ] HTTPS/SSL certificates installed
- [ ] CORS configured for frontend domain
- [ ] Database backups enabled
- [ ] Error logging configured
- [ ] Database indexed for performance
- [ ] Rate limiting configured
- [ ] Input validation on all endpoints
- [ ] Security headers configured

## ❀ Monitoring & Troubleshooting

### Check Server Logs

**Azure**:
```
App Service → Diagnose and solve problems → Application Logs
```

**AWS EC2**:
```bash
# View PM2 logs
pm2 logs attendance-api

# View system logs
sudo tail -f /var/log/nginx/access.log
```

**Render**:
```
Service → Logs
```

### Common Issues

**Database Connection Failed**
- Verify credentials in `.env`
- Check firewall/security group rules
- Ensure database is running

**504 Gateway Timeout**
- Check backend server is running
- Increase Node.js heap size: `NODE_OPTIONS="--max-old-space-size=512"`

**CORS Errors**
- Verify frontend URL in CORS configuration
- Update `origin` in Express CORS middleware

## ❀ Git Workflow

```bash
# Clone repo
git clone https://github.com/anabirdac/attendance-tracking-web-app.git

# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "Add: description of changes"

# Push to GitHub
git push origin feature/your-feature

# Create Pull Request on GitHub
```

## ❀ Documentation Links

- [Backend Setup Guide](backend/README_COMPLETE.md)
- [API Specifications](docs/specifications.md)
- [Project Plan](docs/project-plan.md)

## ❀ License

ISC

## ❀ Support

For issues or questions:
1. Check existing GitHub issues
2. Review documentation in `docs/` folder
3. Create a new GitHub issue with detailed description

---

**Last Updated**: January 17, 2026  
**Status**: Backend Complete - Frontend In Development
