// JavaScript for Authentication Pages

document.addEventListener('DOMContentLoaded', () => {
    setupAuthToggle();
    setupFormHandlers();
    checkExistingSession();
});

// Check if user already has an active session
function checkExistingSession() {
    const token = localStorage.getItem('sessionToken');
    if (token) {
        // User is already logged in
        // Show option to go to dashboard or continue with login
        // For now, don't redirect - let user choose
        // window.location.href = '/';
    }
}

// Toggle between login and signup forms
function setupAuthToggle() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginCard = loginForm?.closest('.auth-card');
    const signupCard = document.getElementById('signupCard');
    const signupToggle = document.getElementById('signupToggle');
    const loginToggle = document.getElementById('loginToggle');
    
    if (signupToggle) {
        signupToggle.addEventListener('click', (e) => {
            e.preventDefault();
            if (loginCard) loginCard.style.display = 'none';
            if (signupCard) signupCard.style.display = 'block';
        });
    }
    
    if (loginToggle) {
        loginToggle.addEventListener('click', (e) => {
            e.preventDefault();
            if (loginCard) loginCard.style.display = 'block';
            if (signupCard) signupCard.style.display = 'none';
        });
    }
}

// Setup form submission handlers
function setupFormHandlers() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember');
    
    if (!email || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';
    
    // Make API call to login
    fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Store session token and user info
            localStorage.setItem('sessionToken', data.sessionToken);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('userName', data.user.name);
            localStorage.setItem('userEmail', data.user.email);
            
            if (remember) {
                localStorage.setItem('rememberMe', 'true');
            }
            
            showMessage('Welcome back! Redirecting...', 'success');
            
            // Redirect to dashboard after a delay (or home if not available)
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1500);
        } else {
            showMessage(data.error || 'Login failed', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    })
    .catch(error => {
        console.error('Login error:', error);
        showMessage('An error occurred. Please try again.', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    });
}

// Handle signup form submission
function handleSignup(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const terms = formData.get('terms');
    
    if (!name || !email || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    if (!terms) {
        showMessage('Please agree to the Terms of Service and Privacy Policy', 'error');
        return;
    }
    
    // Validate email format
    if (!email.includes('@')) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating Account...';
    
    // Make API call to signup
    fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Store session token and user info
            localStorage.setItem('sessionToken', data.sessionToken);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('userName', data.user.name);
            localStorage.setItem('userEmail', data.user.email);
            
            showMessage('Account created successfully! Redirecting...', 'success');
            
            // Redirect to dashboard after a delay
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1500);
        } else {
            showMessage(data.error || 'Signup failed', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    })
    .catch(error => {
        console.error('Signup error:', error);
        showMessage('An error occurred. Please try again.', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    });
}

// Show message to user
function showMessage(text, type = 'success') {
    // Remove existing message if any
    const existingMessage = document.querySelector('.auth-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const message = document.createElement('div');
    message.className = `auth-message auth-message-${type}`;
    message.textContent = text;
    message.style.cssText = `
        padding: 16px 20px;
        border-radius: 12px;
        margin-bottom: 24px;
        font-size: 15px;
        text-align: center;
        animation: fadeInUp 0.4s ease;
        ${type === 'success' 
            ? 'background: rgba(168, 213, 186, 0.2); color: #2d5a3d; border: 1px solid rgba(168, 213, 186, 0.4);'
            : 'background: rgba(255, 182, 193, 0.2); color: #8b3a3a; border: 1px solid rgba(255, 182, 193, 0.4);'
        }
    `;
    
    // Insert message at the top of the form
    const form = document.querySelector('.auth-form');
    if (form) {
        form.insertBefore(message, form.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            message.style.transition = 'opacity 0.3s ease';
            message.style.opacity = '0';
            setTimeout(() => message.remove(), 300);
        }, 5000);
    }
}
