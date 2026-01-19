// Course Detail Page - Certification Focus
// Handles course loading, display, and payment initiation

let courseData = null;

document.addEventListener('DOMContentLoaded', () => {
    loadCourseData();
    setCurrentDate();
});

// Load course data from URL parameters
function loadCourseData() {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');
    
    if (!courseId) {
        window.location.href = '/courses';
        return;
    }
    
    // Fetch course from server
    fetch('/api/courses/' + courseId)
        .then(response => response.json())
        .then(course => {
            courseData = course;
            populateCourseContent();
        })
        .catch(err => {
            console.error('Error loading course:', err);
            window.location.href = '/courses';
        });
}

// Populate page with course content
function populateCourseContent() {
    if (!courseData) return;
    
    // Update page title and headers
    document.title = courseData.title + ' - ICTRD LEARNING';
    document.getElementById('courseTitle').textContent = courseData.title;
    document.getElementById('courseHeading').textContent = courseData.title;
    document.getElementById('courseDescription').textContent = courseData.description;
    document.getElementById('courseLevel').textContent = courseData.level;
    document.getElementById('coursePrice').textContent = courseData.price.replace('₹', '').replace('$', '');
    document.getElementById('certCourse').textContent = courseData.title;
    document.getElementById('courseFullDescription').textContent = courseData.description;
}

// Set current date in certificate preview
function setCurrentDate() {
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    document.getElementById('certDate').textContent = dateStr;
}

// Initiate payment and certification process
function initiateCertification() {
    if (!courseData) {
        alert('Loading course information...');
        return;
    }
    
    // Extract numeric price from string (handles both ₹2,499 and $99 formats)
    const priceNumeric = parseFloat(courseData.price.replace(/[₹,]/g, ''));
    
    // Create payment session
    const paymentData = {
        courseId: courseData.id,
        title: courseData.title,
        price: priceNumeric,
        priceDisplay: courseData.price,
        level: courseData.level,
        timestamp: new Date().toISOString()
    };
    
    // Store in session storage for payment page
    sessionStorage.setItem('pendingCertification', JSON.stringify(paymentData));
    
    // Redirect to payment checkout
    redirectToPayment(paymentData);
}

// Redirect to payment processor
function redirectToPayment(paymentData) {
    const checkoutUrl = `/checkout?courseId=${paymentData.courseId}&title=${encodeURIComponent(paymentData.title)}&price=${paymentData.price}`;
    window.location.href = checkoutUrl;
}
                </div>
            </div>
        </div>
        
        <div class="course-detail-content">
            <h2>Course Curriculum</h2>
            <div class="lessons-list">
                ${lessonsHTML}
            </div>
        </div>
        
        <div class="enroll-section">
            <h3>Ready to Start Learning?</h3>
            <p>Enroll now and begin your journey with this comprehensive course.</p>
            <a href="/login" class="btn-primary">Enroll Now</a>
        </div>
    `;
    
    // Animate lesson items
    animateLessons();
}

// Animate lesson items on load
function animateLessons() {
    const lessons = document.querySelectorAll('.lesson-item');
    lessons.forEach((lesson, index) => {
        lesson.style.opacity = '0';
        lesson.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            lesson.style.transition = 'all 0.4s ease';
            lesson.style.opacity = '1';
            lesson.style.transform = 'translateX(0)';
        }, index * 100);
    });
}
