# iBLAZE API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## Auth Endpoints

### Register User
**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student" // student, investor, employer, admin
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "isApproved": true,
      "isVerified": true,
      "status": "active"
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

### Login
**POST** `/auth/login`

Authenticate and get tokens.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { /* user object */ },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

### Refresh Token
**POST** `/auth/refresh-token`

Get new access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "new_jwt_access_token",
    "refreshToken": "new_jwt_refresh_token"
  }
}
```

### Get Current User
**GET** `/auth/me`

Get currently authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { /* user object */ }
  }
}
```

### Logout
**POST** `/auth/logout`

Logout and invalidate refresh token.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Ideas Endpoints

### Get All Ideas
**GET** `/ideas`

Get all approved ideas (public summaries only).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "idea_id",
      "title": "Revolutionary App",
      "publicSummary": "Brief description",
      "category": "Technology",
      "industry": "Software",
      "stage": "mvp",
      "creator": { /* creator info */ },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "views": []
    }
  ]
}
```

### Create Idea
**POST** `/ideas`

Create a new idea.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "My Amazing Idea",
  "publicSummary": "A brief public summary",
  "fullDescription": "Detailed description with sensitive info",
  "category": "Technology",
  "industry": "Software",
  "stage": "concept" // concept, prototype, mvp, scaling
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* created idea object */ }
}
```

### Get Idea by ID
**GET** `/ideas/:id`

Get idea details (access control applied).

**Headers:** `Authorization: Bearer <token>`

**Response:**
- Creator/Admin: Full details
- Approved Investor: Full details
- Others: Public summary only (if approved)

### Update Idea
**PUT** `/ideas/:id`

Update an idea (creator or admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Updated Title",
  "publicSummary": "Updated summary",
  "fullDescription": "Updated description",
  "category": "Updated category",
  "industry": "Updated industry",
  "stage": "mvp"
}
```

### Delete Idea
**DELETE** `/ideas/:id`

Delete an idea (creator or admin only).

**Headers:** `Authorization: Bearer <token>`

### Request Access to Idea
**POST** `/ideas/:id/request-access`

Request access to full idea details (investors only).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Access request submitted successfully"
}
```

### Manage Access Request
**PUT** `/ideas/:ideaId/access-request/:requestId`

Approve or reject access request (creator or admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "approved" // or "rejected"
}
```

---

## Jobs Endpoints

### Get All Jobs
**GET** `/jobs`

Get all approved jobs.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [ /* array of job objects */ ]
}
```

### Create Job
**POST** `/jobs`

Create a new job (employers only, must be verified).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Software Developer",
  "description": "Job description",
  "jobType": "full-time", // full-time, part-time, internship, contract
  "location": "New York, NY",
  "workMode": "hybrid", // remote, onsite, hybrid
  "duration": "6 months",
  "stipend": "$50,000/year",
  "skillsRequired": ["JavaScript", "React", "Node.js"]
}
```

### Get Job by ID
**GET** `/jobs/:id`

Get job details.

**Headers:** `Authorization: Bearer <token>`

### Update Job
**PUT** `/jobs/:id`

Update a job (employer or admin only).

**Headers:** `Authorization: Bearer <token>`

### Delete Job
**DELETE** `/jobs/:id`

Delete a job (employer or admin only).

**Headers:** `Authorization: Bearer <token>`

### Apply to Job
**POST** `/jobs/:id/apply`

Apply to a job (students only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "resume": "Link to resume or resume text",
  "coverLetter": "Cover letter text"
}
```

### Get Job Applications
**GET** `/jobs/:id/applications`

Get applications for a job (employer or admin only).

**Headers:** `Authorization: Bearer <token>`

---

## Admin Endpoints

All admin endpoints require admin role.

### Get All Users
**GET** `/admin/users`

Get all users in the system.

**Headers:** `Authorization: Bearer <admin_token>`

### Update User Status
**PUT** `/admin/users/:userId`

Update user approval, verification, or status.

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "isApproved": true,    // Optional
  "isVerified": true,    // Optional
  "status": "active"     // Optional: active or suspended
}
```

### Get Pending Ideas
**GET** `/admin/ideas/pending`

Get all ideas pending approval.

**Headers:** `Authorization: Bearer <admin_token>`

### Update Idea Status
**PUT** `/admin/ideas/:ideaId`

Approve or reject an idea.

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "status": "approved" // or "rejected"
}
```

### Get Pending Jobs
**GET** `/admin/jobs/pending`

Get all jobs pending approval.

**Headers:** `Authorization: Bearer <admin_token>`

### Update Job Status
**PUT** `/admin/jobs/:jobId`

Approve or reject a job.

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "status": "approved" // or "rejected"
}
```

### Get Analytics
**GET** `/admin/analytics`

Get platform analytics.

**Headers:** `Authorization: Bearer <admin_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "totals": {
      "users": 100,
      "ideas": 50,
      "jobs": 25,
      "applications": 75
    },
    "usersByRole": [
      { "_id": "student", "count": 60 },
      { "_id": "investor", "count": 20 },
      { "_id": "employer", "count": 19 },
      { "_id": "admin", "count": 1 }
    ],
    "ideasByStatus": [
      { "_id": "pending", "count": 10 },
      { "_id": "approved", "count": 35 },
      { "_id": "rejected", "count": 5 }
    ],
    "jobsByStatus": [
      { "_id": "pending", "count": 5 },
      { "_id": "approved", "count": 18 },
      { "_id": "rejected", "count": 2 }
    ]
  }
}
```

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message"
}
```

**Common Status Codes:**
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

---

## Rate Limiting

- 100 requests per 15 minutes per IP
- Exceeding limit returns 429 status

---

## CORS

Allowed origins:
- http://localhost:3000 (Client)
- http://localhost:3001 (Admin)

---

## Security Headers

All responses include security headers via Helmet:
- X-DNS-Prefetch-Control
- X-Frame-Options
- Strict-Transport-Security
- X-Download-Options
- X-Content-Type-Options
- X-XSS-Protection
