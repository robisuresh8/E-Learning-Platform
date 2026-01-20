// Personalization Form Handler
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('personalizationForm');
    const progressFill = document.getElementById('progressFill');
    const paceSlider = document.getElementById('learningPace');
    const paceValue = document.getElementById('paceValue');

    // Load saved preferences if any
    loadSavedPreferences();

    // Update pace value display
    paceSlider.addEventListener('input', (e) => {
        const paceTexts = {
            1: 'Very Slow',
            2: 'Slow',
            3: 'Medium',
            4: 'Fast',
            5: 'Very Fast'
        };
        paceValue.textContent = paceTexts[e.target.value];
    });

    // Update progress bar as user fills form
    const allInputs = form.querySelectorAll('input, textarea');
    allInputs.forEach(input => {
        input.addEventListener('change', updateProgress);
        input.addEventListener('input', updateProgress);
    });

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        savePreferences();
    });

    function updateProgress() {
        const requiredFields = form.querySelectorAll('[required]');
        let filledCount = 0;

        requiredFields.forEach(field => {
            if (field.type === 'radio') {
                const radioGroup = form.querySelectorAll(`input[name="${field.name}"]`);
                if (Array.from(radioGroup).some(r => r.checked)) {
                    filledCount++;
                }
            } else if (field.type === 'checkbox') {
                const checkboxGroup = form.querySelectorAll(`input[name="${field.name}"]`);
                if (Array.from(checkboxGroup).some(c => c.checked)) {
                    filledCount++;
                }
            } else if (field.value.trim() !== '') {
                filledCount++;
            }
        });

        const progress = (filledCount / requiredFields.length) * 100;
        progressFill.style.width = progress + '%';
    }

    function savePreferences() {
        const formData = new FormData(form);
        const preferences = {
            learningLevel: formData.get('learningLevel'),
            goals: formData.getAll('goals'),
            learningPace: formData.get('learningPace'),
            timeAvailable: formData.get('timeAvailable'),
            domains: formData.getAll('domains'),
            learningStyle: formData.get('learningStyle'),
            additionalNotes: formData.get('additionalNotes'),
            savedAt: new Date().toISOString()
        };

        // Save to localStorage
        localStorage.setItem('userPreferences', JSON.stringify(preferences));

        // Show success message
        const successMessage = document.getElementById('successMessage');
        successMessage.style.display = 'block';
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);

        // Optionally send to server
        console.log('Preferences saved:', preferences);
    }

    function loadSavedPreferences() {
        const saved = localStorage.getItem('userPreferences');
        if (saved) {
            const preferences = JSON.parse(saved);

            // Load radio buttons
            if (preferences.learningLevel) {
                const levelRadio = form.querySelector(`input[name="learningLevel"][value="${preferences.learningLevel}"]`);
                if (levelRadio) levelRadio.checked = true;
            }

            if (preferences.timeAvailable) {
                const timeRadio = form.querySelector(`input[name="timeAvailable"][value="${preferences.timeAvailable}"]`);
                if (timeRadio) timeRadio.checked = true;
            }

            if (preferences.learningStyle) {
                const styleRadio = form.querySelector(`input[name="learningStyle"][value="${preferences.learningStyle}"]`);
                if (styleRadio) styleRadio.checked = true;
            }

            // Load checkboxes
            if (preferences.goals && preferences.goals.length > 0) {
                preferences.goals.forEach(goal => {
                    const checkbox = form.querySelector(`input[name="goals"][value="${goal}"]`);
                    if (checkbox) checkbox.checked = true;
                });
            }

            if (preferences.domains && preferences.domains.length > 0) {
                preferences.domains.forEach(domain => {
                    const checkbox = form.querySelector(`input[name="domains"][value="${domain}"]`);
                    if (checkbox) checkbox.checked = true;
                });
            }

            // Load pace
            if (preferences.learningPace) {
                paceSlider.value = preferences.learningPace;
                const paceTexts = {
                    1: 'Very Slow',
                    2: 'Slow',
                    3: 'Medium',
                    4: 'Fast',
                    5: 'Very Fast'
                };
                paceValue.textContent = paceTexts[preferences.learningPace];
            }

            // Load textarea
            if (preferences.additionalNotes) {
                document.getElementById('additionalNotes').value = preferences.additionalNotes;
            }

            updateProgress();
        }
    }
});
