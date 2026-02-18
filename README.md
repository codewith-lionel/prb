# iBLAZE - IdeaVault Platform

A production-ready full-stack MERN application for managing ideas, jobs, and connecting students, investors, and employers.

## 🚀 Tech Stack

### Backend
- Node.js + Express.js
- MongoDB Atlas (Mongoose)
- JWT (Access + Refresh Tokens)
- bcrypt (Password Hashing)
- Security: helmet, cors, express-rate-limit
- Error Handling & Validation

### Frontend (Client)
- React 18 with Vite
- Tailwind CSS (Dark Theme + Glassmorphism)
- Axios with Auto-Refresh Interceptors
- React Router with Protected Routes
- Context API for State Management

### Admin Panel
- Separate React App
- Admin-Only Access Control
- User Management
- Content Moderation
- Analytics Dashboard

## 📁 Project Structure

```
iBLAZE/
├── server/              # Backend API
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth, error handling
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
├── client/              # User-facing React app
└── admin/               # Admin panel React app
```

## 🔐 User Roles

- **Student**: Browse ideas, apply to jobs, submit ideas
- **Investor**: Browse ideas, request access to full descriptions
- **Employer**: Post jobs, manage applications
- **Admin**: Approve users, moderate content, view analytics

## ⚙️ Setup & Installation

### 1. Server Setup

```bash
cd server
npm install
npm start
```

Server runs on http://localhost:5000

### 2. Client Setup

```bash
cd client
npm install
npm run dev
```

Client runs on http://localhost:3000

### 3. Admin Panel Setup

```bash
cd admin
npm install
npm run dev
```

Admin panel runs on http://localhost:3001

## 🔑 Environment Variables

Server `.env` file is already configured with:
- MongoDB Atlas connection string
- JWT secrets
- CORS URLs
- Rate limiting settings

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh access token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Ideas
- `GET /api/ideas` - Get all approved ideas
- `POST /api/ideas` - Create new idea
- `GET /api/ideas/:id` - Get idea details
- `PUT /api/ideas/:id` - Update idea
- `DELETE /api/ideas/:id` - Delete idea
- `POST /api/ideas/:id/request-access` - Request access to idea
- `PUT /api/ideas/:ideaId/access-request/:requestId` - Approve/reject access

### Jobs
- `GET /api/jobs` - Get all approved jobs
- `POST /api/jobs` - Create new job
- `GET /api/jobs/:id` - Get job details
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job
- `POST /api/jobs/:id/apply` - Apply to job
- `GET /api/jobs/:id/applications` - Get job applications

### Admin (Protected)
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:userId` - Update user status
- `GET /api/admin/ideas/pending` - Get pending ideas
- `PUT /api/admin/ideas/:ideaId` - Approve/reject idea
- `GET /api/admin/jobs/pending` - Get pending jobs
- `PUT /api/admin/jobs/:jobId` - Approve/reject job
- `GET /api/admin/analytics` - Get platform analytics

## 🔒 Security Features

- Password hashing with bcrypt (12 salt rounds)
- JWT access and refresh tokens
- Role-based access control (RBAC)
- Rate limiting (100 requests per 15 minutes)
- Helmet security headers
- CORS protection
- Input validation and sanitization
- Centralized error handling

## ✨ Key Features

### For Students
- Browse and search ideas
- Apply to job opportunities
- Submit their own ideas
- Track application status

### For Investors
- View approved ideas (public summary)
- Request access to full idea details
- Creator/admin approves access requests
- Track investment opportunities

### For Employers
- Post job opportunities
- Manage applications
- View candidate details
- Track hiring pipeline

### For Admins
- Approve investor accounts
- Verify employer accounts
- Moderate ideas and jobs
- Suspend users
- View platform analytics
- Manage all content

## 🎨 UI/UX

- Dark theme with pink accent (#FF1B8D)
- Glassmorphism design
- Fully responsive
- Loading states
- Error handling
- Form validation

## 📊 Database Models

### User
- Authentication fields
- Role-based permissions
- Approval/verification status
- Account status

### Idea
- Title, summary, full description
- Category, industry, stage
- Access control system
- View tracking
- Status workflow

### Job
- Job details and requirements
- Employment type
- Location and work mode
- Application tracking
- Status workflow

### Application
- Job reference
- Applicant details
- Resume and cover letter
- Review status

## 🚦 Getting Started

1. Ensure MongoDB Atlas connection is active
2. Start the server: `cd server && npm start`
3. Start the client: `cd client && npm run dev`
4. Start the admin panel: `cd admin && npm run dev`
5. Register a new user or login
6. Admin credentials can be created by registering with role "admin"

## 📝 Notes

- All data is dynamically fetched from MongoDB
- No static mock data
- Proper error handling throughout
- Production-ready code
- No TODO comments or placeholder functions
- Clean, modular architecture