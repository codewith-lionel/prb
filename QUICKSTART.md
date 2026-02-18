# 🚀 Quick Start Guide - iBLAZE Platform

Get the iBLAZE platform running in 5 minutes!

## 📋 Prerequisites

- Node.js v14+ installed
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

## ⚡ Quick Setup

### 1️⃣ Install All Dependencies (One Command)

```bash
npm run install-all
```

This installs dependencies for server, client, and admin.

### 2️⃣ Configure Environment

The server `.env` file is already configured. Update MongoDB connection if needed:

```bash
cd server
nano .env  # or use your preferred editor
```

### 3️⃣ Start All Applications

Open 3 terminal windows:

**Terminal 1 - Backend:**
```bash
npm run server
# Server starts on http://localhost:5000
```

**Terminal 2 - Client:**
```bash
npm run client
# Client starts on http://localhost:3000
```

**Terminal 3 - Admin:**
```bash
npm run admin
# Admin starts on http://localhost:3001
```

## 🎯 First Steps

### Create Admin Account

1. Open http://localhost:3000
2. Click "Register"
3. Fill in details with role: "admin"
4. Login to http://localhost:3001 with admin credentials

### Create Test Accounts

**Student Account:**
- Role: student
- Auto-approved ✅

**Investor Account:**
- Role: investor
- Needs admin approval ⏳

**Employer Account:**
- Role: employer
- Needs admin verification ⏳

## 📱 Access URLs

- **API:** http://localhost:5000
- **Client App:** http://localhost:3000
- **Admin Panel:** http://localhost:3001

## 🧪 Test the Platform

### As Student:
1. Login to client
2. Create an idea
3. Browse jobs
4. Apply to a job

### As Admin:
1. Login to admin panel
2. Approve investors
3. Verify employers
4. Moderate ideas
5. Moderate jobs

### As Investor:
1. Login to client
2. Browse ideas
3. Request access to idea
4. Wait for approval

### As Employer:
1. Login to client
2. Create a job posting
3. Wait for admin approval
4. View applications

## 📚 Documentation

- **README.md** - Project overview
- **API.md** - API documentation (25 endpoints)
- **DEPLOYMENT.md** - Deployment guide
- **FEATURES.md** - Feature list

## 🔧 Useful Commands

```bash
# Install all dependencies
npm run install-all

# Start server
npm run server

# Start client
npm run client

# Start admin
npm run admin

# Build all frontends
npm run build-all
```

## 🐛 Common Issues

### MongoDB Connection Failed
- Check `.env` MONGODB_URI
- Verify MongoDB Atlas is accessible
- Check IP whitelist in MongoDB Atlas

### Port Already in Use
```bash
# Kill processes
lsof -ti:5000 | xargs kill -9  # Server
lsof -ti:3000 | xargs kill -9  # Client
lsof -ti:3001 | xargs kill -9  # Admin
```

### Dependencies Not Installing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## ✅ Success Checklist

- [ ] All 3 terminals running without errors
- [ ] Can access http://localhost:5000 (API)
- [ ] Can access http://localhost:3000 (Client)
- [ ] Can access http://localhost:3001 (Admin)
- [ ] Can register new user
- [ ] Can login successfully
- [ ] Can see dashboard

## 🎉 Next Steps

1. Explore the dashboards
2. Test CRUD operations
3. Test role permissions
4. Review API documentation
5. Customize for your needs

## 📞 Need Help?

Check the documentation files:
- README.md for overview
- DEPLOYMENT.md for detailed setup
- API.md for API reference
- FEATURES.md for feature details

---

**That's it! You're ready to use iBLAZE! 🚀**
