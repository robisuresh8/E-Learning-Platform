# E-Learning Platform - User-Specific Components Implementation

## Overview

This document outlines all the user-specific components added to the E-Learning Platform, enabling role-based course access, enrollment tracking, and personalized learning experiences.

---

## Backend Components (server.js)

### 1. **User Database & Session Management**

**In-Memory Storage:**
```javascript
const users = new Map();           // User accounts
const userEnrollments = new Map(); // Track course enrollments per user
const sessions = new Map();        // Active user sessions
```

### 2. **Authentication Middleware**

```javascript
function authenticateUser(req, res, next)
```
- Validates session tokens from request headers
- Protects routes that require authentication
- Attaches `req.userId` and `req.user` to authenticated requests

### 3. **User Authentication Routes**

#### `POST /api/auth/signup`
- Creates new user account
- Returns session token and user info
- Initializes empty enrollment list

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Response:**
```json
{
  "success": true,
  "userId": "user_1234567890",
  "sessionToken": "token_abc123...",
  "user": {
    "id": "user_1234567890",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### `POST /api/auth/login`
- Authenticates user with email and password
- Returns session token
- Includes enrolled courses list

**Request:**
```json
{
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Response:**
```json
{
  "success": true,
  "userId": "user_1234567890",
  "sessionToken": "token_abc123...",
  "user": {
    "id": "user_1234567890",
    "name": "John Doe",
    "email": "john@example.com",
    "enrolledCourses": [1, 3, 5]
  }
}
```

#### `POST /api/auth/logout`
- Invalidates session token
- Clears user session

#### `GET /api/auth/me`
- Returns current authenticated user info
- Includes enrollment list

### 4. **User Enrollment Routes**

#### `GET /api/user/enrolled-courses`
- Returns list of courses user is enrolled in
- Only accessible to authenticated users

**Response:**
```json
{
  "userId": "user_1234567890",
  "enrolledCourses": [
    {
      "id": 1,
      "title": "Web Development Fundamentals",
      "instructor": "Sarah Chen",
      "lessons": [...]
    }
  ]
}
```

#### `GET /api/user/enrolled/:courseId`
- Checks if user is enrolled in specific course
- Returns boolean enrollment status

**Response:**
```json
{
  "courseId": 1,
  "isEnrolled": true,
  "userId": "user_1234567890"
}
```

#### `GET /api/user/course/:courseId/content`
- Returns course content ONLY if user is enrolled
- Blocks non-enrolled users from viewing course material
- Returns 403 Forbidden if user not enrolled

**Response (if enrolled):**
```json
{
  "course": { /* full course data */ },
  "accessGranted": true,
  "userId": "user_1234567890"
}
```

**Response (if not enrolled):**
```json
{
  "error": "Access denied. You must enroll in this course to view its content."
}
```

#### `GET /api/user/dashboard`
- Returns user dashboard data
- Includes enrollment stats and course progress

**Response:**
```json
{
  "user": {
    "id": "user_1234567890",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "dashboard": {
    "totalEnrolledCourses": 3,
    "enrolledCourses": [
      {
        "id": 1,
        "title": "Web Development",
        "instructor": "Sarah Chen",
        "progress": 45,
        "lessons": 8,
        "completedLessons": 4
      }
    ]
  }
}
```

### 5. **Updated Payment Route**

#### `POST /api/process-payment`
- Now includes `userId` parameter
- Automatically enrolls user in course after successful payment
- Records enrollment in `userEnrollments` map

**Request:**
```json
{
  "courseId": 1,
  "amount": 2499,
  "email": "john@example.com",
  "paymentMethod": "credit_card",
  "userId": "user_1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "paymentId": "CERT-1234567890",
  "certificateId": "ICTRD-2026-ABC12",
  "message": "Payment processed successfully. You are now enrolled in this course.",
  "enrolled": true
}
```

---

## Frontend Components

### 1. **Authentication System (auth.js)**

Enhanced to handle real API calls:
- `handleLogin()` - Makes POST request to `/api/auth/login`
- `handleSignup()` - Makes POST request to `/api/auth/signup`
- Stores session token, user ID, name, and email in localStorage
- Validates form inputs before submission
- Shows loading states during API calls

**Session Storage:**
```javascript
localStorage.setItem('sessionToken', token);
localStorage.setItem('userId', userId);
localStorage.setItem('userName', userName);
localStorage.setItem('userEmail', userEmail);
```

### 2. **Course Listing (courses.js)**

Enhanced with user-specific features:
- `checkUserAuthentication()` - Displays user name in header if logged in
- `enrichCoursesWithEnrollmentStatus()` - Fetches enrollment status for each course
- Shows "✓ Enrolled" badge on courses user has purchased
- Color-coded enrollment indicators

### 3. **Course Detail Page (course.js)**

Added enrollment verification:
- `checkEnrollmentStatus()` - Verifies user enrollment before displaying content
- `updateEnrollmentButton()` - Shows different button states:
  - "Login to Enroll" - for non-logged-in users
  - "✓ Already Enrolled" - for enrolled users
  - "Enroll & Purchase" - for logged-in but non-enrolled users
- `initiateCertification()` - Includes user ID in payment flow

### 4. **Checkout Page (checkout.js)**

Now includes user information:
- `setupUserInfo()` - Displays logged-in user email
- `loadCheckoutData()` - Includes user ID from URL parameters
- `processPayment()` - Sends user ID to backend for enrollment tracking
- Requires authentication before payment

### 5. **User Dashboard (dashboard.html & dashboard.js)**

New page at `/dashboard` for authenticated users:

**Features:**
- User profile information display
- Enrollment statistics (total courses, completed, in-progress)
- List of all enrolled courses with progress tracking
- Quick navigation to continue courses
- Course details and progress percentages
- Logout functionality

**Key Functions:**
- `checkUserSession()` - Redirects to login if not authenticated
- `loadUserDashboard()` - Fetches user data from backend
- `displayDashboard()` - Renders dashboard UI
- `continueCourse()` - Navigate to course content
- `logout()` - Clear session and redirect to login

### 6. **User Session Utilities (user-session.js)**

New utility library for managing user sessions and enrollments across all pages.

**Classes:**

**UserSession**
- `isLoggedIn()` - Check if user has active session
- `getToken()` - Get session token
- `getUserId()` - Get user ID
- `getUserName()` - Get user name
- `getUserEmail()` - Get user email
- `setSession()` - Store user session data
- `clearSession()` - Clear all session data
- `getAuthHeader()` - Get authorization header for API calls

**CourseEnrollment**
- `checkIfEnrolled(courseId)` - Check enrollment status
- `getEnrolledCourses()` - Get list of enrolled courses
- `getCourseContent(courseId)` - Get course content (with access control)
- `processCoursePayment()` - Process payment and enrollment

**PageProtection**
- `requireLogin()` - Redirect to login if not authenticated
- `requireCourseAccess(courseId)` - Ensure course access

### 7. **Main Navigation (main.js)**

Enhanced with user session management:
- `setupUserSession()` - Initialize user UI on page load
- `logoutUser()` - Handle logout with API call
- Updates navigation based on login status
- Shows/hides dashboard link for authenticated users

---

## Access Control Flow

### Course Access Control

```
User Request to View Course Content
         ↓
[Enrolled?] ← Check `/api/user/enrolled/:courseId`
    ↙          ↖
  YES          NO
   ↓            ↓
GRANT      [Logged In?]
ACCESS          ↙        ↖
             YES          NO
              ↓            ↓
           DENY       REDIRECT TO
          (403)       LOGIN PAGE
```

### Payment & Enrollment Flow

```
User Clicks "Enroll"
         ↓
[Logged In?]
    ↙       ↖
  YES       NO
   ↓         ↓
PROCEED   REDIRECT
TO PAY    TO LOGIN
   ↓
PAYMENT PAGE
   ↓
PROCESS PAYMENT
   ↓
UPDATE BACKEND:
userEnrollments.get(userId)
         ↓
ISSUE CERTIFICATE
         ↓
REDIRECT TO SUCCESS
```

---

## Database Schema (In-Memory)

### Users Map
```javascript
{
  "user_1234567890": {
    id: "user_1234567890",
    name: "John Doe",
    email: "john@example.com",
    password: "hashedpassword", // Should be hashed in production
    createdAt: Date,
    enrolledCourses: []
  }
}
```

### User Enrollments Map
```javascript
{
  "user_1234567890": [1, 3, 5], // Array of enrolled course IDs
  "user_9876543210": [2, 4]
}
```

### Sessions Map
```javascript
{
  "token_abc123xyz": "user_1234567890",
  "token_def456uvw": "user_9876543210"
}
```

---

## Important Notes

### For Production Deployment

1. **Replace In-Memory Storage:**
   - Use MongoDB, PostgreSQL, or other real database
   - Store session tokens in Redis or similar cache
   - Use database transactions for consistency

2. **Security Improvements:**
   - Hash passwords using bcrypt or similar
   - Implement JWT tokens instead of simple session tokens
   - Add CORS protection
   - Implement rate limiting
   - Add HTTPS requirement
   - Validate and sanitize all inputs

3. **Payment Integration:**
   - Integrate with Stripe, PayPal, or other payment processor
   - Implement webhook handlers for payment confirmation
   - Add transaction logging and audit trails

4. **Database Migrations:**
   ```
   Users Table:
   - id (primary key)
   - name
   - email (unique)
   - password (hashed)
   - created_at
   - updated_at

   Enrollments Table:
   - id (primary key)
   - user_id (foreign key)
   - course_id (foreign key)
   - enrolled_at
   - progress
   - completed_at (nullable)

   Sessions Table:
   - token (primary key)
   - user_id (foreign key)
   - created_at
   - expires_at
   ```

---

## Testing the Implementation

### 1. User Registration
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. User Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Check Enrollment
```bash
curl -X GET http://localhost:3000/api/user/enrolled/1 \
  -H "Authorization: Bearer token_abc123xyz"
```

### 4. Get User Dashboard
```bash
curl -X GET http://localhost:3000/api/user/dashboard \
  -H "Authorization: Bearer token_abc123xyz"
```

---

## Files Modified/Created

### Modified Files:
1. `server.js` - Added user management and authentication routes
2. `public/js/auth.js` - Implemented real authentication
3. `public/js/courses.js` - Added enrollment status display
4. `public/js/course.js` - Added enrollment verification
5. `public/js/checkout.js` - Added user ID to payment flow
6. `public/js/main.js` - Added user session setup

### New Files:
1. `public/dashboard.html` - User dashboard page
2. `public/js/dashboard.js` - Dashboard functionality
3. `public/js/user-session.js` - User session utilities

---

## User Flow Examples

### First-Time User Flow
1. User visits `/login`
2. Clicks "Sign Up"
3. Enters name, email, password
4. System creates user account and session
5. User redirected to home page
6. User sees courses list with "Enroll" buttons

### Course Enrollment Flow
1. User on courses page sees course
2. Clicks "View Course" → goes to `/course/1`
3. If not enrolled, sees "Enroll & Purchase" button
4. Clicks button → redirected to `/checkout?courseId=1&...`
5. Enters payment info
6. Payment processed
7. User automatically enrolled
8. Redirected to certificate page
9. Can now view course content

### Returning User Flow
1. User visits `/login`
2. Enters email and password
3. System verifies credentials
4. User logged in, sees "My Dashboard" link
5. Clicks dashboard → sees all enrolled courses
6. Can continue any course or view course details

---

## Security Considerations

### What's Implemented:
- Basic authentication with session tokens
- Protected API endpoints require authentication
- Course content only accessible to enrolled users
- Payment must be made to gain access

### What Should Be Added for Production:
- Password hashing (bcrypt)
- JWT tokens with expiration
- Rate limiting on auth endpoints
- CORS security headers
- HTTPS enforcement
- SQL injection prevention
- XSS protection
- CSRF tokens
- Two-factor authentication (2FA)
- Audit logging
- Payment verification webhooks

---

## Summary

The platform now features:

✅ User registration and login  
✅ Session management with authentication tokens  
✅ Course enrollment tracking per user  
✅ Access control to course content (only enrolled users)  
✅ Automatic enrollment after payment  
✅ User dashboard showing all enrolled courses and progress  
✅ Progress tracking and completion metrics  
✅ Logout functionality  
✅ User profile information display  

These components enable a complete user-specific learning experience where each user can:
- Create an account
- Browse courses
- Purchase/enroll in courses
- View only content they're enrolled in
- Track their progress
- Manage their profile

For questions or further implementation details, refer to the inline code comments in each file.
