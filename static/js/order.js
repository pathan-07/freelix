/* filepath: /c:/Users/pathan faizan/hackathon/js/order.js */
document.addEventListener('DOMContentLoaded', function() {
    const budgetSlider = document.getElementById('budget');
    const budgetValue = document.getElementById('budgetValue');
    const orderForm = document.getElementById('orderForm');

    // Update budget value display
    budgetSlider.addEventListener('input', function() {
        const value = parseInt(this.value);
        budgetValue.textContent = `$${value.toLocaleString()}`;
    });

    // Handle form submission
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const orderData = Object.fromEntries(formData);

        // Here you would typically send the data to your backend
        console.log('Order submitted:', orderData);
        
        // Show success message
        alert('Order submitted successfully!');
        this.reset();
    });
});