// ==============================
// CORSO E-LEARNING - MAIN APPLICATION
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
        icon: '💻',
        image: '/images/Webdev.jpg'
    },
    {
        title: 'Data Science & Analytics',
        level: 'Intermediate',
        description: 'Learn Python, pandas, and data visualization techniques.',
        duration: '10 min',
        rating: '4.7',
        price: '₹1,999',
        icon: '📊',
        image: '/images/Data.jpg'
    },
    {
        title: 'Digital Marketing Pro',
        level: 'Beginner',
        description: 'SEO, social media marketing, and content strategies.',
        duration: '10 min',
        rating: '4.6',
        price: '₹1,749',
        icon: '📱',
        image: '/images/Digital.jpg'
    },
    {
        title: 'Cloud Computing with AWS',
        level: 'Intermediate',
        description: 'Deploy and manage applications on Amazon Web Services.',
        duration: '10 min',
        rating: '4.8',
        price: '₹2,249',
        icon: '☁️',
        image: '/images/Cloud.jpg'
    },
    {
        title: 'Project Management Mastery',
        level: 'Advanced',
        description: 'PMBOK essentials and agile methodologies.',
        duration: '10 min',
        rating: '4.9',
        price: '₹2,749',
        icon: '📈',
        image: '/images/project.png'
    },
    {
        title: 'Advanced React.js',
        level: 'Advanced',
        description: 'Deep dive into React hooks, context, and state management.',
        duration: '10 min',
        rating: '4.9',
        price: '₹2,499',
        icon: '⚛️',
        image: '/images/React.jpg'
    }
];

function loadCourses() {
    const coursesList = document.getElementById('coursesList');
    const coursesGrid = document.getElementById('coursesGrid');
    
    const container = coursesList || coursesGrid;
    
    if (!container) return;
    
    container.innerHTML = coursesData.map(course => `
        <div class="col-md-6 col-lg-4">
            <div class="course-card-wrapper">
                <div class="course-card">
                    <div class="first-content">
                        <img src="${course.image}" alt="${course.title}" class="course-card-image" loading="lazy" />
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
                <div class="course-card-label">${course.title}</div>
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

// Text rotation animation for hero title
function initTextRotation() {
    const textRotate = document.querySelector('.gradient-text-rotate');
    if (!textRotate) return;
  
    const items = Array.from(textRotate.querySelectorAll('.text-rotate-item'));
    if (items.length < 2) return;
  
    let currentIndex = items.findIndex(i => i.classList.contains('active'));
    if (currentIndex < 0) currentIndex = 0;
  
    const DURATION = 300;   // must match CSS transition (ms)
    const INTERVAL = 1500;  // rotation speed
  
    // Ensure only one active on load
    items.forEach((el, idx) => {
      el.classList.toggle('active', idx === currentIndex);
      el.classList.remove('leaving');
    });
  
    setInterval(() => {
      if (document.hidden) return;

      const current = items[currentIndex];
      const nextIndex = (currentIndex + 1) % items.length;
      const next = items[nextIndex];
  
      current.classList.remove('active');
      current.classList.add('leaving');
  
      next.classList.remove('leaving');
  
      // next frame → smooth transition in
      requestAnimationFrame(() => next.classList.add('active'));
  
      // cleanup leaving class after animation
      setTimeout(() => current.classList.remove('leaving'), DURATION);
  
      currentIndex = nextIndex;
    }, INTERVAL);
  }

// Animate hero stats
function animateHeroStats() {
    const statNumbers = document.querySelectorAll('.hero-stat-item .stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        let current = 0;
        const increment = target / 30;
        const duration = 1500;
        const stepTime = duration / 30;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target;
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current);
            }
        }, stepTime);
    });
}

// Set certificate date
function setCertificateDate() {
    const dateEl = document.getElementById('certDateShowcase');
    if (dateEl) {
        const today = new Date();
        dateEl.textContent = today.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
}

// Decorative random shapes behind hero image
function initHeroImageShapes() {
    const host = document.querySelector('.hero-image-shapes');
    if (!host) return;
    if (host.dataset.ready === 'true') return;
    // If we have static shapes in HTML, don't generate random ones
    if (host.dataset.static === 'true') {
        host.dataset.ready = 'true';
        return;
    }

    const palette = ['#FF6B35', '#FFD23F', '#FF6B9D', '#FFE66D'];
    const types = ['circle', 'squircle', 'triangle', 'ring'];

    const isMobile = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
    const count = isMobile ? 14 : 20;

    const rand = (min, max) => Math.random() * (max - min) + min;
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const container = host.closest('.hero-visual-container') || host.parentElement;
    const frame = document.querySelector('.hero-mahila-frame');
    const img = document.querySelector('.hero-mahila-image');
    if (!container || !frame || !img) return;

    // If image isn't loaded yet, wait then retry (so bounds are correct)
    if (!img.complete) {
        img.addEventListener('load', () => {
            host.dataset.ready = 'false';
            initHeroImageShapes();
        }, { once: true });
        return;
    }

    const containerRect = container.getBoundingClientRect();
    const imageRect = frame.getBoundingClientRect();
    const w = containerRect.width;
    const h = containerRect.height;
    if (!w || !h) return;

    // Exclusion zone = image bounds + padding so shapes never sit on it
    const pad = isMobile ? 20 : 32;
    const exLeft = (imageRect.left - containerRect.left) - pad;
    const exTop = (imageRect.top - containerRect.top) - pad;
    const exRight = (imageRect.right - containerRect.left) + pad;
    const exBottom = (imageRect.bottom - containerRect.top) + pad;

    // Start clean (in case of hot reload / partial renders)
    host.innerHTML = '';

    const isInExclusion = (xPx, yPx, radiusPx) => {
        const l = exLeft - radiusPx;
        const t = exTop - radiusPx;
        const r = exRight + radiusPx;
        const b = exBottom + radiusPx;
        return xPx >= l && xPx <= r && yPx >= t && yPx <= b;
    };

    // Even distribution: grid across container, skipping cells intersecting exclusion
    const aspect = w / h;
    const cols = Math.max(4, Math.ceil(Math.sqrt(count * aspect)));
    const rows = Math.max(4, Math.ceil(count / cols));
    const cellW = w / cols;
    const cellH = h / rows;
    const candidates = [];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cx = (c + 0.5) * cellW;
            const cy = (r + 0.5) * cellH;
            candidates.push({ cx, cy });
        }
    }

    // Shuffle candidates
    for (let i = candidates.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }

    const placements = [];
    const jitterX = cellW * 0.22;
    const jitterY = cellH * 0.22;

    for (let i = 0; i < count; i++) {
        const type = pick(types);
        const color = pick(palette);

        const size = rand(isMobile ? 20 : 26, isMobile ? 56 : 84);
        const radius = size / 2;

        // Find next candidate outside exclusion, with jitter
        let placed = false;
        while (candidates.length && !placed) {
            const spot = candidates.pop();
            let xPx = spot.cx + rand(-jitterX, jitterX);
            let yPx = spot.cy + rand(-jitterY, jitterY);

            // Clamp into container
            xPx = Math.max(radius, Math.min(w - radius, xPx));
            yPx = Math.max(radius, Math.min(h - radius, yPx));

            if (isInExclusion(xPx, yPx, radius)) continue;
            placements.push({ xPx, yPx, size, type, color });
            placed = true;
        }

        if (!placed) break;
    }

    // Fallback: if exclusion removed too many grid cells, try random rejection sampling
    let attempts = 0;
    while (placements.length < count && attempts < 400) {
        attempts++;
        const type = pick(types);
        const color = pick(palette);
        const size = rand(isMobile ? 20 : 26, isMobile ? 56 : 84);
        const radius = size / 2;
        const xPx = rand(radius, w - radius);
        const yPx = rand(radius, h - radius);
        if (isInExclusion(xPx, yPx, radius)) continue;
        placements.push({ xPx, yPx, size, type, color });
    }

    for (let i = 0; i < placements.length; i++) {
        const { xPx, yPx, size, type, color } = placements[i];

        const el = document.createElement('span');

        const x = (xPx / w) * 100;
        const y = (yPx / h) * 100;

        const rotate = `${Math.round(rand(-35, 35))}deg`;
        const duration = `${rand(7, 14).toFixed(2)}s`;
        const delay = `${(-rand(0, 8)).toFixed(2)}s`;

        // Higher opacity - more visible
        const baseOpacity = type === 'ring' ? 0.28 : 0.38;
        const opacity = Math.max(0.25, Math.min(0.50, baseOpacity + rand(-0.08, 0.08)));

        el.className = `hero-shape hero-shape--${type}`;
        el.style.setProperty('--x', `${x}%`);
        el.style.setProperty('--y', `${y}%`);
        el.style.setProperty('--s', `${size}px`);
        el.style.setProperty('--r', rotate);
        el.style.setProperty('--d', duration);
        el.style.setProperty('--delay', delay);
        el.style.setProperty('--c', color);
        el.style.setProperty('--o', String(opacity));

        host.appendChild(el);
    }

    host.dataset.ready = 'true';
}

// Rotate certificate course names
function rotateCertificateCourses() {
    const courseEl = document.getElementById('certCourseRotate');
    if (!courseEl) return;
    
    const courses = [
        'Web Development Mastery',
        'Data Science Fundamentals',
        'Digital Marketing Pro',
        'Cloud Computing Expert',
        'AI & Machine Learning'
    ];
    
    let currentIndex = 0;
    setInterval(() => {
        courseEl.style.opacity = '0';
        courseEl.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % courses.length;
            courseEl.textContent = courses[currentIndex];
            courseEl.style.opacity = '1';
            courseEl.style.transform = 'translateY(0)';
        }, 100);
    }, 1750);
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initTextRotation();
    animateHeroStats();
    setCertificateDate();
    rotateCertificateCourses();
    
    // Add scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.hero-content-wrapper, .hero-visual-wrapper').forEach(el => {
        observer.observe(el);
    });
});