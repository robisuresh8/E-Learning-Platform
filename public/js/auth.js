// JavaScript for Authentication Pages

document.addEventListener('DOMContentLoaded', () => {
    setupAuthToggle();
    setupFormHandlers();
});

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
    
    // Simulate login (in a real app, this would make an API call)
    console.log('Login attempt:', { email, remember: !!remember });
    
    // Show success message
    showMessage('Welcome back! Redirecting...', 'success');
    
    // Simulate redirect after a delay
    setTimeout(() => {
        window.location.href = '/';
    }, 1500);
}

// Handle signup form submission
function handleSignup(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const terms = formData.get('terms');
    
    if (!terms) {
        showMessage('Please agree to the Terms of Service and Privacy Policy', 'error');
        return;
    }
    
    // Simulate signup (in a real app, this would make an API call)
    console.log('Signup attempt:', { name, email });
    
    // Show success message
    showMessage('Account created successfully! Redirecting...', 'success');
    
    // Simulate redirect after a delay
    setTimeout(() => {
        window.location.href = '/';
    }, 1500);
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
