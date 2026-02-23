# iBLAZE Server

Backend API for the iBLAZE IdeaVault Platform.

## Features

- User authentication & authorization (JWT)
- Role-based access control (Student, Investor, Employer, Admin)
- Idea management with access control
- Job posting and application system
- Admin dashboard with analytics
- Rate limiting and security headers
- MongoDB database with Mongoose ODM

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (Access & Refresh Tokens)
- **Security:** Helmet, CORS, Rate Limiting, bcrypt

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Configure your `.env` file with appropriate values:
   - Set your MongoDB connection string
   - Update JWT secrets (use strong, random strings in production)
   - Configure client URLs for CORS

### Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000` (or your configured PORT).

## Project Structure

```
server/
├── config/          # Database configuration
├── controllers/     # Request handlers
├── middleware/      # Custom middleware (auth, error handling)
├── models/          # Mongoose models
├── routes/          # API routes
├── utils/           # Utility functions (JWT, error handling)
├── .env             # Environment variables (not in git)
├── .env.example     # Environment variables template
├── .gitignore       # Git ignore rules
├── package.json     # Dependencies and scripts
└── server.js        # Application entry point
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh access token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Ideas
- `GET /api/ideas` - Get all approved ideas
- `POST /api/ideas` - Create new idea
- `GET /api/ideas/:id` - Get idea by ID
- `PUT /api/ideas/:id` - Update idea
- `DELETE /api/ideas/:id` - Delete idea
- `POST /api/ideas/:id/request-access` - Request access to full description
- `PUT /api/ideas/:ideaId/access-request/:requestId` - Update access request

### Jobs
- `GET /api/jobs` - Get all approved jobs
- `POST /api/jobs` - Create new job (employers only)
- `GET /api/jobs/:id` - Get job by ID
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job
- `POST /api/jobs/:id/apply` - Apply to job
- `GET /api/jobs/:id/applications` - Get job applications

### Admin
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:userId` - Update user status
- `GET /api/admin/ideas/pending` - Get pending ideas
- `PUT /api/admin/ideas/:ideaId` - Update idea status
- `GET /api/admin/jobs/pending` - Get pending jobs
- `PUT /api/admin/jobs/:jobId` - Update job status
- `GET /api/admin/analytics` - Get platform analytics

## User Roles

- **Student:** Can submit ideas and apply to jobs
- **Investor:** Can view and request access to ideas (requires approval)
- **Employer:** Can post jobs (requires verification)
- **Admin:** Full platform access and management

## Security Features

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt (12 salt rounds)
- Role-based access control
- Rate limiting (100 requests per 15 minutes by default)
- Security headers via Helmet
- CORS configuration
- Input validation
- Error handling middleware

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | development |
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | - |
| `JWT_SECRET` | Access token secret | - |
| `JWT_EXPIRE` | Access token expiry | 1h |
| `JWT_REFRESH_SECRET` | Refresh token secret | - |
| `JWT_REFRESH_EXPIRE` | Refresh token expiry | 7d |
| `CLIENT_URL` | Client app URL | - |
| `ADMIN_URL` | Admin app URL | - |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |

## Database Models

### User
- name, email, password
- role (student/investor/employer/admin)
- isVerified, isApproved, status
- refreshToken

### Idea
- title, publicSummary, fullDescription
- creator, category, industry, stage
- status, accessRequests, approvedInvestors
- views

### Job
- title, description, employer
- jobType, location, workMode
- duration, stipend, skillsRequired
- status

### Application
- job, applicant
- resume, coverLetter
- status, reviewedBy

## Development

### Adding New Routes

1. Create controller in `controllers/`
2. Define routes in `routes/`
3. Import and use in `server.js`

### Adding New Models

1. Create model in `models/`
2. Define schema with validators
3. Add methods if needed
4. Export model

## Error Handling

All errors are handled by the centralized error handler middleware. Use `ApiError` class for operational errors:

```javascript
throw new ApiError(400, 'Your error message');
```

## License

ISC
