// Dashboard - User Profile and Course Management

document.addEventListener('DOMContentLoaded', () => {
    setupUserSession();
    checkUserSession();
    loadUserDashboard();
});

// Setup user session display in navbar
function setupUserSession() {
    const token = localStorage.getItem('sessionToken');
    const userName = localStorage.getItem('userName');
    const userIndicator = document.getElementById('userIndicator');
    
    if (token && userIndicator) {
        // User is logged in - show user menu
        userIndicator.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <span style="color: #fa8112; font-weight: 500;">👤 ${userName}</span>
                <a href="/dashboard" style="color: #fa8112; text-decoration: none; font-weight: 500; transition: color 0.3s;">📊 Dashboard</a>
                <a href="#" onclick="logoutUser(event)" style="color: #ff6b6b; text-decoration: none; font-weight: 500; transition: color 0.3s;">🚪 Logout</a>
            </div>
        `;
    }
}

// Logout user
function logoutUser(event) {
    event.preventDefault();
    
    const token = localStorage.getItem('sessionToken');
    
    // Call logout API
    fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        // Clear local storage
        localStorage.clear();
        
        // Redirect to login
        window.location.href = '/login';
    })
    .catch(error => {
        console.error('Logout error:', error);
        // Still clear local storage and redirect
        localStorage.clear();
        window.location.href = '/login';
    });
}

// Check if user is logged in
function checkUserSession() {
    const token = localStorage.getItem('sessionToken');
    if (!token) {
        // Redirect to login if not authenticated
        window.location.href = '/login';
        return;
    }
}

// Load user dashboard data
function loadUserDashboard() {
    const token = localStorage.getItem('sessionToken');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const userId = localStorage.getItem('userId');
    
    // Update user greeting
    document.getElementById('userGreeting').textContent = `Welcome back, ${userName}!`;
    document.getElementById('userEmail').textContent = `Email: ${userEmail}`;
    document.getElementById('profileName').textContent = userName;
    document.getElementById('profileEmail').textContent = userEmail;
    
    // Fetch dashboard data from server
    fetch('/api/user/dashboard', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load dashboard');
        }
        return response.json();
    })
    .then(data => {
        displayDashboard(data);
    })
    .catch(error => {
        console.error('Error loading dashboard:', error);
        document.getElementById('coursesContainer').innerHTML = 
            '<p style="grid-column: 1/-1; text-align: center; color: #ff6b6b;">Error loading dashboard. Please try again.</p>';
    });
}

// Display dashboard data
function displayDashboard(data) {
    const dashboard = data.dashboard;
    const enrolledCourses = dashboard.enrolledCourses;
    
    // Update stats
    document.getElementById('enrolledCount').textContent = dashboard.totalEnrolledCourses;
    
    // Calculate completed and in-progress
    const completed = enrolledCourses.filter(c => c.progress === 100).length;
    const inProgress = enrolledCourses.filter(c => c.progress < 100 && c.progress > 0).length;
    
    document.getElementById('completedCount').textContent = completed;
    document.getElementById('inProgressCount').textContent = inProgress;
    document.getElementById('profileCourses').textContent = dashboard.totalEnrolledCourses;
    
    // Format join date
    const joinDate = new Date(data.user.createdAt || new Date());
    document.getElementById('profileJoined').textContent = joinDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
    
    // Display courses
    if (enrolledCourses.length === 0) {
        displayNoCourses();
    } else {
        displayCourses(enrolledCourses);
    }
}

// Display "no courses" message
function displayNoCourses() {
    document.getElementById('coursesContainer').innerHTML = `
        <div class="no-courses" style="grid-column: 1/-1;">
            <p>You haven't enrolled in any courses yet.</p>
            <button class="btn-explore" onclick="window.location.href='/courses'">Explore Courses</button>
        </div>
    `;
}

// Display enrolled courses
function displayCourses(courses) {
    const coursesContainer = document.getElementById('coursesContainer');
    
    coursesContainer.innerHTML = courses.map(course => `
        <div class="enrolled-course-card">
            <div class="course-header">
                <span class="course-icon">📚</span>
                <div class="course-title">${course.title}</div>
                <div class="course-instructor">by ${course.instructor}</div>
            </div>
            <div class="course-body">
                <div class="course-meta">
                    <span>📖 ${course.lessons} lessons</span>
                    <span>✓ ${course.completedLessons} completed</span>
                </div>
                
                <div class="progress-section">
                    <div class="progress-label">
                        <span>Progress</span>
                        <span>${course.progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${course.progress}%;"></div>
                    </div>
                </div>
                
                <div class="course-actions">
                    <button class="btn-continue" onclick="continueCourse(${course.id})">Continue Learning</button>
                    <button class="btn-details" onclick="viewCourseDetails(${course.id})">Details</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Continue course - navigate to course content
function continueCourse(courseId) {
    window.location.href = `/course/${courseId}`;
}

// View course details
function viewCourseDetails(courseId) {
    window.location.href = `/course/${courseId}`;
}

// Logout user
function logout() {
    const token = localStorage.getItem('sessionToken');
    
    // Call logout API
    fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        // Clear local storage
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('rememberMe');
        
        // Redirect to login
        window.location.href = '/login';
    })
    .catch(error => {
        console.error('Logout error:', error);
        // Still clear local storage and redirect
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('rememberMe');
        window.location.href = '/login';
    });
}
