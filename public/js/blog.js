// JavaScript for Blog Page

document.addEventListener('DOMContentLoaded', () => {
    setupBlogAnimations();
    setupCardInteractions();
    setupParallaxEffects();
    setupSearchFunctionality();
});

// Setup blog card animations
function setupBlogAnimations() {
    const blogCards = document.querySelectorAll('.blog-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                    entry.target.classList.add('visible');
                }, index * 150);
            }
        });
    }, { threshold: 0.1 });

    blogCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px) scale(0.95)';
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(card);
    });
}

// Enhanced card interactions
function setupCardInteractions() {
    const cards = document.querySelectorAll('.blog-card');
    
    cards.forEach(card => {
        // Mouse move parallax effect
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            this.style.transition = 'none';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            this.style.transition = 'all 0.5s ease';
        });
        
        // Click ripple effect
        card.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Parallax effects for blog images
function setupParallaxEffects() {
    const blogImages = document.querySelectorAll('.blog-image');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        blogImages.forEach((img, index) => {
            const speed = 0.1 + (index % 3) * 0.05;
            const yPos = -(scrolled * speed);
            img.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Search functionality (placeholder)
function setupSearchFunctionality() {
    // This can be extended with actual search functionality
    console.log('Blog search functionality ready');
}

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(0, 212, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .blog-card {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);
