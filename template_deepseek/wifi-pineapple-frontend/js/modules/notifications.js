// Notifications Module JavaScript
class NotificationsModule {
    constructor() {
        this.notifications = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.init();
    }

    async init() {
        console.log('🔔 Notifications Module Initializing...');
        await this.loadNotifications();
        this.setupEventListeners();
        this.renderNotifications();
        this.renderPagination();
    }

    async loadNotifications() {
        try {
            const response = await fetch('/api/mock/notifications.json');
            const data = await response.json();
            this.notifications = data.notifications;
        } catch (error) {
            console.error('Failed to load notifications:', error);
            Helpers.showNotification('Failed to load notifications', 'error');
        }
    }

    setupEventListeners() {
        // Pagination clicks
        $(document).on('click', '.page-link', (e) => {
            e.preventDefault();
            const page = parseInt($(e.target).data('page'));
            if (page && page !== this.currentPage) {
                this.currentPage = page;
                this.renderNotifications();
                this.renderPagination();
            }
        });

        // View details
        $(document).on('click', '.view-notification', (e) => {
            e.preventDefault();
            const id = parseInt($(e.target).closest('button').data('id'));
            this.showNotificationDetails(id);
        });

        // Mark as read/unread
        $(document).on('click', '.toggle-read', (e) => {
            e.preventDefault();
            const id = parseInt($(e.target).closest('button').data('id'));
            this.toggleReadStatus(id);
        });
    }

    renderNotifications() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const notificationsToShow = this.notifications.slice(startIndex, endIndex);

        const tbody = $('#notifications-body');
        const html = notificationsToShow.map(notification => `
            <tr class="${notification.read ? '' : 'table-warning'}">
                <td>
                    <span class="badge ${this.getLevelClass(notification.level)}">
                        ${notification.level.toUpperCase()}
                    </span>
                </td>
                <td>
                    <strong>${notification.title}</strong>
                    <br>
                    <small class="text-muted">${this.truncateMessage(notification.message)}</small>
                </td>
                <td>${this.formatTimestamp(notification.timestamp)}</td>
                <td>
                    <button class="btn btn-sm btn-outline-info view-notification" data-id="${notification.id}">
                        <i class="bi bi-eye"></i> View
                    </button>
                    <button class="btn btn-sm btn-outline-secondary toggle-read" data-id="${notification.id}">
                        <i class="bi ${notification.read ? 'bi-envelope-open' : 'bi-envelope'}"></i>
                        ${notification.read ? 'Mark Unread' : 'Mark Read'}
                    </button>
                </td>
            </tr>
        `).join('');

        tbody.html(html);
    }

    renderPagination() {
        const totalPages = Math.ceil(this.notifications.length / this.itemsPerPage);
        const pagination = $('#notifications-pagination');

        if (totalPages <= 1) {
            pagination.html('');
            return;
        }

        let html = '';

        // Previous button
        html += `<li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${this.currentPage - 1}">Previous</a>
        </li>`;

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            html += `<li class="page-item ${i === this.currentPage ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>`;
        }

        // Next button
        html += `<li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${this.currentPage + 1}">Next</a>
        </li>`;

        pagination.html(html);
    }

    showNotificationDetails(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (!notification) return;

        const detailsHtml = `
            <div class="notification-detail">
                <div class="mb-3">
                    <h6>Level</h6>
                    <span class="badge ${this.getLevelClass(notification.level)}">${notification.level.toUpperCase()}</span>
                </div>
                <div class="mb-3">
                    <h6>Title</h6>
                    <p>${notification.title}</p>
                </div>
                <div class="mb-3">
                    <h6>Message</h6>
                    <p>${notification.message}</p>
                </div>
                <div class="mb-3">
                    <h6>Timestamp</h6>
                    <p>${this.formatTimestamp(notification.timestamp)}</p>
                </div>
                <div class="mb-3">
                    <h6>Status</h6>
                    <p>${notification.read ? 'Read' : 'Unread'}</p>
                </div>
            </div>
        `;

        $('#notification-details').html(detailsHtml);
        $('#notificationModalLabel').text(notification.title);
        $('#notificationModal').modal('show');
    }

    toggleReadStatus(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.read = !notification.read;
            this.renderNotifications();
            Helpers.showNotification(`Notification marked as ${notification.read ? 'read' : 'unread'}`, 'success');
        }
    }

    getLevelClass(level) {
        switch (level.toLowerCase()) {
            case 'info': return 'bg-info';
            case 'warning': return 'bg-warning';
            case 'error': return 'bg-danger';
            case 'success': return 'bg-success';
            case 'unknown': return 'bg-secondary';
            default: return 'bg-secondary';
        }
    }

    truncateMessage(message) {
        return message.length > 100 ? message.substring(0, 100) + '...' : message;
    }

    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }

    destroy() {
        $(document).off('click', '.page-link, .view-notification, .toggle-read');
        console.log('🔔 Notifications Module Cleaned Up');
    }
}

// Initialize notifications when module loads
let notificationsInstance = null;

function initializeNotifications() {
    if (notificationsInstance) {
        notificationsInstance.destroy();
    }
    notificationsInstance = new NotificationsModule();
}

// Auto-initialize when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeNotifications);
} else {
    initializeNotifications();
}
