class Profile {
    constructor() {
        this.init();
    }

    init() {
        this.setupImageUpload();
        this.setupPortfolio();
        this.setupProfileEdit();
    }

    setupImageUpload() {
        const avatarInput = document.getElementById('avatar-upload');
        const avatarImg = document.querySelector('.profile-avatar');

        if (avatarInput && avatarImg) {
            avatarInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        avatarImg.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }

    setupPortfolio() {
        const portfolioGrid = document.querySelector('.portfolio-grid');
        const uploadBtn = document.getElementById('portfolio-upload');

        if (uploadBtn) {
            uploadBtn.addEventListener('change', (e) => {
                const files = e.target.files;
                Array.from(files).forEach(file => {
                    this.addPortfolioItem(file);
                });
            });
        }
    }

    addPortfolioItem(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const portfolioGrid = document.querySelector('.portfolio-grid');
            const div = document.createElement('div');
            div.className = 'portfolio-item';
            div.innerHTML = `
                <img src="${e.target.result}" class="portfolio-image" alt="Portfolio item">
                <button class="remove-portfolio" onclick="this.parentElement.remove()">&times;</button>
            `;
            portfolioGrid.appendChild(div);
        };
        reader.readAsDataURL(file);
    }

    setupProfileEdit() {
        const editForm = document.getElementById('profile-edit-form');
        if (editForm) {
            editForm.addEventListener('submit', (e) => {
                e.preventDefault();
                // Handle profile update logic here
                console.log('Profile updated');
            });
        }
    }
}

// Initialize profile
document.addEventListener('DOMContentLoaded', () => {
    const profile = new Profile();
}); 