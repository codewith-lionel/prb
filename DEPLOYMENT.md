# iBLAZE Platform - Deployment & Testing Guide

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Modern web browser

## 🚀 Quick Start

### Step 1: Backend Setup

```bash
cd server
npm install
```

Ensure the `.env` file exists with proper configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=super_secure_jwt_secret_min_32_characters
JWT_REFRESH_SECRET=super_secure_refresh_secret_min_32_characters
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

Start the server:
```bash
npm start
```

The server will run on http://localhost:5000

### Step 2: Client Setup

```bash
cd client
npm install
npm run dev
```

The client will run on http://localhost:3000

### Step 3: Admin Panel Setup

```bash
cd admin
npm install
npm run dev
```

The admin panel will run on http://localhost:3001

## 🧪 Testing the Application

### 1. Create Test Accounts

#### Student Account
```
POST http://localhost:5000/api/auth/register
{
  "name": "John Student",
  "email": "student@test.com",
  "password": "password123",
  "role": "student"
}
```

#### Investor Account
```
POST http://localhost:5000/api/auth/register
{
  "name": "Jane Investor",
  "email": "investor@test.com",
  "password": "password123",
  "role": "investor"
}
```

#### Employer Account
```
POST http://localhost:5000/api/auth/register
{
  "name": "Company HR",
  "email": "employer@test.com",
  "password": "password123",
  "role": "employer"
}
```

#### Admin Account
```
POST http://localhost:5000/api/auth/register
{
  "name": "Admin User",
  "email": "admin@test.com",
  "password": "password123",
  "role": "admin"
}
```

### 2. Test Workflows

#### As Student:
1. Login to client app
2. Browse ideas (Ideas page)
3. Browse jobs (Jobs page)
4. Submit an idea
5. Apply to a job

#### As Investor:
1. Login to client app
2. Browse approved ideas
3. Request access to idea details
4. Wait for approval

#### As Employer:
1. Login to client app
2. Create a job posting
3. Wait for admin approval
4. View applications
5. Review candidates

#### As Admin:
1. Login to admin panel
2. View analytics dashboard
3. Approve investor accounts
4. Verify employer accounts
5. Moderate ideas (approve/reject)
6. Moderate jobs (approve/reject)
7. Suspend/activate users

## 🔧 Production Build

### Backend
```bash
cd server
npm start
```

### Client
```bash
cd client
npm run build
npm run preview
```

### Admin
```bash
cd admin
npm run build
npm run preview
```

## 🐛 Common Issues & Solutions

### MongoDB Connection Failed
- Verify MongoDB Atlas cluster is running
- Check IP whitelist in MongoDB Atlas
- Ensure connection string is correct
- Test network connectivity

### CORS Errors
- Verify CLIENT_URL and ADMIN_URL in .env
- Check CORS configuration in server.js
- Ensure ports match

### JWT Errors
- Check JWT_SECRET is at least 32 characters
- Verify token expiry settings
- Clear localStorage and login again

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

## 📊 API Testing with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "student"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Ideas (with authentication)
```bash
curl -X GET http://localhost:5000/api/ideas \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🔐 Security Checklist

- [x] Passwords hashed with bcrypt (12 salt rounds)
- [x] JWT tokens with expiration
- [x] Refresh token rotation
- [x] Rate limiting enabled
- [x] Helmet security headers
- [x] CORS restricted to specific origins
- [x] Input validation
- [x] Role-based access control
- [x] Error messages don't leak sensitive info
- [x] .env file in .gitignore

## 📝 Database Seeding (Optional)

You can create a seed script to populate the database with test data. Create `server/seed.js`:

```javascript
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Idea from './models/Idea.js';
import Job from './models/Job.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Clear existing data
    await User.deleteMany({});
    await Idea.deleteMany({});
    await Job.deleteMany({});
    
    // Create users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@iblaze.com',
      password: 'admin123',
      role: 'admin',
      isVerified: true,
      isApproved: true,
    });
    
    console.log('✅ Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
```

Run: `node server/seed.js`

## 🎯 Performance Optimization

1. **Backend**
   - Use database indexes
   - Implement caching (Redis)
   - Optimize queries with populate limits
   - Use compression middleware

2. **Frontend**
   - Code splitting
   - Lazy loading routes
   - Image optimization
   - Bundle analysis

3. **Database**
   - Create indexes on frequently queried fields
   - Use lean() for read-only queries
   - Implement pagination

## 📦 Deployment

### Backend (Heroku/Railway/Render)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect repository
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Deploy

## 🔄 Continuous Integration

Recommended CI/CD workflow:
1. Run linter
2. Run tests
3. Build application
4. Deploy to staging
5. Run e2e tests
6. Deploy to production

## 📞 Support

For issues or questions:
- Check the README.md
- Review this deployment guide
- Check server logs
- Verify environment variables
- Test API endpoints manually
