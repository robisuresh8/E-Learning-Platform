# Developer Quick Reference

## System Overview

The platform now has a **complete user-specific authentication and enrollment system** integrated throughout.

```
┌─────────────────────────────────────────────────────────────┐
│                     E-Learning Platform                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Frontend Layer:                 Backend Layer:              │
│  ┌──────────────────┐           ┌──────────────────┐        │
│  │ auth.js          │           │ Authentication   │        │
│  │ courses.js       │◄──────────►│ Endpoints        │        │
│  │ course.js        │           │                  │        │
│  │ checkout.js      │           │ Enrollment       │        │
│  │ dashboard.js     │           │ Management       │        │
│  │ user-session.js  │           │                  │        │
│  └──────────────────┘           │ Access Control   │        │
│         │                       │ Middleware       │        │
│         │                       │                  │        │
│  HTML Pages:                    └──────────────────┘        │
│  ├─ index.html                         │                    │
│  ├─ login.html                  In-Memory DB:              │
│  ├─ courses.html                ├─ Users                    │
│  ├─ course.html                 ├─ Sessions                 │
│  ├─ checkout.html               └─ Enrollments              │
│  └─ dashboard.html                                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Classes & Utilities

### UserSession Class (user-session.js)

```javascript
// Check if user is logged in
if (UserSession.isLoggedIn()) {
  // User has active session
}

// Get user data
const token = UserSession.getToken();
const userId = UserSession.getUserId();
const name = UserSession.getUserName();
const email = UserSession.getUserEmail();

// Store session on login
UserSession.setSession(token, userId, name, email);

// Clear on logout
UserSession.clearSession();

// Get auth header for API calls
const headers = UserSession.getAuthHeader();
// Returns: { Authorization: "Bearer token..." }
```

### CourseEnrollment Class (user-session.js)

```javascript
// Check if user is enrolled
const isEnrolled = await CourseEnrollment.checkIfEnrolled(courseId);

// Get all enrolled courses
const courses = await CourseEnrollment.getEnrolledCourses();

// Get course content (with access control)
try {
  const course = await CourseEnrollment.getCourseContent(courseId);
} catch (error) {
  // User not enrolled - show error
}

// Process payment
const result = await CourseEnrollment.processCoursePayment(
  courseId,
  amount,
  email,
  paymentMethod,
  userId
);
```

### PageProtection Class (user-session.js)

```javascript
// Require login to access page
if (!PageProtection.requireLogin()) {
  return; // Redirected to login
}

// Require course access
PageProtection.requireCourseAccess(courseId);
```

---

## API Endpoints Reference

### Authentication

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/auth/signup` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | User login |
| POST | `/api/auth/logout` | ✅ | User logout |
| GET | `/api/auth/me` | ✅ | Get current user |

### User Data

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/user/dashboard` | ✅ | Get dashboard data |
| GET | `/api/user/enrolled-courses` | ✅ | Get enrolled courses |
| GET | `/api/user/enrolled/:id` | ✅ | Check if enrolled |
| GET | `/api/user/course/:id/content` | ✅ | Get course content |

### Courses

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/courses` | ❌ | Get all courses |
| GET | `/api/courses/:id` | ❌ | Get single course |

### Payment

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/process-payment` | ✅ | Process payment & enroll |

---

## Common Workflows

### Workflow 1: User Registration & Login

```javascript
// 1. Sign Up
fetch('/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John',
    email: 'john@test.com',
    password: 'pass123'
  })
})
.then(r => r.json())
.then(data => {
  UserSession.setSession(
    data.sessionToken,
    data.userId,
    data.user.name,
    data.user.email
  );
  // User is now logged in
});

// 2. Login Later
fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@test.com',
    password: 'pass123'
  })
})
.then(r => r.json())
.then(data => {
  UserSession.setSession(...data);
});
```

### Workflow 2: Check & Access Course

```javascript
// 1. Check if enrolled
const isEnrolled = await CourseEnrollment.checkIfEnrolled(courseId);

if (!isEnrolled) {
  // Show purchase button
} else {
  // 2. Get course content
  const course = await CourseEnrollment.getCourseContent(courseId);
  // Display course lessons
}
```

### Workflow 3: Purchase & Enroll

```javascript
// 1. Process payment
const result = await CourseEnrollment.processCoursePayment(
  courseId,
  amount,
  email,
  'credit_card',
  userId
);

if (result.success) {
  // User is now enrolled
  // Get course content
  const course = await CourseEnrollment.getCourseContent(courseId);
}
```

### Workflow 4: User Logout

```javascript
fetch('/api/auth/logout', {
  method: 'POST',
  headers: UserSession.getAuthHeader()
})
.then(r => r.json())
.then(data => {
  UserSession.clearSession();
  // User is logged out
  window.location.href = '/login';
});
```

---

## Page Integration Guide

### Dashboard Page (/dashboard)

```html
<!-- Auto-redirects if not logged in -->
<script>
  // In dashboard.js:
  if (!UserSession.isLoggedIn()) {
    window.location.href = '/login';
  }
</script>
```

**Shows:**
- User profile info
- Enrollment statistics  
- List of enrolled courses
- Progress tracking
- "Continue Learning" buttons

### Course Page (/course/1)

```javascript
// 1. Load course (public API)
const course = await fetch('/api/courses/1');

// 2. If logged in, check enrollment
if (UserSession.isLoggedIn()) {
  const enrolled = await CourseEnrollment.checkIfEnrolled(1);
  // Update button state based on enrollment
}

// 3. Show purchase or content
if (enrolled) {
  // Show full course content
} else {
  // Show "Enroll & Purchase" button
}
```

### Courses List (/courses)

```javascript
// 1. Load all courses (public)
const courses = await fetch('/api/courses');

// 2. If logged in, enrich with enrollment status
if (UserSession.isLoggedIn()) {
  for (const course of courses) {
    course.isEnrolled = await CourseEnrollment.checkIfEnrolled(course.id);
  }
}

// 3. Display enrollment badges
```

### Checkout Page (/checkout)

```javascript
// 1. Verify user is logged in
if (!UserSession.isLoggedIn()) {
  window.location.href = '/login';
}

// 2. Get user data
const userId = UserSession.getUserId();
const email = UserSession.getUserEmail();

// 3. Process payment with enrollment
await CourseEnrollment.processCoursePayment(
  courseId,
  amount,
  email,
  method,
  userId
);
```

---

## localStorage Keys

| Key | Example | Purpose |
|-----|---------|---------|
| `sessionToken` | `token_abc123xyz` | API authentication |
| `userId` | `user_1234567890` | Current user ID |
| `userName` | `John Doe` | Display in UI |
| `userEmail` | `john@example.com` | Display in UI |
| `rememberMe` | `true` | Optional: stay logged in |

---

## Error Handling

### Authentication Errors

```javascript
// 401 Unauthorized
{ error: "Unauthorized" }
{ error: "Invalid or expired session" }

// 409 Conflict (duplicate user)
{ error: "User already exists" }

// 401 Invalid credentials
{ error: "Invalid credentials" }
```

### Enrollment Errors

```javascript
// 403 Forbidden (not enrolled)
{ error: "Access denied. You must enroll in this course..." }

// 404 Not found
{ error: "Course not found" }
```

### Payment Errors

```javascript
// 400 Bad request
{ error: "Missing required payment information" }

// General payment error
{ error: "Payment failed. Please try again." }
```

---

## Debugging Tips

### Check User Session
```javascript
console.log('Is logged in:', UserSession.isLoggedIn());
console.log('User ID:', UserSession.getUserId());
console.log('User Name:', UserSession.getUserName());
console.log('Token:', UserSession.getToken());
```

### Test API Endpoints
```javascript
// Test dashboard endpoint
fetch('/api/user/dashboard', {
  headers: UserSession.getAuthHeader()
})
.then(r => r.json())
.then(d => console.log('Dashboard:', d));

// Test enrollment check
fetch('/api/user/enrolled/1', {
  headers: UserSession.getAuthHeader()
})
.then(r => r.json())
.then(d => console.log('Enrolled:', d));
```

### Check Browser Storage
```javascript
// In browser console:
localStorage.getItem('sessionToken');
localStorage.getItem('userId');
localStorage.getItem('userName');
```

---

## Performance Considerations

### Optimize API Calls

```javascript
// ❌ Bad: Multiple calls for same data
for (const course of courses) {
  fetch(`/api/user/enrolled/${course.id}`);
}

// ✅ Good: Batch or cache enrollment status
const enrolledCourses = await CourseEnrollment.getEnrolledCourses();
const enrolledIds = new Set(enrolledCourses.map(c => c.id));
courses.forEach(c => c.isEnrolled = enrolledIds.has(c.id));
```

### Lazy Load Dashboard

```javascript
// Load dashboard data only when needed
document.addEventListener('DOMContentLoaded', () => {
  if (UserSession.isLoggedIn()) {
    loadUserDashboard(); // Async load
  }
});
```

---

## Extending the System

### Add New User Fields

1. **Backend (server.js):**
```javascript
const user = {
  id: userId,
  name: name,
  email: email,
  password: password,
  phone: phone,          // NEW
  profileImage: image,   // NEW
  createdAt: new Date()
};
```

2. **Frontend:**
```javascript
localStorage.setItem('userPhone', phone);
// Use UserSession.getPhone() after adding method
```

### Add User Profile Editing

```javascript
// New endpoint
app.put('/api/user/profile', authenticateUser, (req, res) => {
  const { name, phone, profileImage } = req.body;
  const user = users.get(req.userId);
  Object.assign(user, { name, phone, profileImage });
  res.json({ success: true, user });
});
```

### Add Course Progress Tracking

```javascript
// Modify enrollments storage
const userProgress = new Map(); // userId -> { courseId -> progress }

// Track lesson completion
app.post('/api/course/:courseId/lesson/:lessonId/complete', 
  authenticateUser, (req, res) => {
    // Update progress
  }
);
```

---

## Production Migration Checklist

- [ ] Set up database (MongoDB/PostgreSQL)
- [ ] Migrate user data schema
- [ ] Implement password hashing
- [ ] Switch to JWT tokens
- [ ] Add input validation
- [ ] Add rate limiting
- [ ] Configure CORS
- [ ] Set up HTTPS
- [ ] Add environment variables
- [ ] Implement real payment processor
- [ ] Add monitoring/logging
- [ ] Test all endpoints
- [ ] Load test the system

---

## Quick Start for New Developers

1. **Understand the flow:**
   - Read `IMPLEMENTATION_SUMMARY.md` for overview

2. **Review the code:**
   - Start with `server.js` for backend architecture
   - Check `user-session.js` for utility classes
   - Study `dashboard.js` for frontend integration

3. **Test locally:**
   - Start server: `npm start`
   - Test signup at `/login`
   - View dashboard at `/dashboard`
   - Test course enrollment

4. **Make changes:**
   - Always use `UserSession` and `CourseEnrollment` classes
   - Follow existing patterns
   - Add comments for complex logic

---

For detailed API documentation, see `USER_COMPONENTS_GUIDE.md`  
For implementation overview, see `IMPLEMENTATION_SUMMARY.md`
