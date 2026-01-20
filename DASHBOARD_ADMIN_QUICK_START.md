# Dashboard & Admin Quick Access Guide

## For End Users: Accessing Your Dashboard

### Step 1: Login to the Platform
1. Go to **http://localhost:3000/login.html**
2. Enter your email and password
3. Click **"Login"** button

### Step 2: Locate Dashboard Button
After successful login, you'll see your navigation bar updated with:
- **Your Name** (displayed with 👤 icon)
- **📊 Dashboard button** (highlighted with gradient background)
- **🚪 Logout button**

### Step 3: Click Dashboard
Click the **"📊 Dashboard"** button to access your personal dashboard.

### Dashboard Features
Your dashboard shows:
- ✅ **Profile Information** - Your account details
- 📚 **Enrolled Courses** - All courses you've purchased
- 📊 **Learning Progress** - Completion percentage for each course
- 📜 **Certificates** - Certificates earned from completed courses
- 📈 **Statistics** - Overall learning analytics

---

## For Administrators: Accessing Control Panel

### Step 1: Access Admin Login
Navigate to: **http://localhost:3000/admin-login.html**

### Step 2: Use Demo Credentials
- **Email:** `admin@elearning.com`
- **Password:** `admin123`

**Note:** These credentials are for demonstration. In production, use secure admin credentials.

### Step 3: Enter Admin Panel
After login, you'll be redirected to the Admin Control Panel at **/admin.html**

---

## Admin Control Panel Overview

### Sidebar Navigation
The left sidebar contains quick access to:

1. **📊 Dashboard** - System overview and stats
2. **👥 Users** - Manage user accounts
3. **📚 Courses** - Create and manage courses
4. **✏️ Enrollments** - Track course enrollments
5. **💳 Payments** - View transaction history
6. **⚙️ Settings** - Configure platform settings
7. **📋 Logs** - View system activity logs

### Dashboard Overview Section
Displays 4 key metrics:
- **👥 Total Users** - Number of registered users
- **📚 Total Courses** - Number of available courses
- **✏️ Total Enrollments** - Total course enrollments
- **💰 Revenue** - Total revenue generated

### Quick Actions
- **➕ Add New Course** - Create a new course
- **👤 View Users** - Manage user accounts
- **💾 Backup Data** - Export system data
- **📊 Analytics** - View system analytics

---

## Complete Admin Features

### 1. User Management (👥 Users)
**What you can do:**
- View all registered users
- See user email addresses
- Check user join dates
- Monitor active user accounts
- Edit user profiles (future feature)

**Table Columns:**
| Column | Details |
|--------|---------|
| ID | User identification number |
| Email | User email address |
| Status | Account status (Active/Inactive) |
| Joined | Date user registered |
| Actions | Edit/manage user |

### 2. Course Management (📚 Courses)
**What you can do:**
- Create new courses
- View all existing courses
- Edit course details
- Track course enrollments
- Manage course pricing

**Add a New Course:**
1. Go to **📚 Courses** section
2. Fill in the form:
   - Course name
   - Description
   - Price (in rupees)
3. Click **"Add Course"** button
4. Course will appear in the list below

**Existing Courses Table:**
| Column | Details |
|--------|---------|
| Course | Course title |
| Price | Course price in ₹ |
| Enrolled | Number of students |
| Status | Active/Inactive |
| Actions | Edit course |

### 3. Enrollment Management (✏️ Enrollments)
**View:**
- Which users are enrolled in which courses
- Enrollment dates
- Student progress percentage
- Course completion status

**Progress Tracking:**
- Visual progress bar (0-100%)
- Real-time updates
- Performance metrics

### 4. Payment Management (💳 Payments)
**Monitor:**
- All payment transactions
- Amount paid by each user
- Which course was purchased
- Transaction dates
- Payment status

**Transaction Details:**
| Info | Purpose |
|------|---------|
| User | Which user made payment |
| Amount | Payment amount in ₹ |
| Course | Which course was purchased |
| Date | Transaction date |
| Status | Completed/Pending/Failed |

### 5. Settings (⚙️ Settings)
**Configure:**
- Platform name
- Support email address
- Maximum file upload size
- Other platform preferences

**To Save Settings:**
1. Update desired fields
2. Click **"Save Settings"** button
3. Settings stored in browser (localStorage)

### 6. System Logs (📋 Logs)
**View:**
- User login/logout events
- Course enrollment events
- Payment processing events
- Certificate generation events
- System activities

**Log Information:**
| Field | Details |
|-------|---------|
| Timestamp | When event occurred |
| Event | Type of event |
| User | Which user triggered it |
| Details | Additional information |

### 7. Data Backup (💾 Backup)
**To Backup System Data:**
1. Click **"Backup"** button on Dashboard
2. Complete system data downloads as JSON file
3. File named: `elearning-backup-YYYY-MM-DD.json`

**Contains:**
- All user accounts
- Course information
- Enrollment records
- Session data

---

## Testing the Connection Between Frontend & Backend

### Method 1: Through Admin Panel
1. **Add a Test Course**
   - Go to Courses
   - Add: "Test Course" | "Testing backend connection" | 999
   - Click "Add Course"
   - Verify course appears in list

2. **Check User Statistics**
   - Go to Dashboard
   - Verify "Total Users" count
   - Go to Users section
   - Confirm user list matches

3. **Verify Enrollments**
   - Go to Enrollments
   - Confirm all enrolled users show with correct courses
   - Check progress calculations

4. **Test Payment Tracking**
   - Simulate payment via checkout
   - Go to Payments section
   - Verify transaction appears with correct amount

### Method 2: Via Browser Console

```javascript
// 1. Check if admin is logged in
const adminToken = localStorage.getItem('adminToken');
console.log('Admin Token:', adminToken);

// 2. Test API connection to stats endpoint
fetch('/api/admin/stats', {
  headers: { Authorization: 'Bearer ' + adminToken }
})
.then(r => r.json())
.then(data => console.log('Stats:', data));

// 3. Check all users
fetch('/api/admin/users', {
  headers: { Authorization: 'Bearer ' + adminToken }
})
.then(r => r.json())
.then(users => console.log('Users:', users));

// 4. Check all courses
fetch('/api/admin/courses', {
  headers: { Authorization: 'Bearer ' + adminToken }
})
.then(r => r.json())
.then(courses => console.log('Courses:', courses));

// 5. Check enrollments
fetch('/api/admin/enrollments', {
  headers: { Authorization: 'Bearer ' + adminToken }
})
.then(r => r.json())
.then(enrollments => console.log('Enrollments:', enrollments));
```

---

## API Endpoints Reference

### Authentication
```
POST /api/admin/login
```
Login with admin credentials

### Statistics
```
GET /api/admin/stats
```
Get dashboard statistics

### Users
```
GET /api/admin/users
```
Get all users list

### Courses
```
GET /api/admin/courses
POST /api/admin/courses
```
Get courses or add new course

### Enrollments
```
GET /api/admin/enrollments
```
Get all enrollments

### Payments
```
GET /api/admin/payments
```
Get payment history

### Logs
```
GET /api/admin/logs
```
Get system logs

### Backup
```
POST /api/admin/backup
```
Create system backup

---

## Troubleshooting

### "Dashboard button not showing after login?"
**Solution:**
- Refresh the page (Ctrl+F5)
- Check if sessionToken exists: `localStorage.getItem('sessionToken')`
- Try logging out and logging back in

### "Can't access /admin-login.html?"
**Solution:**
- Verify server is running: `node server.js`
- Check port 3000 is available
- Clear browser cache (Ctrl+Shift+Delete)

### "Admin login credentials not working?"
**Solution:**
- Use exact credentials:
  - Email: `admin@elearning.com`
  - Password: `admin123`
- Check for typos (case-sensitive)
- Clear localStorage: `localStorage.clear()`

### "Dashboard shows 0 for all stats?"
**Solution:**
- This is normal for new installation
- Try adding courses and enrolling users
- Stats will update in real-time

### "Added course but doesn't show?"
**Solution:**
- Refresh Courses section
- Check browser console for errors (F12)
- Verify all required fields were filled

### "Can't see user in Users section?"
**Solution:**
- Users appear after they create account
- Ensure user completed signup
- Try logging in with test user account

---

## Quick Reference

### Login URLs
- **User Login:** http://localhost:3000/login.html
- **Admin Login:** http://localhost:3000/admin-login.html

### Dashboard URLs
- **User Dashboard:** http://localhost:3000/dashboard
- **Admin Panel:** http://localhost:3000/admin.html

### Demo Accounts

**Admin Account:**
- Email: `admin@elearning.com`
- Password: `admin123`

**To Create User Account:**
1. Go to /login.html
2. Click "Sign up" link
3. Fill in email and password
4. Click "Sign up" button
5. Automatically logged in

### Feature Availability

| Feature | Admin | User |
|---------|-------|------|
| Dashboard | ✅ | ✅ |
| Course List | ✅ | ✅ |
| Enroll Course | ❌ | ✅ |
| Add Course | ✅ | ❌ |
| View Users | ✅ | ❌ |
| View Payments | ✅ | ❌ |
| View Logs | ✅ | ❌ |

---

## Next Steps

1. **For Users:**
   - Create your account at /login.html
   - Browse available courses
   - Enroll in a course
   - Access your dashboard to track progress

2. **For Admins:**
   - Login to admin panel
   - Add test courses
   - Monitor user enrollments
   - Review system statistics
   - Backup important data

3. **For Developers:**
   - Review API documentation
   - Test all endpoints
   - Implement additional features
   - Deploy to production

---

**Need Help?**
Refer to: ADMIN_DOCUMENTATION.md for detailed technical information.

**Version:** 1.0  
**Last Updated:** 2024  
**Status:** Ready to Use
