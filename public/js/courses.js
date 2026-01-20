// JavaScript for Courses Page

document.addEventListener('DOMContentLoaded', () => {
    checkUserAuthentication();
    loadCourses();
    setupFilters();
});

// Check if user is logged in
function checkUserAuthentication() {
    const token = localStorage.getItem('sessionToken');
    const userName = localStorage.getItem('userName');
    const userIndicator = document.getElementById('userIndicator');
    
    if (token && userIndicator) {
        userIndicator.innerHTML = `<span style="color: var(--accent); margin-left: 10px;">👤 ${userName}</span>`;
    }
}

// Load courses from API
async function loadCourses() {
    try {
        const response = await fetch('/api/courses');
        const courses = await response.json();
        await enrichCoursesWithEnrollmentStatus(courses);
        displayCourses(courses);
        window.allCourses = courses; // Store for filtering
    } catch (error) {
        console.error('Error loading courses:', error);
        document.getElementById('coursesGrid').innerHTML = 
            '<p style="text-align: center; color: var(--text-secondary); grid-column: 1/-1;">Unable to load courses. Please try again later.</p>';
    }
}

// Add enrollment status to each course
async function enrichCoursesWithEnrollmentStatus(courses) {
    const token = localStorage.getItem('sessionToken');
    
    for (let course of courses) {
        course.isEnrolled = false;
        
        if (token) {
            try {
                const response = await fetch(`/api/user/enrolled/${course.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    course.isEnrolled = data.isEnrolled;
                }
            } catch (error) {
                console.error(`Error checking enrollment for course ${course.id}:`, error);
            }
        }
    }
}

// Display courses in the grid
function displayCourses(courses) {
    const coursesGrid = document.getElementById('coursesGrid');
    
    if (!coursesGrid) return;
    
    coursesGrid.innerHTML = courses.map(course => {
        const enrollmentStatus = course.isEnrolled ? '<span style="color: #2d5a3d; font-weight: bold;">✓ Enrolled</span>' : '';
        
        return `
        <div class="course-card fade-in" data-level="${course.level.toLowerCase()}">
            <span class="course-icon">${course.image}</span>
            <h3>${course.title}</h3>
            <p>${course.description}</p>
            <div class="course-meta">
                <div class="meta-item">
                    <span>⏱</span>
                    <i class="bi bi-clock"></i>
                    <span>${course.duration}</span>
                </div>
                <div class="meta-item">
                    <span>📊</span>
                    <i class="bi bi-bar-chart"></i>
                    <span>${course.level}</span>
                </div>
                <div class="meta-item">
                    <span>👤</span>
                    <i class="bi bi-person"></i>
                    <span>${course.instructor}</span>
                </div>
            </div>
            ${enrollmentStatus ? `<div style="margin-top: 10px; padding: 8px; background: rgba(45, 90, 61, 0.1); border-radius: 6px; text-align: center;">${enrollmentStatus}</div>` : ''}
            <a href="/course/${course.id}" class="btn-primary">View Course</a>
        </div>
    `;
    }).join('');
    
    // Animate course cards on load
    animateCourseCards();
}

// Setup filter buttons
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter courses
            const filter = btn.getAttribute('data-filter');
            filterCourses(filter);
        });
    });
}

// Filter courses by level
function filterCourses(filter) {
    const cards = document.querySelectorAll('.course-card');
    
    cards.forEach(card => {
        const level = card.getAttribute('data-level');
        
        if (filter === 'all' || level === filter) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, 10);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px) scale(0.95)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// Animate course cards with staggered fade-in
function animateCourseCards() {
    const cards = document.querySelectorAll('.course-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('visible');
            // Trigger scroll animation
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(card);
        }, index * 100);
    });
}
