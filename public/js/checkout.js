// Checkout Page - Payment Processing

document.addEventListener('DOMContentLoaded', () => {
    loadCheckoutData();
    setupPaymentMethodToggle();
    setupUserInfo();
});

// Setup user information display
function setupUserInfo() {
    const token = localStorage.getItem('sessionToken');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const userInfoDiv = document.getElementById('userInfo');
    
    if (token && userInfoDiv) {
        userInfoDiv.innerHTML = `<p style="color: var(--accent); margin-bottom: 15px;">👤 Logged in as: <strong>${userName}</strong> (${userEmail})</p>`;
    }
}

// Load certification data from URL parameters
function loadCheckoutData() {
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get('title') || 'Professional Certification';
    const price = urlParams.get('price') || '99';
    const courseId = urlParams.get('courseId');
    const userId = urlParams.get('userId');

    // Update summary
    document.getElementById('summaryTitle').textContent = title;
    document.getElementById('summaryPrice').textContent = price;

    // Store for payment processing
    sessionStorage.setItem('currentCheckout', JSON.stringify({
        courseId: courseId,
        title: title,
        price: parseFloat(price),
        userId: userId
    }));
}

// Toggle payment method sections
function setupPaymentMethodToggle() {
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const creditCardSection = document.getElementById('creditCardSection');

    paymentMethodSelect.addEventListener('change', (e) => {
        if (e.target.value === 'credit_card') {
            creditCardSection.style.display = 'block';
        } else {
            creditCardSection.style.display = 'none';
        }
    });
}

// Process payment
function processPayment(event) {
    event.preventDefault();

    const form = document.getElementById('checkoutForm');
    const email = document.getElementById('email').value;
    const paymentMethod = document.getElementById('paymentMethod').value;
    const token = localStorage.getItem('sessionToken');

    if (!token) {
        alert('Please login to complete the purchase');
        window.location.href = '/login';
        return;
    }

    // Show loading state
    document.getElementById('loadingDiv').style.display = 'block';
    document.querySelector('.submit-btn').disabled = true;

    const checkout = JSON.parse(sessionStorage.getItem('currentCheckout'));

    // Create payment payload with user info
    const paymentData = {
        courseId: checkout.courseId,
        amount: checkout.price,
        email: email,
        paymentMethod: paymentMethod,
        courseTitle: checkout.title,
        userId: checkout.userId,
        timestamp: new Date().toISOString()
    };

    // Send payment to server
    fetch('/api/process-payment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Show success message
            const successDiv = document.getElementById('successMessage');
            const successText = document.getElementById('successText');
            
            successText.innerHTML = `
                ✓ Payment successful! You are now enrolled in this course.<br>
                Certificate ID: ${data.certificateId}<br>
                Redirecting to your certificate...
            `;
            successDiv.style.display = 'block';

            // Hide form and loading
            form.style.display = 'none';
            document.getElementById('loadingDiv').style.display = 'none';

            // Redirect to certificate page after 3 seconds
            setTimeout(() => {
                window.location.href = `/certificate?id=${data.certificateId}`;
            }, 3000);
        } else {
            showError(data.error || 'Payment failed. Please try again.');
        }
    })
    .catch(error => {
        console.error('Payment error:', error);
        showError('An error occurred processing your payment. Please try again.');
    })
    .finally(() => {
        document.getElementById('loadingDiv').style.display = 'none';
        document.querySelector('.submit-btn').disabled = false;
    });
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    errorText.textContent = message;
    errorDiv.style.display = 'block';

    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

// Format card input
document.getElementById('cardNumber')?.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formattedValue;
});

document.getElementById('expiryDate')?.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    e.target.value = value;
});

document.getElementById('cvv')?.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '');
});
