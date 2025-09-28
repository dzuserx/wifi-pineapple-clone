// Dashboard Module JavaScript
class DashboardModule {
    constructor() {
        this.statsInterval = null;
        this.init();
    }
    
    async init() {
        console.log('📊 Dashboard Module Initializing...');
        await this.loadDashboardData();
        this.setupEventListeners();
        this.startLiveUpdates();
    }
    
    async loadDashboardData() {
        try {
            const data = await API.getDashboardData();
            this.updateDashboard(data);
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            Helpers.showNotification('Failed to load dashboard data', 'error');
        }
    }
    
    updateDashboard(data) {
        if (data.status) {
            $('#total-clients').text(data.status.clients || 0);
            $('#total-networks').text(data.status.networks || 0);
            $('#active-modules-count').text(data.status.modules || 0);
            $('#system-uptime').text(data.status.uptime || '0d 0h');
        }
        
        // Update recent activity
        if (data.recentActivity) {
            this.updateRecentActivity(data.recentActivity);
        }
    }
    
    updateRecentActivity(activities) {
        const timeline = $('.activity-timeline');
        timeline.empty();
        
        activities.forEach(activity => {
            const iconClass = this.getActivityIcon(activity.type);
            const timeAgo = this.getTimeAgo(activity.timestamp);
            
            const activityItem = `
                <div class="activity-item">
                    <div class="activity-icon ${iconClass.bg}">
                        <i class="bi ${iconClass.icon}"></i>
                    </div>
                    <div class="activity-content">
                        <p>${activity.message}</p>
                        <small class="text-muted">${timeAgo}</small>
                    </div>
                </div>
            `;
            timeline.append(activityItem);
        });
    }
    
    getActivityIcon(type) {
        const icons = {
            'client_connected': { icon: 'bi-person-plus', bg: 'bg-success' },
            'scan_completed': { icon: 'bi-shield-check', bg: 'bg-info' },
            'module_updated': { icon: 'bi-puzzle', bg: 'bg-warning' },
            'system_alert': { icon: 'bi-exclamation-triangle', bg: 'bg-danger' }
        };
        return icons[type] || { icon: 'bi-info-circle', bg: 'bg-secondary' };
    }
    
    getTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diffMs = now - time;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minutes ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        return `${diffDays} days ago`;
    }
    
    setupEventListeners() {
        // Refresh button
        $('#refresh-activity').on('click', () => {
            this.refreshDashboard();
        });
        
        // Quick action buttons
        $('.btn-block').on('click', function() {
            const action = $(this).text().trim();
            Helpers.showNotification(`${action} functionality would be implemented here`, 'info');
        });
    }
    
    async refreshDashboard() {
        Helpers.showNotification('Refreshing dashboard data...', 'info');
        await this.loadDashboardData();
        Helpers.showNotification('Dashboard updated successfully', 'success');
    }
    
    startLiveUpdates() {
        // Update stats every 30 seconds
        this.statsInterval = setInterval(() => {
            this.updateLiveStats();
        }, 30000);
    }
    
    updateLiveStats() {
        // Simulate live data changes
        const clients = parseInt($('#total-clients').text()) || 0;
        const networks = parseInt($('#total-networks').text()) || 0;
        
        // Small random fluctuations for demo
        const newClients = Math.max(0, clients + Math.floor(Math.random() * 3) - 1);
        const newNetworks = Math.max(0, networks + Math.floor(Math.random() * 2) - 1);
        
        $('#total-clients').text(newClients);
        $('#total-networks').text(newNetworks);
    }
    
    destroy() {
        if (this.statsInterval) {
            clearInterval(this.statsInterval);
        }
        console.log('📊 Dashboard Module Cleaned Up');
    }
}

// Initialize dashboard when module loads
let dashboardInstance = null;

function initializeDashboard() {
    if (dashboardInstance) {
        dashboardInstance.destroy();
    }
    dashboardInstance = new DashboardModule();
}

// Auto-initialize when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDashboard);
} else {
    initializeDashboard();
}