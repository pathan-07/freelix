class Dashboard {
    constructor() {
        this.init();
    }

    init() {
        this.loadStats();
        this.loadOrders();
    }

    loadStats() {
        // Simulate loading stats
        const stats = {
            earnings: '$1,234',
            orders: '5',
            rating: '4.8'
        };

        // Update stats in DOM
        Object.entries(stats).forEach(([key, value]) => {
            const element = document.querySelector(`[data-stat="${key}"]`);
            if (element) {
                element.textContent = value;
            }
        });
    }

    loadOrders() {
        // Simulate loading orders
        const orders = [
            { id: 1, title: 'Website Design', price: '$100', status: 'In Progress' },
            { id: 2, title: 'Logo Design', price: '$50', status: 'Completed' }
        ];

        const ordersList = document.querySelector('.orders-list');
        if (ordersList) {
            ordersList.innerHTML = orders.map(order => `
                <div class="order-item">
                    <h3>${order.title}</h3>
                    <p>${order.price}</p>
                    <span class="status">${order.status}</span>
                </div>
            `).join('');
        }
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
}); 