class URLSnifferModule {
    constructor() {
        this.isSniffing = false;
        this.capturedURLs = [];
        this.init();
    }
    
    async init() {
        await this.loadSettings();
        this.setupEventListeners();
        this.updateUI();
    }
    
    async loadSettings() {
        try {
            // Load saved settings from localStorage or API
            const savedSettings = localStorage.getItem('urlSnifferSettings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                $('#log-https').prop('checked', settings.logHTTPS);
                $('#filter-domains').val(settings.filterDomains.join('\n'));
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }
    
    setupEventListeners() {
        $('#start-sniffing').on('click', () => {
            this.toggleSniffing();
        });
        
        $('#clear-logs').on('click', () => {
            this.clearLogs();
        });
        
        $('#save-sniffer-settings').on('click', () => {
            this.saveSettings();
        });
        
        $('#export-logs').on('click', () => {
            this.exportLogs();
        });
        
        // Simulate incoming URLs when sniffing is active
        setInterval(() => {
            if (this.isSniffing) {
                this.simulateURLCapture();
            }
        }, 3000);
    }
    
    toggleSniffing() {
        this.isSniffing = !this.isSniffing;
        const button = $('#start-sniffing');
        
        if (this.isSniffing) {
            button.html('<i class="bi bi-stop"></i> Stop Sniffing');
            button.removeClass('btn-primary').addClass('btn-danger');
            Helpers.showNotification('URL sniffing started', 'success');
            this.startSniffing();
        } else {
            button.html('<i class="bi bi-play"></i> Start Sniffing');
            button.removeClass('btn-danger').addClass('btn-primary');
            Helpers.showNotification('URL sniffing stopped', 'warning');
            this.stopSniffing();
        }
    }
    
    startSniffing() {
        // Simulate starting the sniffer service
        $('#sniffer-status').html('<span class="badge badge-success">Active</span>');
        this.updateStats();
    }
    
    stopSniffing() {
        // Simulate stopping the sniffer service
        $('#sniffer-status').html('<span class="badge badge-secondary">Inactive</span>');
    }
    
    simulateURLCapture() {
        const sampleURLs = [
            {
                url: 'https://www.google.com/search?q=wifi+pineapple',
                method: 'GET',
                client: 'AA:BB:CC:11:22:33',
                status: 200
            },
            {
                url: 'https://facebook.com/home.php',
                method: 'GET',
                client: 'BB:CC:DD:22:33:44',
                status: 200
            },
            {
                url: 'http://example.com/api/data',
                method: 'POST',
                client: 'CC:DD:EE:33:44:55',
                status: 404
            }
        ];
        
        const randomURL = sampleURLs[Math.floor(Math.random() * sampleURLs.length)];
        this.captureURL(randomURL);
    }
    
    captureURL(urlData) {
        const timestamp = new Date().toLocaleTimeString();
        urlData.timestamp = timestamp;
        this.capturedURLs.unshift(urlData);
        
        // Keep only last 100 URLs
        if (this.capturedURLs.length > 100) {
            this.capturedURLs = this.capturedURLs.slice(0, 100);
        }
        
        this.updateURLTable();
        this.updateStats();
    }
    
    updateURLTable() {
        const tbody = $('#url-table tbody');
        tbody.empty();
        
        this.capturedURLs.forEach(url => {
            const statusClass = url.status === 200 ? 'success' : 
                               url.status >= 400 ? 'danger' : 'warning';
            
            const row = `
                <tr>
                    <td>${url.timestamp}</td>
                    <td><small>${url.client}</small></td>
                    <td><code>${url.url}</code></td>
                    <td><span class="badge badge-info">${url.method}</span></td>
                    <td><span class="badge badge-${statusClass}">${url.status}</span></td>
                </tr>
            `;
            tbody.append(row);
        });
    }
    
    updateStats() {
        $('#total-urls').text(this.capturedURLs.length);
        $('#unique-clients').text(this.getUniqueClients().length);
        $('#data-processed').text(Helpers.formatBytes(this.capturedURLs.length * 1024)); // Simulated data
    }
    
    getUniqueClients() {
        const clients = new Set(this.capturedURLs.map(url => url.client));
        return Array.from(clients);
    }
    
    clearLogs() {
        if (confirm('Are you sure you want to clear all URL logs?')) {
            this.capturedURLs = [];
            this.updateURLTable();
            this.updateStats();
            Helpers.showNotification('URL logs cleared', 'info');
        }
    }
    
    saveSettings() {
        const settings = {
            logHTTPS: $('#log-https').is(':checked'),
            filterDomains: $('#filter-domains').val().split('\n').filter(d => d.trim())
        };
        
        localStorage.setItem('urlSnifferSettings', JSON.stringify(settings));
        Helpers.showNotification('Sniffer settings saved', 'success');
    }
    
    exportLogs() {
        const csvContent = this.generateCSV();
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'url-sniffer-logs.csv';
        a.click();
        Helpers.showNotification('Logs exported successfully', 'success');
    }
    
    generateCSV() {
        let csv = 'Timestamp,Client,URL,Method,Status\n';
        this.capturedURLs.forEach(url => {
            csv += `"${url.timestamp}","${url.client}","${url.url}","${url.method}","${url.status}"\n`;
        });
        return csv;
    }
}

new URLSnifferModule();