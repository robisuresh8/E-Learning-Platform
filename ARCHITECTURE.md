# System Architecture & Data Model

## Overall Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  HTML Pages:           JavaScript Modules:                          │
│  ├─ index.html         ├─ auth.js (auth functionality)             │
│  ├─ login.html         ├─ courses.js (course listing)              │
│  ├─ courses.html       ├─ course.js (course detail)                │
│  ├─ course.html        ├─ checkout.js (payment)                    │
│  ├─ checkout.html      ├─ dashboard.js (user dashboard)            │
│  ├─ dashboard.html     ├─ main.js (navigation setup)               │
│  └─ others...          ├─ user-session.js (utilities)              │
│                        └─ others...                                 │
│                                                                      │
│  Local Storage:                                                     │
│  ├─ sessionToken (authentication)                                   │
│  ├─ userId                                                          │
│  ├─ userName                                                        │
│  └─ userEmail                                                       │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                    HTTP/HTTPS REST API Calls
                                  │
┌─────────────────────────────────────────────────────────────────────┐
│                          API GATEWAY LAYER                          │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐      ┌──────────────────────┐             │
│  │ Route Parser        │      │ Middleware Stack     │             │
│  │ ├─ Auth Routes      │      │ ├─ CORS              │             │
│  │ ├─ User Routes      │      │ ├─ JSON Parser       │             │
│  │ ├─ Course Routes    │      │ ├─ Auth Middleware   │             │
│  │ ├─ Payment Routes   │      │ └─ Error Handler     │             │
│  │ └─ Dashboard Routes │      └──────────────────────┘             │
│  └─────────────────────┘                                           │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                                  │
┌─────────────────────────────────────────────────────────────────────┐
│                      BUSINESS LOGIC LAYER                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Authentication Service:                                            │
│  ├─ User registration                                              │
│  ├─ User login/logout                                              │
│  ├─ Session token validation                                       │
│  └─ Password verification                                          │
│                                                                      │
│  Enrollment Service:                                                │
│  ├─ Check enrollment status                                        │
│  ├─ Get enrolled courses                                           │
│  ├─ Grant content access                                           │
│  └─ Track enrollments                                              │
│                                                                      │
│  Payment Service:                                                   │
│  ├─ Process payment                                                │
│  ├─ Validate payment data                                          │
│  ├─ Generate certificate                                           │
│  └─ Enroll user                                                    │
│                                                                      │
│  Course Service:                                                    │
│  ├─ List courses                                                   │
│  ├─ Get course details                                             │
│  ├─ Get course content                                             │
│  └─ Validate access rights                                         │
│                                                                      │
│  Dashboard Service:                                                 │
│  ├─ Get user profile                                               │
│  ├─ Get enrollments summary                                        │
│  ├─ Calculate progress                                             │
│  └─ Get stats                                                      │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                                  │
┌─────────────────────────────────────────────────────────────────────┐
│                        DATA LAYER (In-Memory)                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Users Database:                                                    │
│  Map<userId, User>                                                 │
│  └─ { id, name, email, password, createdAt }                       │
│                                                                      │
│  Sessions Database:                                                │
│  Map<sessionToken, userId>                                         │
│  └─ Token → User mapping                                           │
│                                                                      │
│  Enrollments Database:                                             │
│  Map<userId, courseIds[]>                                          │
│  └─ Which courses each user is enrolled in                         │
│                                                                      │
│  Courses Database:                                                 │
│  Array<Course>                                                     │
│  └─ { id, title, description, lessons, price, ... }               │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Data Model

### User Object
```javascript
{
  id: "user_1234567890",           // Unique identifier
  name: "John Doe",                // User full name
  email: "john@example.com",       // Unique email
  password: "hashed_password",     // (Should be hashed in production)
  createdAt: Date,                 // Account creation date
  enrolledCourses: []              // Will be fetched from enrollments map
}
```

### Session Token
```javascript
{
  token: "token_abc123xyz",
  userId: "user_1234567890",
  expiresAt: Date,                 // (Add in production)
  ipAddress: "192.168.1.1"         // (Add in production for security)
}
```

### Course Enrollment
```javascript
{
  userId: "user_1234567890",
  courseIds: [1, 3, 5],            // Courses user is enrolled in
  enrolledAt: [Date, Date, Date],  // (Track enrollment dates)
  progress: [45, 0, 100],          // (Track progress percentage)
  completedAt: [null, null, Date]  // (Completion dates)
}
```

### Course Object
```javascript
{
  id: 1,                           // Unique course ID
  title: "Web Development",        // Course name
  description: "Learn HTML...",    // Course description
  duration: "8 weeks",             // Course duration
  level: "Beginner",               // Difficulty level
  instructor: "Sarah Chen",        // Instructor name
  image: "🌐",                     // Course icon/emoji
  students: 12500,                 // Enrollment count
  rating: 4.8,                     // Course rating
  price: "₹2,499",                 // Course price
  lessons: [                       // Course lessons
    {
      title: "Introduction",
      duration: "45 min",
      content: "...",              // (Add in production)
      videoUrl: "https://...",     // (Add in production)
      resources: [...]             // (Add in production)
    }
  ]
}
```

---

## API Request/Response Flow

### Authentication Flow

```
┌─────────────────┐
│  Client         │
│  (Browser)      │
└────────┬────────┘
         │ POST /api/auth/login
         │ { email, password }
         │
         ▼
┌─────────────────────────────────┐
│ Express Route Handler           │
│ app.post('/api/auth/login')     │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Validate Credentials            │
│ ├─ Find user by email           │
│ ├─ Compare password             │
│ └─ Return 401 if invalid        │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Generate Session Token          │
│ ├─ Create token                 │
│ ├─ Store in sessions map        │
│ └─ Get user data                │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Return Response                 │
│ {                               │
│   success: true,                │
│   sessionToken: "...",          │
│   userId: "...",                │
│   user: {...}                   │
│ }                               │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────┐
│  Client         │
│  ├─ Store token │
│  ├─ Store user  │
│  └─ Redirect    │
└─────────────────┘
```

### Course Access Flow

```
┌─────────────────┐
│  Client         │
│  Visits /course │
└────────┬────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ JavaScript loads course data         │
│ GET /api/courses/1                   │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ Get course (public - no auth needed) │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ Check if user is logged in           │
│ if (UserSession.isLoggedIn())        │
└────────┬─────────────────────────────┘
         │
    ┌────┴────┐
    │          │
 YES│          │NO
    │          │
    ▼          ▼
┌──────┐  ┌───────────────┐
│Check │  │ Show purchase │
│Enroll.  │ button only   │
└───┬──┘  └───────────────┘
    │
    ├──ENROLLED──┐
    │            │
 YES│            │NO
    │            │
    ▼            ▼
┌────────────┐ ┌──────────────┐
│Show course │ │Show "Enroll &│
│content     │ │Purchase" btn │
└────────────┘ └──────────────┘
```

### Payment & Enrollment Flow

```
┌─────────────────┐
│  User clicks    │
│  "Enroll"       │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│ User logged in?                 │
│ ├─ NO → Redirect to /login      │
│ └─ YES → Continue               │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Navigate to checkout page       │
│ /checkout?courseId=1&userId=... │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ User fills payment form         │
│ └─ Email, payment method, etc.  │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ POST /api/process-payment       │
│ {                               │
│   courseId: 1,                  │
│   userId: "user_...",           │
│   amount: 2499,                 │
│   email: "...",                 │
│   paymentMethod: "..."          │
│ }                               │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Validate payment data           │
│ └─ Check all required fields    │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Process payment (simulate)      │
│ └─ In production: call Stripe   │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ If payment successful:          │
│ ├─ Generate certificate ID      │
│ ├─ Add course to user's         │
│ │  enrollments                  │
│ └─ Return success response      │
└────────┬────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Client receives response         │
│ ├─ certificateId: "Corso-..."    │
│ ├─ enrolled: true                │
│ └─ redirectUrl: "/certificate?id=..." 
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Redirect to certificate page    │
│ └─ User is now enrolled!         │
└──────────────────────────────────┘
```

---

## Security Model

### Authentication

```
┌────────────────────────────────────────┐
│ 1. Initial Login                       │
│    User → Browser → POST /api/auth/login
└────────────────────────────────────────┘
                   ↓
┌────────────────────────────────────────┐
│ 2. Server Validates                    │
│    ├─ Find user by email               │
│    ├─ Check password match             │
│    └─ Generate session token           │
└────────────────────────────────────────┘
                   ↓
┌────────────────────────────────────────┐
│ 3. Token Storage                       │
│    localStorage.sessionToken = "token" │
└────────────────────────────────────────┘
                   ↓
┌────────────────────────────────────────┐
│ 4. Authenticated API Call              │
│    headers: {                          │
│      Authorization: "Bearer token"     │
│    }                                   │
└────────────────────────────────────────┘
                   ↓
┌────────────────────────────────────────┐
│ 5. Server Validation                   │
│    authenticateUser middleware:        │
│    ├─ Extract token from header        │
│    ├─ Look up in sessions map          │
│    ├─ Get userId from sessions        │
│    ├─ Attach userId to req            │
│    └─ If invalid → 401 error          │
└────────────────────────────────────────┘
```

### Authorization (Access Control)

```
User requests course content:
GET /api/user/course/1/content
Header: Authorization: Bearer token_xyz

         ↓

Check if course exists:
course = courses.find(c => c.id == 1)
if (!course) → return 404

         ↓

Check if user is enrolled:
enrolledCourses = userEnrollments.get(userId)
if (!enrolledCourses.includes(1)) 
  → return 403 "Access denied"

         ↓

Grant access:
return { course: course, accessGranted: true }
```

---

## State Management

### Client-Side State

```
┌─────────────────────────────────────┐
│      Browser localStorage            │
├─────────────────────────────────────┤
│                                     │
│ sessionToken      ─────────────────→ API Auth
│ userId            ─────────────────→ Identify User
│ userName          ─────────────────→ Display UI
│ userEmail         ─────────────────→ Show Profile
│ rememberMe        ─────────────────→ Auto-login
│                                     │
└─────────────────────────────────────┘
         ↑                    ↑
         │    UPDATE ON      │
         │    - Login        │
         │    - Signup       │
         │    - Session      │
         │    - Logout       │
```

### Server-Side State

```
┌──────────────────────────────────┐
│   Map: users                      │
│   Key: userId                     │
│   Value: User object              │
│   ├─ Persists user data           │
│   └─ Used for login verification  │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│   Map: sessions                   │
│   Key: token                      │
│   Value: userId                   │
│   ├─ Maps token to user           │
│   ├─ Used for auth middleware    │
│   └─ Cleared on logout            │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│   Map: userEnrollments            │
│   Key: userId                     │
│   Value: [courseId, ...]          │
│   ├─ Tracks enrollments           │
│   ├─ Used for access control     │
│   └─ Updated after payment        │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│   Array: courses                  │
│   ├─ Course catalog               │
│   ├─ Static data                  │
│   └─ No modifications              │
└──────────────────────────────────┘
```

---

## Error Handling Flow

```
┌─────────────────────────────────┐
│ API Request                     │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Validation Errors               │
│ ├─ 400 Bad Request              │
│ ├─ Missing fields               │
│ └─ Invalid data format          │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Authentication Errors           │
│ ├─ 401 Unauthorized             │
│ ├─ No token provided            │
│ ├─ Invalid token                │
│ └─ Expired session              │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Authorization Errors            │
│ ├─ 403 Forbidden                │
│ ├─ Not enrolled in course       │
│ ├─ Insufficient permissions     │
│ └─ Access denied                │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Resource Errors                 │
│ ├─ 404 Not Found                │
│ ├─ User not found               │
│ ├─ Course not found             │
│ └─ Resource deleted             │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Conflict Errors                 │
│ ├─ 409 Conflict                 │
│ ├─ User already exists          │
│ ├─ Duplicate enrollment         │
│ └─ Duplicate resource           │
└─────────────────────────────────┘

         ↓
         
┌─────────────────────────────────┐
│ Client Error Handler            │
│ ├─ Parse error message          │
│ ├─ Show user-friendly message   │
│ └─ Suggest corrective action    │
└─────────────────────────────────┘
```

---

## Scalability Considerations

### Current (In-Memory)
- ✅ Quick development
- ✅ Easy testing
- ❌ Data lost on server restart
- ❌ Single server only
- ❌ Limited to available RAM

### For Production

**Add Database Layer:**
```
Server ← ORM (Sequelize/Mongoose) ← Database
  ↓                                      ↑
  └──────────────────────────────────────┘
```

**Add Caching Layer:**
```
Server ← Cache (Redis) ← Database
  ↓           ↑
  │     Fast access
  └─ Store sessions, user data
```

**Add Load Balancing:**
```
Load Balancer
     ↙  ↓  ↖
Server Server Server ─ Shared Database
```

---

## Deployment Architecture

```
Production Environment:

┌─────────────────────────────────────────┐
│          Client (Browser)               │
└────────┬────────────────────────────────┘
         │ HTTPS
         ▼
┌─────────────────────────────────────────┐
│      Load Balancer (Nginx/HAProxy)      │
└────────┬────────────────────────────────┘
         │
    ┌────┼────┐
    ▼    ▼    ▼
 ┌────┬──────┬────┐
 │App │ App  │App │  (Multiple instances)
 │Srv │ Srv  │Srv │
 └────┴──────┴────┘
    │    │    │
    └────┼────┘
         ▼
   ┌──────────────┐
   │  Database    │
   │ (PostgreSQL) │
   └──────────────┘
         ▲
         │
   ┌──────────────┐
   │  Cache       │
   │  (Redis)     │
   └──────────────┘
         ▲
         │
   ┌──────────────┐
   │   Storage    │
   │   (S3)       │
   └──────────────┘
```

---

For implementation details, refer to `IMPLEMENTATION_SUMMARY.md`  
For API documentation, refer to `USER_COMPONENTS_GUIDE.md`  
For developer guide, refer to `DEVELOPER_REFERENCE.md`
