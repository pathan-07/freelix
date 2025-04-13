// ui.js - Handles all UI-related functionality

class UI {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupModals();
        this.setupImagePreviews();
    }

    setupEventListeners() {
        // Toggle forms on landing page
        const toggleBtns = document.querySelectorAll('.toggle-btn');
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', () => this.toggleForms(btn));
        });

        // File upload previews
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
            input.addEventListener('change', (e) => this.handleFilePreview(e));
        });

        // Skills input
        const addSkillBtn = document.querySelector('.add-skill-btn');
        if (addSkillBtn) {
            addSkillBtn.addEventListener('click', () => this.addSkill());
        }
    }

    setupModals() {
        // Post gig modal
        const postGigBtn = document.getElementById('post-gig-btn');
        const modal = document.getElementById('post-gig-modal');
        const closeBtn = document.querySelector('.close-modal');

        if (postGigBtn && modal) {
            postGigBtn.addEventListener('click', () => {
                modal.style.display = 'block';
            });

            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });

            window.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
    }

    setupImagePreviews() {
        // Profile picture preview
        const profilePicInput = document.getElementById('avatar-upload');
        if (profilePicInput) {
            profilePicInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        document.querySelector('.profile-avatar').src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }

    toggleForms(clickedBtn) {
        const forms = document.querySelectorAll('.auth-form');
        const buttons = document.querySelectorAll('.toggle-btn');

        buttons.forEach(btn => btn.classList.remove('active'));
        clickedBtn.classList.add('active');

        forms.forEach(form => {
            form.classList.remove('active');
            if (form.id === `${clickedBtn.dataset.form}-form`) {
                form.classList.add('active');
            }
        });
    }

    handleFilePreview(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.createElement('img');
            preview.src = e.target.result;
            preview.classList.add('file-preview');
            
            const previewContainer = document.createElement('div');
            previewContainer.classList.add('preview-container');
            previewContainer.appendChild(preview);

            const container = e.target.parentElement;
            const existingPreview = container.querySelector('.preview-container');
            if (existingPreview) {
                container.removeChild(existingPreview);
            }
            container.appendChild(previewContainer);
        };
        reader.readAsDataURL(file);
    }

    addSkill() {
        const skillInput = document.getElementById('skills');
        const skillsList = document.querySelector('.skills-list');
        const skill = skillInput.value.trim();

        if (skill) {
            const skillTag = document.createElement('span');
            skillTag.classList.add('skill-tag');
            skillTag.innerHTML = `
                ${skill}
                <button class="remove-skill">×</button>
            `;

            skillTag.querySelector('.remove-skill').addEventListener('click', () => {
                skillsList.removeChild(skillTag);
            });

            skillsList.appendChild(skillTag);
            skillInput.value = '';
        }
    }
}

// Initialize UI
const ui = new UI();
