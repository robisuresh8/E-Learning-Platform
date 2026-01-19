// Set current date in certificate preview
document.addEventListener('DOMContentLoaded', () => {
    const currentDateEl = document.getElementById('current-date');
    if (currentDateEl) {
        const today = new Date();
        currentDateEl.textContent = today.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
    
    // Initialize all animations and interactions
    initializePageAnimations();
    loadExternalAssets();
    animateHeroStats();
    setupStepCardAnimations();
    setupTiltEffect();
    
    // Existing functions...
    loadCourses();
    setupSmoothScrolling();
    setupScrollAnimations();
    setupParallaxEffects();
    setupButtonAnimations();
    setupStatsCounter();
    setupNavActiveState();
    setupHeroLottie();
    setupIntersectionObserver();
});

// Load external assets (Bootstrap Icons & Lottie)
function loadExternalAssets() {
    // Bootstrap Icons
    if (!document.querySelector('link[href*="bootstrap-icons"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css';
        document.head.appendChild(link);
    }
    // Lottie Player
    if (!document.querySelector('script[src*="lottie-player"]')) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js';
        document.head.appendChild(script);
    }
}

// Initialize all page animations
function initializePageAnimations() {
    // Add hover effects to interactive elements
    setupInteractiveElements();
    
    // Setup scroll-based animations
    observeScrollElements();
    
    // Initialize particle effects
    initializeParticleEffects();
}

// Setup interactive elements with enhanced effects
function setupInteractiveElements() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Course cards with enhanced hover
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(250, 129, 18, 0.3)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });
}

// Observe elements for scroll animations
function observeScrollElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideInUp 0.8s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    const elementsToObserve = document.querySelectorAll(
        '.feature-card, .step-card, .stat-card, .course-card, .testimonial-card'
    );
    elementsToObserve.forEach(el => observer.observe(el));
}

// Initialize particle effects background
function initializeParticleEffects() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Optional: Add subtle particle effects
    // This can be expanded for more complex animations
}

// Setup intersection observer for scroll animations
function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            } else {
                entry.target.classList.remove('in-view');
            }
        });
    }, {
        threshold: 0.1
    });
    
    document.querySelectorAll('[data-animate]').forEach(el => {
        observer.observe(el);
    });
}

// Animate hero stats counter
function animateHeroStats() {
    const statValues = document.querySelectorAll('.hero-stats .stat-value');
    
    statValues.forEach((stat, index) => {
        const target = parseInt(stat.getAttribute('data-target'));
        let current = 0;
        const increment = target / 30;
        
        // Stagger animation starts
        setTimeout(() => {
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, 50);
        }, index * 150);
    });
}

// Animate step cards on scroll
function setupStepCardAnimations() {
    const stepCards = document.querySelectorAll('.step-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }, index * 200);
            }
        });
    }, { threshold: 0.3 });
    
    stepCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px) scale(0.9)';
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(card);
    });
}

// ... rest of existing JavaScript functions remain the same
// Load courses from API
async function loadCourses() {
    try {
        const response = await fetch('/api/courses');
        const courses = await response.json();
        displayCourses(courses);
    } catch (error) {
        console.error('Error loading courses:', error);
        document.getElementById('coursesGrid').innerHTML = 
            '<p style="text-align: center; color: var(--text-secondary);">Unable to load courses. Please try again later.</p>';
    }
}

// Display courses in the grid
function displayCourses(courses) {
    const coursesGrid = document.getElementById('coursesGrid');
    
    if (!coursesGrid) return;
    
    coursesGrid.innerHTML = courses.map(course => {
        let displayPrice = course.price;
        if (displayPrice && !String(displayPrice).includes('₹')) {
            displayPrice = String(displayPrice).replace('$', '₹');
            if (!displayPrice.includes('₹')) displayPrice = '₹' + displayPrice;
        }
        return `
        <div class="course-card">
            <div class="course-card-header">
                <span style="font-size: 56px; display: block; margin-bottom: 8px;">${course.image}</span>
                <div class="cert-quick-badge">
                    <i class="bi bi-hourglass-end"></i>
                    <span>Under 10 min</span>
                </div>
            </div>
            <div class="course-card-content">
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <div class="course-meta-icons" style="display: flex; gap: 15px; margin-top: 10px; color: var(--text-secondary); font-size: 13px;">
                    <span><i class="bi bi-clock-history" style="color: var(--primary-bright);"></i> ${course.duration || '10 min'}</span>
                    <span><i class="bi bi-bar-chart-fill" style="color: var(--primary-bright);"></i> ${course.level || 'Beginner'}</span>
                </div>
            </div>
            <div class="course-card-footer">
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                    <span class="course-price-tag">${displayPrice}</span>
                    <a href="/course?id=${course.id}" class="course-cta-btn">
                        Get Certified
                    </a>
                </div>
            </div>
        </div>
    `}).join('');
    
    // Animate course cards on load
    animateCourseCards();
}

// Animate course cards with staggered fade-in and enhanced effects
function animateCourseCards() {
    const cards = document.querySelectorAll('.course-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px) scale(0.9)';
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
            card.classList.add('visible');
        }, index * 120);
    });
}

// Setup smooth scrolling for anchor links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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

// Add scroll effect to header
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
        header.style.background = '#222222';
    } else {
        header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
        header.style.background = '#222222';
    }
    
    lastScroll = currentScroll;
});

// Setup scroll animations
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Setup Hero Lottie Animation
function setupHeroLottie() {
    const heroVisual = document.querySelector('.hero-right-visual');
    if (heroVisual) {
        // Replace static content with Lottie
        heroVisual.innerHTML = `
            <lottie-player 
                src="https://lottie.host/embed/9868c074-6057-46a4-9254-2e0507637537/Pj1Q8Q8Q8Q.json" 
                background="transparent" 
                speed="1" 
                style="width: 100%; height: 100%;" 
                loop autoplay>
            </lottie-player>
        `;
    }
}

// Setup parallax effects
function setupParallaxEffects() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const floatingCards = document.querySelectorAll('.floating-card');
        const featureCards = document.querySelectorAll('.feature-card');
        const statCards = document.querySelectorAll('.stat-card');
        
        // Removed hero transform to prevent collision with next section
        
        floatingCards.forEach((card, index) => {
            const speed = 0.1 + (index * 0.05);
            const rotation = scrolled * 0.02;
            card.style.transform = `translateY(${scrolled * speed}px) rotate(${rotation}deg)`;
        });
        
        featureCards.forEach((card, index) => {
            const speed = 0.05 + (index % 3) * 0.02;
            const yPos = scrolled * speed;
            if (yPos < 100) {
                card.style.transform = `translateY(${yPos}px)`;
            }
        });
        
        statCards.forEach((card, index) => {
            const speed = 0.03 + (index % 4) * 0.01;
            const yPos = scrolled * speed;
            if (yPos < 50) {
                card.style.transform = `translateY(${yPos}px)`;
            }
        });
    });
}

// Enhanced button animations
function setupButtonAnimations() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    
    buttons.forEach(button => {
        // Ripple effect on click
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
        
        // Magnetic effect on hover
        button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.05)`;
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0) scale(1)';
        });
    });
    
    // Add ripple animation CSS
    if (!document.getElementById('button-ripple-style')) {
        const style = document.createElement('style');
        style.id = 'button-ripple-style';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Animated stats counter
function setupStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateValue(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

function animateValue(element) {
    const text = element.textContent;
    const match = text.match(/(\d+\.?\d*)/);
    if (!match) return;
    
    const target = parseFloat(match[1]);
    const suffix = text.replace(match[0], '');
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 16);
}

// Custom cursor effects
function setupCursorEffects() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        width: 20px;
        height: 20px;
        border: 2px solid var(--primary-bright);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        display: none;
    `;
    document.body.appendChild(cursor);
    
    // Show cursor on desktop only
    if (window.matchMedia('(min-width: 768px)').matches) {
        cursor.style.display = 'block';
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
        });
        
        // Hover effects
        const interactiveElements = document.querySelectorAll('a, button, .course-card, .feature-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
                cursor.style.borderColor = 'var(--secondary-bright)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursor.style.borderColor = 'var(--primary-bright)';
            });
        });
    }
}

// Particle effects for hero section
function setupParticleEffects() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        opacity: 0.3;
        z-index: 0;
    `;
    hero.style.position = 'relative';
    hero.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
    
    const particles = [];
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5 + 0.2
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 212, 255, ${particle.opacity})`;
            ctx.fill();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    });
}

// Set active navigation state based on current page
function setupNavActiveState() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '/' && href === '/')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// 3D Tilt Effect for Glass Cards
function setupTiltEffect() {
    const cards = document.querySelectorAll('.glass-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg rotation
            const rotateY = ((x - centerX) / centerX) * 5;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}
