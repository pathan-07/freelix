class Messaging {
    constructor() {
        this.init();
    }

    init() {
        this.setupMessageForm();
        this.setupChatSelection();
        this.loadMessages();
    }

    setupMessageForm() {
        const messageForm = document.getElementById('message-form');
        if (messageForm) {
            messageForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const input = messageForm.querySelector('.message-input');
                const message = input.value.trim();
                
                if (message) {
                    this.sendMessage(message);
                    input.value = '';
                }
            });
        }
    }

    setupChatSelection() {
        const chatItems = document.querySelectorAll('.chat-item');
        chatItems.forEach(item => {
            item.addEventListener('click', () => {
                chatItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                this.loadMessages(item.dataset.chatId);
            });
        });
    }

    sendMessage(content) {
        const messagesContainer = document.querySelector('.chat-messages');
        const messageElement = document.createElement('div');
        messageElement.className = 'message sent';
        messageElement.innerHTML = `
            <div class="message-content">
                <p>${content}</p>
                <span class="message-time">${this.formatTime(new Date())}</span>
            </div>
        `;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    loadMessages(chatId = null) {
        // Simulate loading messages
        const messages = [
            { sent: false, content: 'Hello! How are you?', time: '10:30 AM' },
            { sent: true, content: 'Hi! I\'m good, thanks!', time: '10:31 AM' },
            { sent: false, content: 'Great! About the project...', time: '10:32 AM' }
        ];

        const messagesContainer = document.querySelector('.chat-messages');
        messagesContainer.innerHTML = '';
        
        messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.className = `message ${message.sent ? 'sent' : 'received'}`;
            messageElement.innerHTML = `
                <div class="message-content">
                    <p>${message.content}</p>
                    <span class="message-time">${message.time}</span>
                </div>
            `;
            messagesContainer.appendChild(messageElement);
        });
    }

    formatTime(date) {
        return date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: 'numeric', 
            hour12: true 
        });
    }
}

// Initialize messaging
document.addEventListener('DOMContentLoaded', () => {
    const messaging = new Messaging();
}); 