// Admin Control Panel JavaScript
// ================================

// Check admin authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    setupMenuListeners();
    loadDashboardData();
});

// ==================== AUTHENTICATION ====================

function checkAdminAuth() {
    const adminToken = localStorage.getItem('adminToken');
    
    if (!adminToken) {
        window.location.href = '/admin-login.html';
    }
}

function adminLogout() {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin-login.html';
}

// ==================== MENU NAVIGATION ====================

function setupMenuListeners() {
    const menuLinks = document.querySelectorAll('.menu-link');
    
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const sectionId = this.dataset.section;
            switchSection(sectionId);
            
            // Update active menu link
            menuLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function switchSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show selected section
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.remove('hidden');
        
        // Load section data
        if (sectionId === 'users') loadUsers();
        else if (sectionId === 'courses') loadCourses();
        else if (sectionId === 'enrollments') loadEnrollments();
        else if (sectionId === 'payments') loadPayments();
        else if (sectionId === 'logs') loadLogs();
        else if (sectionId === 'dashboard') loadDashboardData();
    }
}

// ==================== DASHBOARD ====================

async function loadDashboardData() {
    try {
        const token = localStorage.getItem('adminToken');
        
        // Get all data from backend
        const response = await fetch('/api/admin/stats', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to fetch stats');
        
        const data = await response.json();
        
        // Update stats cards
        document.getElementById('totalUsers').textContent = data.totalUsers || 0;
        document.getElementById('totalCourses').textContent = data.totalCourses || 0;
        document.getElementById('totalEnrollments').textContent = data.totalEnrollments || 0;
        document.getElementById('totalRevenue').textContent = '₹' + (data.totalRevenue || 0).toLocaleString('en-IN');
        
    } catch (error) {
        console.error('Dashboard error:', error);
        showAlert('Error loading dashboard data', 'error');
    }
}

// ==================== USERS MANAGEMENT ====================

async function loadUsers() {
    try {
        const token = localStorage.getItem('adminToken');
        
        const response = await fetch('/api/admin/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to fetch users');
        
        const users = await response.json();
        let html = '<table class="data-table"><thead><tr><th>ID</th><th>Email</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead><tbody>';
        
        users.forEach((user, index) => {
            html += `
                <tr>
                    <td>#${index + 1}</td>
                    <td>${user.email}</td>
                    <td><span class="badge badge-success">Active</span></td>
                    <td>${new Date(user.createdAt || Date.now()).toLocaleDateString()}</td>
                    <td>
                        <button class="btn-control" style="width: auto; padding: 6px 12px;" onclick="editUser('${user.id}')">Edit</button>
                    </td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        document.getElementById('usersList').innerHTML = users.length > 0 ? html : '<p>No users found</p>';
        
    } catch (error) {
        console.error('Users error:', error);
        showAlert('Error loading users', 'error');
    }
}

function editUser(userId) {
    alert('Edit user feature coming soon. User ID: ' + userId);
}

// ==================== COURSES MANAGEMENT ====================

async function loadCourses() {
    try {
        const token = localStorage.getItem('adminToken');
        
        const response = await fetch('/api/admin/courses', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to fetch courses');
        
        const courses = await response.json();
        let html = '<table class="data-table"><thead><tr><th>Course</th><th>Price</th><th>Enrolled</th><th>Status</th><th>Actions</th></tr></thead><tbody>';
        
        courses.forEach((course, index) => {
            html += `
                <tr>
                    <td>${course.name || 'Course ' + (index + 1)}</td>
                    <td>₹${(course.price || 0).toLocaleString('en-IN')}</td>
                    <td>${course.enrollmentCount || 0}</td>
                    <td><span class="badge badge-success">Active</span></td>
                    <td>
                        <button class="btn-control" style="width: auto; padding: 6px 12px;" onclick="editCourse('${course.id}')">Edit</button>
                    </td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        document.getElementById('coursesList').innerHTML = courses.length > 0 ? html : '<p>No courses found</p>';
        
    } catch (error) {
        console.error('Courses error:', error);
        showAlert('Error loading courses', 'error');
    }
}

async function addCourse() {
    const name = document.getElementById('courseName').value;
    const description = document.getElementById('courseDescription').value;
    const price = document.getElementById('coursePrice').value;
    
    if (!name || !description || !price) {
        showAlert('Please fill all fields', 'error');
        return;
    }
    
    try {
        const token = localStorage.getItem('adminToken');
        
        const response = await fetch('/api/admin/courses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name,
                description,
                price: parseInt(price)
            })
        });
        
        if (!response.ok) throw new Error('Failed to add course');
        
        showAlert('Course added successfully!', 'success');
        
        // Clear form
        document.getElementById('courseName').value = '';
        document.getElementById('courseDescription').value = '';
        document.getElementById('coursePrice').value = '';
        
        // Reload courses
        loadCourses();
        
    } catch (error) {
        console.error('Add course error:', error);
        showAlert('Error adding course', 'error');
    }
}

function editCourse(courseId) {
    alert('Edit course feature coming soon. Course ID: ' + courseId);
}

// ==================== ENROLLMENTS MANAGEMENT ====================

async function loadEnrollments() {
    try {
        const token = localStorage.getItem('adminToken');
        
        const response = await fetch('/api/admin/enrollments', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to fetch enrollments');
        
        const enrollments = await response.json();
        let html = '<table class="data-table"><thead><tr><th>User</th><th>Course</th><th>Enrolled Date</th><th>Progress</th><th>Status</th></tr></thead><tbody>';
        
        enrollments.forEach((enrollment, index) => {
            html += `
                <tr>
                    <td>User #${enrollment.userId}</td>
                    <td>${enrollment.courseName || 'Course ' + enrollment.courseId}</td>
                    <td>${new Date(enrollment.enrolledDate || Date.now()).toLocaleDateString()}</td>
                    <td>
                        <div style="width: 100px; height: 8px; background: #e9ecef; border-radius: 4px; overflow: hidden;">
                            <div style="width: ${enrollment.progress || 0}%; height: 100%; background: #667eea;"></div>
                        </div>
                    </td>
                    <td><span class="badge badge-success">Active</span></td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        document.getElementById('enrollmentsList').innerHTML = enrollments.length > 0 ? html : '<p>No enrollments found</p>';
        
    } catch (error) {
        console.error('Enrollments error:', error);
        showAlert('Error loading enrollments', 'error');
    }
}

// ==================== PAYMENTS MANAGEMENT ====================

async function loadPayments() {
    try {
        const token = localStorage.getItem('adminToken');
        
        const response = await fetch('/api/admin/payments', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to fetch payments');
        
        const payments = await response.json();
        let html = '<table class="data-table"><thead><tr><th>User</th><th>Amount</th><th>Course</th><th>Date</th><th>Status</th></tr></thead><tbody>';
        
        payments.forEach((payment, index) => {
            html += `
                <tr>
                    <td>User #${payment.userId}</td>
                    <td>₹${(payment.amount || 0).toLocaleString('en-IN')}</td>
                    <td>${payment.courseName || 'Course ' + payment.courseId}</td>
                    <td>${new Date(payment.date || Date.now()).toLocaleDateString()}</td>
                    <td><span class="badge badge-success">Completed</span></td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        document.getElementById('paymentsList').innerHTML = payments.length > 0 ? html : '<p>No payments found</p>';
        
    } catch (error) {
        console.error('Payments error:', error);
        showAlert('Error loading payments', 'error');
    }
}

// ==================== LOGS & ANALYTICS ====================

async function loadLogs() {
    try {
        const token = localStorage.getItem('adminToken');
        
        const response = await fetch('/api/admin/logs', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to fetch logs');
        
        const logs = await response.json();
        let html = '<table class="data-table"><thead><tr><th>Timestamp</th><th>Event</th><th>User</th><th>Details</th></tr></thead><tbody>';
        
        logs.slice(0, 50).forEach((log, index) => {
            html += `
                <tr>
                    <td>${new Date(log.timestamp || Date.now()).toLocaleString()}</td>
                    <td>${log.event || 'System Event'}</td>
                    <td>${log.userId || 'System'}</td>
                    <td>${log.details || 'N/A'}</td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        document.getElementById('logsList').innerHTML = logs.length > 0 ? html : '<p>No logs found</p>';
        
    } catch (error) {
        console.error('Logs error:', error);
        showAlert('Error loading logs', 'error');
    }
}

// ==================== SETTINGS ====================

function saveSettings() {
    const platformName = document.getElementById('platformName').value;
    const supportEmail = document.getElementById('supportEmail').value;
    const maxUpload = document.getElementById('maxUpload').value;
    
    localStorage.setItem('settings', JSON.stringify({
        platformName,
        supportEmail,
        maxUpload
    }));
    
    showAlert('Settings saved successfully!', 'success');
}

// ==================== BACKUP ====================

async function backupData() {
    try {
        const token = localStorage.getItem('adminToken');
        
        const response = await fetch('/api/admin/backup', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to create backup');
        
        const data = await response.json();
        
        // Create downloadable JSON file
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `elearning-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        showAlert('Backup downloaded successfully!', 'success');
        
    } catch (error) {
        console.error('Backup error:', error);
        showAlert('Error creating backup', 'error');
    }
}

// ==================== UTILITIES ====================

function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    document.querySelector('.admin-content').insertBefore(alertDiv, document.querySelector('.admin-header').nextElementSibling);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}
