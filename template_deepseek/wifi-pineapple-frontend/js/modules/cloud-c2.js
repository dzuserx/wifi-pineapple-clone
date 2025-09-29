// Cloud C2 Module JavaScript
class CloudC2Module {
    constructor() {
        this.connectionStatus = 'disconnected';
        this.statsInterval = null;
        this.init();
    }

    async init() {
        console.log('☁️ Cloud C2 Module Initializing...');
        await this.loadCloudC2Data();
        this.setupEventListeners();
        this.setupTabs();
        this.startLiveUpdates();
    }

    async loadCloudC2Data() {
        try {
            const data = await API.getCloudC2Data();
            this.updateCloudC2(data);
        } catch (error) {
            console.error('Failed to load Cloud C2 data:', error);
            Helpers.showNotification('Failed to load Cloud C2 data', 'error');
        }
    }

    updateCloudC2(data) {
        if (data.status) {
            this.updateConnectionStatus(data.status);
        }

        if (data.stats) {
            $('#data-uploaded').text(data.stats.dataUploaded || '0 MB');
            $('#uptime').text(data.stats.uptime || '0h 0m');
        }

        if (data.logs) {
            this.updateConnectionLogs(data.logs);
        }
    }

    updateConnectionStatus(status) {
        this.connectionStatus = status.state;
        const statusElement = $('#connection-status');
        const badgeElement = statusElement.siblings('.badge');

        statusElement.text(status.state.charAt(0).toUpperCase() + status.state.slice(1));

        // Update badge
        badgeElement.removeClass('badge-success badge-danger badge-warning');
        if (status.state === 'connected') {
            statusElement.removeClass('text-danger').addClass('text-success');
            badgeElement.addClass('badge-success').text('Online');
        } else if (status.state === 'connecting') {
            statusElement.removeClass('text-danger text-success').addClass('text-warning');
            badgeElement.addClass('badge-warning').text('Connecting');
        } else {
            statusElement.removeClass('text-success').addClass('text-danger');
            badgeElement.addClass('badge-danger').text('Offline');
        }
    }

    updateConnectionLogs(logs) {
        const logContainer = $('.connection-logs .log-entries');
        logContainer.empty();

        logs.forEach(log => {
            const logClass = this.getLogClass(log.type);
            const logEntry = `<div class="log-entry ${logClass}">${log.message}</div>`;
            logContainer.append(logEntry);
        });
    }

    getLogClass(type) {
        const classes = {
            'info': 'text-muted',
            'success': 'text-success',
            'warning': 'text-warning',
            'error': 'text-danger'
        };
        return classes[type] || 'text-muted';
    }

    setupEventListeners() {
        // Quick action buttons
        $('#connect-cloud').on('click', () => {
            this.switchTab('connecting');
            Helpers.showNotification('Opening connection setup...', 'info');
        });

        $('#view-dashboard').on('click', () => {
            Helpers.showNotification('Opening Cloud C2 dashboard...', 'info');
            // In a real implementation, this would open the cloud dashboard
        });

        $('#sync-data').on('click', () => {
            this.syncData();
        });

        $('#cloud-settings').on('click', () => {
            Helpers.showNotification('Cloud settings functionality would be implemented here', 'info');
        });

        // Connection form
        $('#cloud-connection-form').on('submit', (e) => {
            e.preventDefault();
            this.connectToCloud();
        });

        // Disconnect buttons
        $('#disconnect-btn').on('click', () => {
            this.disconnectFromCloud();
        });

        $('#clear-cache-btn').on('click', () => {
            this.clearCache();
        });

        // Disconnect options
        $('input[name="disconnect-type"]').on('change', (e) => {
            const type = e.target.id;
            Helpers.showNotification(`Selected: ${type.replace('-', ' ')}`, 'info');
        });
    }

    setupTabs() {
        $('#cloudTabs a').on('click', (e) => {
            e.preventDefault();
            const tabId = $(e.target).closest('a').attr('href').substring(1);
            this.switchTab(tabId);
        });
    }

    switchTab(tabId) {
        // Update active tab
        $('#cloudTabs a').removeClass('active');
        $(`#${tabId}-tab`).addClass('active');

        // Show tab content
        $('.tab-pane').removeClass('show active');
        $(`#${tabId}`).addClass('show active');
    }

    async connectToCloud() {
        const formData = new FormData(document.getElementById('cloud-connection-form'));
        const connectionData = Object.fromEntries(formData);

        try {
            Helpers.showNotification('Connecting to Cloud C2...', 'info');

            // Mock connection process
            this.updateConnectionStatus({ state: 'connecting' });

            // Simulate connection delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            this.updateConnectionStatus({ state: 'connected' });
            Helpers.showNotification('Successfully connected to Cloud C2!', 'success');

            // Update logs
            this.updateConnectionLogs([
                { type: 'success', message: 'Connection established successfully' },
                { type: 'info', message: 'Authentication completed' },
                { type: 'info', message: 'Data synchronization started' }
            ]);

        } catch (error) {
            this.updateConnectionStatus({ state: 'disconnected' });
            Helpers.showNotification('Failed to connect to Cloud C2', 'error');
        }
    }

    async disconnectFromCloud() {
        const disconnectType = $('input[name="disconnect-type"]:checked').attr('id');

        try {
            Helpers.showNotification('Disconnecting from Cloud C2...', 'warning');

            this.updateConnectionStatus({ state: 'disconnecting' });

            // Simulate disconnect delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            this.updateConnectionStatus({ state: 'disconnected' });
            Helpers.showNotification('Disconnected from Cloud C2', 'info');

            // Update logs
            this.updateConnectionLogs([
                { type: 'warning', message: 'Connection terminated' },
                { type: 'info', message: 'Data synchronization completed' },
                { type: 'info', message: 'Local cache cleared' }
            ]);

        } catch (error) {
            Helpers.showNotification('Error during disconnect', 'error');
        }
    }

    async syncData() {
        try {
            Helpers.showNotification('Syncing data with Cloud C2...', 'info');

            // Mock sync process
            await new Promise(resolve => setTimeout(resolve, 1000));

            Helpers.showNotification('Data synchronization completed', 'success');

        } catch (error) {
            Helpers.showNotification('Data sync failed', 'error');
        }
    }

    async clearCache() {
        if (confirm('Are you sure you want to clear the local cache? This action cannot be undone.')) {
            try {
                Helpers.showNotification('Clearing local cache...', 'warning');

                // Mock cache clearing
                await new Promise(resolve => setTimeout(resolve, 500));

                Helpers.showNotification('Local cache cleared successfully', 'success');

            } catch (error) {
                Helpers.showNotification('Failed to clear cache', 'error');
            }
        }
    }

    startLiveUpdates() {
        this.statsInterval = setInterval(() => {
            this.updateLiveStats();
        }, 30000);
    }

    updateLiveStats() {
        if (this.connectionStatus === 'connected') {
            // Mock live data updates
            const currentUploaded = parseFloat($('#data-uploaded').text()) || 0;
            const newUploaded = (currentUploaded + Math.random() * 0.5).toFixed(1);
            $('#data-uploaded').text(`${newUploaded} MB`);

            // Update uptime
            const uptimeParts = $('#uptime').text().split(' ');
            let hours = parseInt(uptimeParts[0]) || 0;
            let minutes = parseInt(uptimeParts[1]) || 0;

            minutes += 1;
            if (minutes >= 60) {
                minutes = 0;
                hours += 1;
            }

            $('#uptime').text(`${hours}h ${minutes}m`);
        }
    }

    destroy() {
        if (this.statsInterval) {
            clearInterval(this.statsInterval);
        }
        $(document).off('click', '#connect-cloud, #view-dashboard, #sync-data, #cloud-settings');
        $(document).off('submit', '#cloud-connection-form');
        $(document).off('click', '#disconnect-btn, #clear-cache-btn');
        $(document).off('change', 'input[name="disconnect-type"]');
        console.log('☁️ Cloud C2 Module Cleaned Up');
    }
}

// Initialize Cloud C2 when module loads
let cloudC2Instance = null;

function initializeCloudC2() {
    if (cloudC2Instance) {
        cloudC2Instance.destroy();
    }
    cloudC2Instance = new CloudC2Module();
}

// Auto-initialize when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCloudC2);
} else {
    initializeCloudC2();
}
