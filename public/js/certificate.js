// Certificate Display Page

document.addEventListener('DOMContentLoaded', () => {
    loadCertificateData();
    triggerCelebration();
});

function loadCertificateData() {
    const urlParams = new URLSearchParams(window.location.search);
    const certId = urlParams.get('id');
    
    if (!certId) {
        window.location.href = '/courses';
        return;
    }

    // Set certificate ID
    document.getElementById('certId').textContent = certId;
    
    // Try to load from session storage
    const checkout = sessionStorage.getItem('currentCheckout');
    if (checkout) {
        const data = JSON.parse(checkout);
        document.getElementById('certCourse').textContent = data.title;
    } else {
        document.getElementById('certCourse').textContent = 'Professional Certification';
    }

    // Set date
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('certDate').textContent = dateStr;

    // Get user name from email or use placeholder
    const email = prompt('Please enter your name for the certificate:', 'Your Name');
    if (email && email !== 'Your Name') {
        document.getElementById('certRecipient').textContent = email;
    }
}

function downloadCertificate() {
    const certId = document.getElementById('certId').textContent;
    const name = document.getElementById('certRecipient').textContent;
    const course = document.getElementById('certCourse').textContent;
    const date = document.getElementById('certDate').textContent;

    // In production, generate actual PDF
    // Using html2pdf library or server-side PDF generation
    
    // For now, create a simple download
    const certificateContent = `
Certificate of Completion

ICTRD Learning Platform

This certificate is awarded to:
${name}

For successfully completing:
${course}

Issued: ${date}
Certificate ID: ${certId}

This is to certify that the holder has demonstrated proficiency in the subject matter and has met all requirements for this certification.

This certificate is valid and recognized globally.

    `;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(certificateContent));
    element.setAttribute('download', `Certificate-${certId}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    alert('Certificate downloaded! In production, this would be a PDF file.');
}

function shareOnLinkedIn() {
    const certId = document.getElementById('certId').textContent;
    const course = document.getElementById('certCourse').textContent;
    const name = document.getElementById('certRecipient').textContent;

    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
    window.open(linkedinUrl, '_blank', 'width=600,height=400');

    // Log the achievement
    console.log(`Certificate shared - ID: ${certId}, Course: ${course}`);
}

function copyCertificateLink() {
    const link = window.location.href;
    navigator.clipboard.writeText(link).then(() => {
        alert('Certificate link copied to clipboard!');
    });
}

function triggerCelebration() {
    // Create confetti effect
    const colors = ['#fa8112', '#faf3e1', '#f5e7c6'];
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '50%';
        confetti.style.zIndex = '999';
        confetti.style.opacity = '1';
        confetti.style.animation = 'fall 3s linear forwards';
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
    }

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            to {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}
