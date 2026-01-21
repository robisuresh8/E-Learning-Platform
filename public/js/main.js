// ==============================
// ICTRD LEARNING - MAIN APPLICATION
// ==============================

document.addEventListener('DOMContentLoaded', function() {
    setupUserSession();
    loadCourses();
    smoothScroll();
    initScrollAnimations();
    initializeCertificateDate();
});

// ==============================
// SCROLL ANIMATIONS
// ==============================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    document.querySelectorAll(
        '.section-title, .section-subtitle, .feature-card, .stat-item, ' +
        '.course-card-hover, .tool-card, .cta-section, .hero, .btn-hero'
    ).forEach(el => {
        observer.observe(el);
    });
}

// ==============================
// USER SESSION MANAGEMENT
// ==============================

function setupUserSession() {
    const token = localStorage.getItem('sessionToken');
    const userName = localStorage.getItem('userName');
    
    const userIndicator = document.getElementById('userIndicator');
    const authButtons = document.getElementById('authButtons');
    
    if (token && userIndicator && authButtons) {
        // Hide login/signup buttons
        authButtons.style.display = 'none';
        
        // Show user menu
        userIndicator.style.display = 'flex';
        const userNameEl = userIndicator.querySelector('#userName');
        if (userNameEl) {
            userNameEl.textContent = userName || 'User';
        }
    }
}

function logoutUser() {
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    window.location.href = '/';
}

// Attach logout to button
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', logoutUser);
}

// ==============================
// COURSE LOADING & DISPLAY
// ==============================

const coursesData = [
    {
        title: 'Web Development Fundamentals',
        level: 'Beginner',
        description: 'Master HTML, CSS, and JavaScript basics in just 10 minutes.',
        duration: '10 min',
        rating: '4.8',
        price: '₹1,499',
        icon: '💻'
    },
    {
        title: 'Advanced React.js',
        level: 'Advanced',
        description: 'Deep dive into React hooks, context, and state management.',
        duration: '10 min',
        rating: '4.9',
        price: '₹2,499',
        icon: '⚛️'
    },
    {
        title: 'Data Science Essentials',
        level: 'Intermediate',
        description: 'Learn Python, pandas, and data visualization techniques.',
        duration: '10 min',
        rating: '4.7',
        price: '₹1,999',
        icon: '📊'
    },
    {
        title: 'Cloud Computing with AWS',
        level: 'Intermediate',
        description: 'Deploy and manage applications on Amazon Web Services.',
        duration: '10 min',
        rating: '4.8',
        price: '₹2,249',
        icon: '☁️'
    },
    {
        title: 'Digital Marketing Pro',
        level: 'Beginner',
        description: 'SEO, social media marketing, and content strategies.',
        duration: '10 min',
        rating: '4.6',
        price: '₹1,749',
        icon: '📱'
    },
    {
        title: 'Project Management Mastery',
        level: 'Advanced',
        description: 'PMBOK essentials and agile methodologies.',
        duration: '10 min',
        rating: '4.9',
        price: '₹2,749',
        icon: '📈'
    }
];

function loadCourses() {
    const coursesList = document.getElementById('coursesList');
    const coursesGrid = document.getElementById('coursesGrid');
    
    const container = coursesList || coursesGrid;
    
    if (!container) return;
    
    container.innerHTML = coursesData.map(course => `
        <div class="col-md-6 col-lg-4">
            <div class="course-card">
                <div class="first-content">
                    <div class="course-icon-display">${course.icon}</div>
                    <h3 class="course-card-title">${course.title}</h3>
                </div>
                <div class="second-content">
                    <div class="course-back-info">
                        <span class="course-badge">${course.level}</span>
                        <p class="course-back-description">${course.description}</p>
                        <div class="course-back-meta">
                            <span><i class="fas fa-clock"></i> ${course.duration}</span>
                            <span><i class="fas fa-star"></i> ${course.rating}</span>
                        </div>
                        <div class="course-back-footer">
                            <span class="price-tag">${course.price}</span>
                            <a href="/login" class="btn-enroll">Enroll Now</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// ==============================
// SMOOTH SCROLLING
// ==============================

function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ==============================
// CERTIFICATE DATE INITIALIZATION
// ==============================

function initializeCertificateDate() {
    const certDateElement = document.getElementById('certDate');
    if (certDateElement) {
        const today = new Date();
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        const formattedDate = today.toLocaleDateString('en-US', options);
        certDateElement.textContent = formattedDate;
    }
}
