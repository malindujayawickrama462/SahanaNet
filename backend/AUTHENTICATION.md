# Authentication & Authorization Guide

## Overview
This application implements JWT-based authentication with role-based authorization using Express.js and MongoDB.

## Architecture

### 1. Middleware
- **authenticate.js**: Verifies JWT tokens and extracts user ID
- **authorize.js**: Checks user roles for protected resources

### 2. Controllers
- **userController.js**: User registration and login
- **authController.js**: Profile management and protected operations

### 3. Models
- **User.js**: User schema with roles (admin, student, staff)

---

## API Endpoints

### 1. Public Endpoints (No Authentication Required)

#### Register User
```http
POST /api/user/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "student"  // Optional: defaults to "admin"
}
```

**Response (201)**:
```json
{
  "userID": "User-0001",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student"
}
```

#### Login User
```http
POST /api/user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201)**:
```json
{
  "msg": "login successfull",
  "userID": "User-0001",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 2. Protected Endpoints (Authentication Required)

All these endpoints require the `Authorization` header with a Bearer token:
```http
Authorization: Bearer <token_from_login>
```

#### Get User Profile
```http
GET /api/user/profile
Authorization: Bearer <token>
```

**Response (200)**:
```json
{
  "userID": "User-0001",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student",
  "createdAt": "2024-03-18T10:30:00Z"
}
```

#### Update Profile
```http
PUT /api/user/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```

#### Change Password
```http
POST /api/user/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "securePassword123",
  "newPassword": "newSecurePassword456"
}
```

---

### 3. Admin Only Endpoints (Admin role required)

#### Get All Users
```http
GET /api/user/all-users
Authorization: Bearer <admin_token>
```

**Response (200)**:
```json
{
  "total": 5,
  "users": [
    {
      "_id": "...",
      "userID": "User-0001",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "createdAt": "2024-03-18T10:30:00Z"
    },
    ...
  ]
}
```

#### Delete User
```http
DELETE /api/user/:id
Authorization: Bearer <admin_token>
```

**Response (200)**:
```json
{
  "msg": "User deleted successfully",
  "userID": "User-0001"
}
```

#### Get User by ID (Admin lookup)
```http
GET /api/user/:ID
Authorization: Bearer <admin_token>
```

---

## User Roles

| Role   | Permissions                                              |
|--------|----------------------------------------------------------|
| admin  | - View all users<br>- Delete users<br>- Full access    |
| student| - View own profile<br>- Update own profile<br>- Change password |
| staff  | - View own profile<br>- Update own profile<br>- Change password |

---

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smartQueue
SECRET_KEY=your_super_secret_jwt_key_here_change_in_production
NODE_ENV=development
```

**Important**: Change `SECRET_KEY` to a strong secret in production!

---

## How It Works

### 1. Registration & Login Flow
```
User submits credentials → Hash password with bcrypt → Generate JWT token → Return token to client
```

### 2. Protected Request Flow
```
Client sends request with token in Authorization header
    ↓
authenticate middleware verifies token
    ↓
Extract userId from token
    ↓
If role check needed, authorize middleware validates role
    ↓
Controller processes request
```

### 3. Token Structure
```
Token expires in: 30 days
Algorithm: HS256 (HMAC SHA256)
Payload: { id: userId }
```

---

## Error Handling

### Common Error Responses

**400 Bad Request**: Missing required fields
```json
{
  "msg": "required all fields"
}
```

**401 Unauthorized**: Invalid/expired token or missing credentials
```json
{
  "msg": "Invalid token"
}
```

**403 Forbidden**: User doesn't have required role
```json
{
  "msg": "Access denied. Required role(s): admin"
}
```

**500 Server Error**: Internal error
```json
{
  "msg": "error message"
}
```

---

## Security Best Practices

1. ✅ Passwords are hashed using bcrypt with salt rounds = 10
2. ✅ JWT tokens expire after 30 days
3. ✅ Sensitive fields (passwords) are excluded from API responses
4. ✅ Role-based access control (RBAC) is implemented
5. ✅ Environment variables protect sensitive configuration

### Recommendations for Production:
- Use HTTPS only
- Implement refresh tokens
- Add rate limiting
- Use secure cookie storage for tokens
- Implement token blacklisting for logout
- Add CORS policy
- Use helmet.js for security headers

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/user/register \
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
curl -X POST http://localhost:5000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Profile
```bash
curl -X GET http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Admin: Get All Users
```bash
curl -X GET http://localhost:5000/api/user/all-users \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "No token provided" | Add `Authorization: Bearer <token>` header |
| "Token has expired" | User needs to login again and get new token |
| "Access denied" | Ensure user has required role (check role in User schema) |
| "User not found" | User might be deleted or user ID incorrect |
| bcrypt errors | Ensure bcrypt is installed: `npm install bcrypt` |
