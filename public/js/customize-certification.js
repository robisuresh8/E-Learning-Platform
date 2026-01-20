// Certificate Customizer Handler
document.addEventListener('DOMContentLoaded', () => {
    // Get all input elements
    const inputs = {
        recipientName: document.getElementById('recipientName'),
        certificateTitle: document.getElementById('certificateTitle'),
        courseName: document.getElementById('courseName'),
        certificateDescription: document.getElementById('certificateDescription'),
        fontFamily: document.getElementById('fontFamily'),
        accentColor: document.getElementById('accentColor'),
        textColor: document.getElementById('textColor'),
        signatoryName: document.getElementById('signatoryName'),
        signatoryTitle: document.getElementById('signatoryTitle'),
        issueDate: document.getElementById('issueDate')
    };

    const preview = document.getElementById('certificatePreview');

    // Set default issue date to today
    if (!inputs.issueDate.value) {
        const today = new Date().toISOString().split('T')[0];
        inputs.issueDate.value = today;
    }

    // Load saved certificate data
    loadSavedCertificate();

    // Add event listeners to update preview in real-time
    Object.values(inputs).forEach(input => {
        input.addEventListener('input', updatePreview);
        input.addEventListener('change', updatePreview);
    });

    function updatePreview() {
        // Update text content
        document.getElementById('previewTitle').textContent = inputs.certificateTitle.value || 'Certificate of Completion';
        document.getElementById('previewName').textContent = inputs.recipientName.value || 'John Doe';
        document.getElementById('previewCourse').textContent = inputs.courseName.value || 'Professional Development Program';
        document.getElementById('previewDescription').textContent = inputs.certificateDescription.value || 'Successfully completed the program.';
        document.getElementById('previewSignatory').textContent = inputs.signatoryName.value || 'Dr. Jane Smith';
        document.querySelector('#previewTitle').nextElementSibling.textContent = inputs.signatoryTitle.value || 'Course Director';

        // Update date
        if (inputs.issueDate.value) {
            const date = new Date(inputs.issueDate.value);
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            document.getElementById('previewDate').textContent = formattedDate;
        }

        // Update styles
        const fontFamilyMap = {
            'serif': "'Playfair Display', serif",
            'sans-serif': "'Inter', sans-serif",
            'monospace': "'Courier New', monospace"
        };

        preview.style.fontFamily = fontFamilyMap[inputs.fontFamily.value] || "'Playfair Display', serif";
        preview.style.color = inputs.textColor.value || '#333';

        // Update accent color for borders and titles
        const style = document.createElement('style');
        style.innerHTML = `
            .cert-title { color: ${inputs.accentColor.value || '#667eea'} !important; }
            .cert-name { border-bottom-color: ${inputs.accentColor.value || '#667eea'} !important; }
            .cert-signature, .cert-date { border-top-color: ${inputs.accentColor.value || '#667eea'} !important; }
        `;
        document.head.appendChild(style);
    }

    function saveCertificate() {
        const certificateData = {
            recipientName: inputs.recipientName.value,
            certificateTitle: inputs.certificateTitle.value,
            courseName: inputs.courseName.value,
            certificateDescription: inputs.certificateDescription.value,
            fontFamily: inputs.fontFamily.value,
            accentColor: inputs.accentColor.value,
            textColor: inputs.textColor.value,
            signatoryName: inputs.signatoryName.value,
            signatoryTitle: inputs.signatoryTitle.value,
            issueDate: inputs.issueDate.value,
            savedAt: new Date().toISOString()
        };

        localStorage.setItem('certificateData', JSON.stringify(certificateData));

        // Show success message
        const successMessage = document.getElementById('successMessage');
        successMessage.style.display = 'block';
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);

        console.log('Certificate saved:', certificateData);
    }

    function loadSavedCertificate() {
        const saved = localStorage.getItem('certificateData');
        if (saved) {
            const data = JSON.parse(saved);
            Object.keys(inputs).forEach(key => {
                if (data[key]) {
                    inputs[key].value = data[key];
                }
            });
            updatePreview();
        }
    }

    // Export function to global scope
    window.saveCertificate = saveCertificate;

    window.printCertificate = function() {
        window.print();
    };

    window.downloadCertificate = function() {
        const element = document.getElementById('certificatePreview');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas size to match certificate aspect ratio
        canvas.width = 1600;
        canvas.height = 1000;

        // Fill white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Create image from HTML
        const svg = new XMLSerializer().serializeToString(element);
        const img = new Image();
        img.onload = function() {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'certificate.png';
            link.click();
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svg);
    };
});
