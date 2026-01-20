// User Authentication and Session Utilities

// User session management
class UserSession {
    static isLoggedIn() {
        return !!localStorage.getItem('sessionToken');
    }

    static getToken() {
        return localStorage.getItem('sessionToken');
    }

    static getUserId() {
        return localStorage.getItem('userId');
    }

    static getUserName() {
        return localStorage.getItem('userName');
    }

    static getUserEmail() {
        return localStorage.getItem('userEmail');
    }

    static setSession(sessionToken, userId, userName, userEmail) {
        localStorage.setItem('sessionToken', sessionToken);
        localStorage.setItem('userId', userId);
        localStorage.setItem('userName', userName);
        localStorage.setItem('userEmail', userEmail);
    }

    static clearSession() {
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('rememberMe');
    }

    static getAuthHeader() {
        const token = this.getToken();
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }
}

// Course enrollment management
class CourseEnrollment {
    static async checkIfEnrolled(courseId) {
        if (!UserSession.isLoggedIn()) {
            return false;
        }

        try {
            const response = await fetch(`/api/user/enrolled/${courseId}`, {
                headers: UserSession.getAuthHeader()
            });

            if (response.ok) {
                const data = await response.json();
                return data.isEnrolled;
            }
            return false;
        } catch (error) {
            console.error('Error checking enrollment:', error);
            return false;
        }
    }

    static async getEnrolledCourses() {
        if (!UserSession.isLoggedIn()) {
            return [];
        }

        try {
            const response = await fetch('/api/user/enrolled-courses', {
                headers: UserSession.getAuthHeader()
            });

            if (response.ok) {
                const data = await response.json();
                return data.enrolledCourses;
            }
            return [];
        } catch (error) {
            console.error('Error loading enrolled courses:', error);
            return [];
        }
    }

    static async getCourseContent(courseId) {
        if (!UserSession.isLoggedIn()) {
            throw new Error('Not authenticated');
        }

        try {
            const response = await fetch(`/api/user/course/${courseId}/content`, {
                headers: UserSession.getAuthHeader()
            });

            if (response.ok) {
                const data = await response.json();
                return data.course;
            } else if (response.status === 403) {
                throw new Error('You must enroll in this course to view its content');
            } else {
                throw new Error('Failed to load course content');
            }
        } catch (error) {
            console.error('Error loading course content:', error);
            throw error;
        }
    }

    static async processCoursePayment(courseId, amount, email, paymentMethod, userId) {
        try {
            const response = await fetch('/api/process-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...UserSession.getAuthHeader()
                },
                body: JSON.stringify({
                    courseId: courseId,
                    amount: amount,
                    email: email,
                    paymentMethod: paymentMethod,
                    userId: userId
                })
            });

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Payment processing failed');
            }
        } catch (error) {
            console.error('Payment error:', error);
            throw error;
        }
    }
}

// Page protection utility
class PageProtection {
    static requireLogin() {
        if (!UserSession.isLoggedIn()) {
            window.location.href = '/login';
            return false;
        }
        return true;
    }

    static requireCourseAccess(courseId) {
        if (!UserSession.isLoggedIn()) {
            window.location.href = '/login';
            return false;
        }

        // Check enrollment on the page that uses this
        // This should be called after loading course data
        return true;
    }
}

// Helper function to update user indicator
function updateUserIndicator() {
    const userIndicator = document.getElementById('userIndicator');
    
    if (!userIndicator) return;
    
    const token = UserSession.getToken();
    const userName = UserSession.getUserName();
    
    if (token && userName) {
        userIndicator.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <span style="color: var(--accent); font-weight: 500;">👤 ${userName}</span>
                <a href="/dashboard" style="color: var(--text-primary); text-decoration: none; font-weight: 500; transition: color 0.3s;">Dashboard</a>
                <a href="#" onclick="handleLogout(event)" style="color: #ff6b6b; text-decoration: none; font-weight: 500; transition: color 0.3s;">Logout</a>
            </div>
        `;
    } else {
        userIndicator.innerHTML = `
            <div style="display: flex; gap: 10px;">
                <a href="/login" class="btn-primary" style="padding: 8px 16px; font-size: 13px;">Login</a>
            </div>
        `;
    }
}

// Handle logout
function handleLogout(event) {
    event.preventDefault();
    
    const token = UserSession.getToken();
    
    fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        UserSession.clearSession();
        window.location.href = '/login';
    })
    .catch(error => {
        console.error('Logout error:', error);
        UserSession.clearSession();
        window.location.href = '/login';
    });
}

// Initialize user UI on page load
function initializeUserUI() {
    document.addEventListener('DOMContentLoaded', () => {
        updateUserIndicator();
    });
}

// Call this on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateUserIndicator);
} else {
    updateUserIndicator();
}
