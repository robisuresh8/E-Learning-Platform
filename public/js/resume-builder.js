// Resume Builder Handler
document.addEventListener('DOMContentLoaded', () => {
    // Load saved resume data
    loadSavedResume();

    // Set up real-time preview updates
    setupRealtimeUpdates();

    // Set default values
    setDefaultValues();
});

function setupRealtimeUpdates() {
    // Personal Info
    const personalInputs = [
        'fullName', 'email', 'phone', 'location', 'website', 'summary'
    ];

    personalInputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', updateResumePreview);
            element.addEventListener('change', updateResumePreview);
        }
    });

    // Skills
    const skillsInput = document.getElementById('skillsInput');
    if (skillsInput) {
        skillsInput.addEventListener('input', updateResumePreview);
    }

    // Experience and Education auto-update through updateResumePreview
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('exp-title') ||
            e.target.classList.contains('exp-company') ||
            e.target.classList.contains('exp-location') ||
            e.target.classList.contains('exp-start') ||
            e.target.classList.contains('exp-end') ||
            e.target.classList.contains('exp-description') ||
            e.target.classList.contains('edu-degree') ||
            e.target.classList.contains('edu-field') ||
            e.target.classList.contains('edu-school') ||
            e.target.classList.contains('edu-year') ||
            e.target.classList.contains('cert-name') ||
            e.target.classList.contains('cert-org') ||
            e.target.classList.contains('cert-date')) {
            updateResumePreview();
        }
    });
}

function setDefaultValues() {
    // Set today's date for new certifications if needed
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7);
    // Default values are already in HTML
}

function updateResumePreview() {
    // Update personal info
    document.getElementById('previewName').textContent = document.getElementById('fullName').value || 'John Doe';
    document.getElementById('previewEmail').textContent = document.getElementById('email').value || 'john@example.com';
    document.getElementById('previewPhone').textContent = document.getElementById('phone').value || '+1 (555) 123-4567';
    document.getElementById('previewLocation').textContent = document.getElementById('location').value || 'City, State';
    document.getElementById('previewSummary').textContent = document.getElementById('summary').value || 'Professional summary goes here.';

    // Update experience
    updateExperiencePreview();

    // Update education
    updateEducationPreview();

    // Update skills
    updateSkillsPreview();

    // Update certifications
    updateCertificationsPreview();
}

function updateExperiencePreview() {
    const container = document.getElementById('experienceContainer');
    const previewContainer = document.getElementById('previewExperience');
    const items = container.querySelectorAll('.item-block');

    previewContainer.innerHTML = '';

    items.forEach(item => {
        const title = item.querySelector('.exp-title').value;
        const company = item.querySelector('.exp-company').value;
        const location = item.querySelector('.exp-location').value;
        const start = item.querySelector('.exp-start').value;
        const end = item.querySelector('.exp-end').value;
        const description = item.querySelector('.exp-description').value;

        if (title || company) {
            const html = `
                <div class="resume-item">
                    <div class="resume-item-header">
                        <div>
                            <div class="resume-item-title">${title || 'Job Title'}</div>
                            <div class="resume-item-subtitle">${company || 'Company'}</div>
                        </div>
                        <div class="resume-item-date">${formatDateRange(start, end)}</div>
                    </div>
                    ${location ? `<div style="color: #999; font-size: 0.9em;">${location}</div>` : ''}
                    ${description ? `<div class="resume-item-description">• ${description}</div>` : ''}
                </div>
            `;
            previewContainer.innerHTML += html;
        }
    });
}

function updateEducationPreview() {
    const container = document.getElementById('educationContainer');
    const previewContainer = document.getElementById('previewEducation');
    const items = container.querySelectorAll('.item-block');

    previewContainer.innerHTML = '';

    items.forEach(item => {
        const degree = item.querySelector('.edu-degree').value;
        const field = item.querySelector('.edu-field').value;
        const school = item.querySelector('.edu-school').value;
        const year = item.querySelector('.edu-year').value;

        if (degree || field || school) {
            const html = `
                <div class="resume-item">
                    <div class="resume-item-header">
                        <div>
                            <div class="resume-item-title">${degree || 'Degree'}</div>
                            <div class="resume-item-subtitle">${field ? 'in ' + field : ''}</div>
                        </div>
                        <div class="resume-item-date">${year || ''}</div>
                    </div>
                    ${school ? `<div style="color: #999; font-size: 0.9em;">${school}</div>` : ''}
                </div>
            `;
            previewContainer.innerHTML += html;
        }
    });
}

function updateSkillsPreview() {
    const skillsInput = document.getElementById('skillsInput').value;
    const previewContainer = document.getElementById('previewSkills');

    previewContainer.innerHTML = '';

    if (skillsInput) {
        const skills = skillsInput.split(',').map(s => s.trim()).filter(s => s);
        skills.forEach(skill => {
            const badge = document.createElement('div');
            badge.className = 'skill-badge';
            badge.textContent = skill;
            previewContainer.appendChild(badge);
        });
    }
}

function updateCertificationsPreview() {
    const container = document.getElementById('certificationsContainer');
    const previewContainer = document.getElementById('previewCertifications');
    const items = container.querySelectorAll('.item-block');

    previewContainer.innerHTML = '';

    items.forEach(item => {
        const name = item.querySelector('.cert-name').value;
        const org = item.querySelector('.cert-org').value;
        const date = item.querySelector('.cert-date').value;

        if (name || org) {
            const html = `
                <div class="resume-item">
                    <div class="resume-item-header">
                        <div>
                            <div class="resume-item-title">${name || 'Certification'}</div>
                            <div class="resume-item-subtitle">${org || 'Organization'}</div>
                        </div>
                        <div class="resume-item-date">${formatMonth(date)}</div>
                    </div>
                </div>
            `;
            previewContainer.innerHTML += html;
        }
    });
}

function addExperience() {
    const container = document.getElementById('experienceContainer');
    const newItem = document.createElement('div');
    newItem.className = 'item-block';
    newItem.innerHTML = `
        <button type="button" class="remove-btn" onclick="removeExperience(this)"><i class="bi bi-trash"></i></button>
        <div class="form-group">
            <label>Job Title</label>
            <input type="text" placeholder="Job Title" class="exp-title">
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Company</label>
                <input type="text" placeholder="Company Name" class="exp-company">
            </div>
            <div class="form-group">
                <label>Location</label>
                <input type="text" placeholder="City, State" class="exp-location">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Start Date</label>
                <input type="month" class="exp-start">
            </div>
            <div class="form-group">
                <label>End Date</label>
                <input type="month" class="exp-end">
            </div>
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea placeholder="Describe your responsibilities..." rows="2" class="exp-description"></textarea>
        </div>
    `;
    container.appendChild(newItem);
    updateResumePreview();
}

function removeExperience(btn) {
    btn.closest('.item-block').remove();
    updateResumePreview();
}

function addEducation() {
    const container = document.getElementById('educationContainer');
    const newItem = document.createElement('div');
    newItem.className = 'item-block';
    newItem.innerHTML = `
        <button type="button" class="remove-btn" onclick="removeEducation(this)"><i class="bi bi-trash"></i></button>
        <div class="form-group">
            <label>Degree</label>
            <input type="text" placeholder="Bachelor of Science" class="edu-degree">
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Field of Study</label>
                <input type="text" placeholder="Computer Science" class="edu-field">
            </div>
            <div class="form-group">
                <label>School</label>
                <input type="text" placeholder="University Name" class="edu-school">
            </div>
        </div>
        <div class="form-group">
            <label>Graduation Year</label>
            <input type="number" placeholder="2020" class="edu-year" min="1900" max="2100">
        </div>
    `;
    container.appendChild(newItem);
    updateResumePreview();
}

function removeEducation(btn) {
    btn.closest('.item-block').remove();
    updateResumePreview();
}

function addCertification() {
    const container = document.getElementById('certificationsContainer');
    const newItem = document.createElement('div');
    newItem.className = 'item-block';
    newItem.innerHTML = `
        <button type="button" class="remove-btn" onclick="removeCertification(this)"><i class="bi bi-trash"></i></button>
        <div class="form-group">
            <label>Certification Name</label>
            <input type="text" placeholder="Certification Name" class="cert-name">
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Issuing Organization</label>
                <input type="text" placeholder="Organization" class="cert-org">
            </div>
            <div class="form-group">
                <label>Issue Date</label>
                <input type="month" class="cert-date">
            </div>
        </div>
    `;
    container.appendChild(newItem);
    updateResumePreview();
}

function removeCertification(btn) {
    btn.closest('.item-block').remove();
    updateResumePreview();
}

function formatDateRange(start, end) {
    let result = '';
    if (start) result += formatMonth(start);
    if (start && end) result += ' - ';
    if (end) result += formatMonth(end);
    return result || '';
}

function formatMonth(monthStr) {
    if (!monthStr) return '';
    const [year, month] = monthStr.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(month) - 1]} ${year}`;
}

function saveResume() {
    const resumeData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        location: document.getElementById('location').value,
        website: document.getElementById('website').value,
        summary: document.getElementById('summary').value,
        skills: document.getElementById('skillsInput').value,
        experience: [],
        education: [],
        certifications: [],
        savedAt: new Date().toISOString()
    };

    // Collect experience
    document.querySelectorAll('#experienceContainer .item-block').forEach(item => {
        resumeData.experience.push({
            title: item.querySelector('.exp-title').value,
            company: item.querySelector('.exp-company').value,
            location: item.querySelector('.exp-location').value,
            start: item.querySelector('.exp-start').value,
            end: item.querySelector('.exp-end').value,
            description: item.querySelector('.exp-description').value
        });
    });

    // Collect education
    document.querySelectorAll('#educationContainer .item-block').forEach(item => {
        resumeData.education.push({
            degree: item.querySelector('.edu-degree').value,
            field: item.querySelector('.edu-field').value,
            school: item.querySelector('.edu-school').value,
            year: item.querySelector('.edu-year').value
        });
    });

    // Collect certifications
    document.querySelectorAll('#certificationsContainer .item-block').forEach(item => {
        resumeData.certifications.push({
            name: item.querySelector('.cert-name').value,
            org: item.querySelector('.cert-org').value,
            date: item.querySelector('.cert-date').value
        });
    });

    localStorage.setItem('resumeData', JSON.stringify(resumeData));

    // Show success message
    const successMessage = document.getElementById('successMessage');
    successMessage.style.display = 'block';
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000);

    console.log('Resume saved:', resumeData);
}

function loadSavedResume() {
    const saved = localStorage.getItem('resumeData');
    if (saved) {
        const data = JSON.parse(saved);

        // Load personal info
        document.getElementById('fullName').value = data.fullName || '';
        document.getElementById('email').value = data.email || '';
        document.getElementById('phone').value = data.phone || '';
        document.getElementById('location').value = data.location || '';
        document.getElementById('website').value = data.website || '';
        document.getElementById('summary').value = data.summary || '';
        document.getElementById('skillsInput').value = data.skills || '';

        // Load experience
        if (data.experience && data.experience.length > 0) {
            const expContainer = document.getElementById('experienceContainer');
            expContainer.innerHTML = '';
            data.experience.forEach(exp => {
                const item = document.createElement('div');
                item.className = 'item-block';
                item.innerHTML = `
                    <button type="button" class="remove-btn" onclick="removeExperience(this)"><i class="bi bi-trash"></i></button>
                    <div class="form-group">
                        <label>Job Title</label>
                        <input type="text" placeholder="Job Title" value="${exp.title || ''}" class="exp-title">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Company</label>
                            <input type="text" placeholder="Company Name" value="${exp.company || ''}" class="exp-company">
                        </div>
                        <div class="form-group">
                            <label>Location</label>
                            <input type="text" placeholder="City, State" value="${exp.location || ''}" class="exp-location">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Start Date</label>
                            <input type="month" value="${exp.start || ''}" class="exp-start">
                        </div>
                        <div class="form-group">
                            <label>End Date</label>
                            <input type="month" value="${exp.end || ''}" class="exp-end">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea placeholder="Describe your responsibilities..." rows="2" class="exp-description">${exp.description || ''}</textarea>
                    </div>
                `;
                expContainer.appendChild(item);
            });
        }

        // Load education
        if (data.education && data.education.length > 0) {
            const eduContainer = document.getElementById('educationContainer');
            eduContainer.innerHTML = '';
            data.education.forEach(edu => {
                const item = document.createElement('div');
                item.className = 'item-block';
                item.innerHTML = `
                    <button type="button" class="remove-btn" onclick="removeEducation(this)"><i class="bi bi-trash"></i></button>
                    <div class="form-group">
                        <label>Degree</label>
                        <input type="text" placeholder="Bachelor of Science" value="${edu.degree || ''}" class="edu-degree">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Field of Study</label>
                            <input type="text" placeholder="Computer Science" value="${edu.field || ''}" class="edu-field">
                        </div>
                        <div class="form-group">
                            <label>School</label>
                            <input type="text" placeholder="University Name" value="${edu.school || ''}" class="edu-school">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Graduation Year</label>
                        <input type="number" placeholder="2020" value="${edu.year || ''}" class="edu-year" min="1900" max="2100">
                    </div>
                `;
                eduContainer.appendChild(item);
            });
        }

        // Load certifications
        if (data.certifications && data.certifications.length > 0) {
            const certContainer = document.getElementById('certificationsContainer');
            certContainer.innerHTML = '';
            data.certifications.forEach(cert => {
                const item = document.createElement('div');
                item.className = 'item-block';
                item.innerHTML = `
                    <button type="button" class="remove-btn" onclick="removeCertification(this)"><i class="bi bi-trash"></i></button>
                    <div class="form-group">
                        <label>Certification Name</label>
                        <input type="text" placeholder="Certification Name" value="${cert.name || ''}" class="cert-name">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Issuing Organization</label>
                            <input type="text" placeholder="Organization" value="${cert.org || ''}" class="cert-org">
                        </div>
                        <div class="form-group">
                            <label>Issue Date</label>
                            <input type="month" value="${cert.date || ''}" class="cert-date">
                        </div>
                    </div>
                `;
                certContainer.appendChild(item);
            });
        }

        updateResumePreview();
    }
}

window.printResume = function() {
    window.print();
};

window.downloadResume = function() {
    const element = document.getElementById('resumePreview');
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Resume - ${document.getElementById('fullName').value}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .resume-header-section { border-bottom: 2px solid #333; margin-bottom: 20px; text-align: center; }
                .resume-name { font-size: 24px; font-weight: bold; }
                .resume-contact { margin-top: 10px; font-size: 12px; }
                .resume-section { margin-top: 15px; }
                .resume-section-title { font-size: 14px; font-weight: bold; border-bottom: 1px solid #ddd; margin-bottom: 10px; }
                .resume-item { margin-bottom: 10px; }
                .resume-item-title { font-weight: bold; }
                .resume-item-date { text-align: right; font-size: 12px; }
            </style>
        </head>
        <body>
            ${element.innerHTML}
        </body>
        </html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `resume-${document.getElementById('fullName').value.replace(/\s/g, '-')}.html`;
    link.click();
    URL.revokeObjectURL(url);
};
