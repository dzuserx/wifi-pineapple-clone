// dashboard.js placeholder
// Dashboard module functionality
class DashboardModule {
    constructor() {
        this.init();
    }
    
    async init() {
        await this.loadData();
        this.setupEventListeners();
    }
    
    async loadData() {
        try {
            const data = await API.getDashboardData();
            this.updateDashboard(data);
        } catch (error) {
            this.showError('Failed to load dashboard data');
        }
    }
    
    updateDashboard(data) {
        // Update status cards
        if (data.status) {
            $('#pineap-status').text(data.status.pineap);
            $('#client-count').text(data.status.clients);
            $('#security-status').text(data.status.security);
            $('#uptime').text(data.status.uptime);
        }
        
        // Update recent activity
        if (data.recentActivity) {
            this.updateRecentActivity(data.recentActivity);
        }
    }
    
    updateRecentActivity(activities) {
        const container = $('#recent-activity');
        if (container.length) {
            const html = activities.map(activity => `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="bi bi-${activity.icon}"></i>
                    </div>
                    <div class="activity-content">
                        <p>${activity.description}</p>
                        <small class="text-muted">${activity.time}</small>
                    </div>
                </div>
            `).join('');
            container.html(html);
        }
    }
    
    setupEventListeners() {
        // Refresh button
        $('#refresh-dashboard').on('click', () => {
            this.loadData();
        });
    }
    
    showError(message) {
        // Show error message
        const alert = $(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="close" data-dismiss="alert">
                    <span>&times;</span>
                </button>
            </div>
        `);
        $('#module-content').prepend(alert);
    }
}

// Initialize dashboard when module loads
new DashboardModule();