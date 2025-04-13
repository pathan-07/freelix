document.addEventListener('DOMContentLoaded', () => {
    // Tab switching functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const forms = document.querySelectorAll('.form');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and forms
            tabBtns.forEach(b => b.classList.remove('active'));
            forms.forEach(f => f.classList.remove('active'));

            // Add active class to clicked button and corresponding form
            btn.classList.add('active');
            document.getElementById(`${btn.dataset.tab}-form`).classList.add('active');
        });
    });

    // No preventDefault to ensure forms submit to the backend
    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            console.log('Login form submitted');
            // Form will submit to the backend route
        });
    }

    // Signup form submission
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            console.log('Signup form submitted');
            // Form will submit to the backend route
        });
    }
});