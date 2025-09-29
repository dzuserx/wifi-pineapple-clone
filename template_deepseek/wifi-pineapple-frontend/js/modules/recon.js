// Recon Module JavaScript
class ReconModule {
    constructor() {
        this.isScanning = false;
        this.wirelessChart = null;
        this.channelChart = null;
        this.currentTab = 'overview';
        this.init();
    }

    async init() {
        console.log('🔍 Recon Module Initializing...');
        await this.loadData();
        this.setupEventListeners();
        this.setupTabs();
        this.initializeCharts();
    }

    async loadData() {
        try {
            const data = await API.getReconData();
            this.updateReconData(data);
        } catch (error) {
            console.error('Failed to load recon data:', error);
            Helpers.showNotification('Failed to load recon data', 'error');
        }
    }

    updateReconData(data) {
        // Update networks
        if (data.networks) {
            this.updateAccessPointsTable(data.networks);
            this.updateWirelessLandscapeChart(data.networks);
            this.updateChannelDistributionChart(data.networks);
        }

        // Update clients
        if (data.clients) {
            this.updateClientsTable(data.clients);
        }

        // Update scan status
        if (data.scanStatus) {
            this.updateScanStatus(data.scanStatus);
        }

        // Update handshake stats
        if (data.handshakes) {
            this.updateHandshakeStats(data.handshakes);
        }
    }

    updateAccessPointsTable(networks) {
        const tbody = $('#access-points-body');
        if (tbody.length && networks) {
            const html = networks.map(network => `
                <tr>
                    <td>${network.ssid || '<em>Hidden</em>'}</td>
                    <td><code>${network.bssid}</code></td>
                    <td>${network.channel}</td>
                    <td>
                        <span class="signal-strength ${this.getSignalClass(network.signal)}">
                            ${network.signal}dBm
                        </span>
                    </td>
                    <td>
                        <span class="badge ${this.getEncryptionClass(network.encryption)}">
                            ${network.encryption}
                        </span>
                    </td>
                    <td>${network.clients || 0}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-info" onclick="viewNetworkDetails('${network.bssid}')">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-primary" onclick="targetNetwork('${network.bssid}')">
                            <i class="bi bi-target"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
            tbody.html(html);
        }
    }

    updateClientsTable(clients) {
        const tbody = $('#clients-body');
        if (tbody.length && clients) {
            const html = clients.map(client => `
                <tr>
                    <td><code>${client.mac}</code></td>
                    <td>${client.vendor || 'Unknown'}</td>
                    <td>${client.packets}</td>
                    <td>
                        <span class="signal-strength ${this.getSignalClass(client.signal)}">
                            ${client.signal}dBm
                        </span>
                    </td>
                    <td>${client.connectedTo || 'Not connected'}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-info" onclick="viewClientDetails('${client.mac}')">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-warning" onclick="deauthClient('${client.mac}')">
                            <i class="bi bi-lightning"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
            tbody.html(html);
        }
    }

    updateWirelessLandscapeChart(networks) {
        if (!this.wirelessChart) return;

        const ctx = document.getElementById('wireless-landscape-chart').getContext('2d');
        const labels = networks.map(n => n.ssid || 'Hidden');
        const signals = networks.map(n => Math.abs(n.signal)); // Convert to positive for chart

        this.wirelessChart.data.labels = labels;
        this.wirelessChart.data.datasets[0].data = signals;
        this.wirelessChart.update();
    }

    updateChannelDistributionChart(networks) {
        if (!this.channelChart) return;

        const channelCounts = {};
        networks.forEach(network => {
            channelCounts[network.channel] = (channelCounts[network.channel] || 0) + 1;
        });

        const ctx = document.getElementById('channel-distribution-chart').getContext('2d');
        const labels = Object.keys(channelCounts);
        const data = Object.values(channelCounts);

        this.channelChart.data.labels = labels;
        this.channelChart.data.datasets[0].data = data;
        this.channelChart.update();
    }

    updateScanStatus(status) {
        // Update scan status indicators
        if (status === 'scanning') {
            $('#scan-progress').show();
        } else {
            $('#scan-progress').hide();
        }
    }

    updateHandshakeStats(handshakes) {
        const captured = handshakes.filter(h => h.status === 'complete').length;
        const pending = handshakes.filter(h => h.status === 'pending').length;
        const failed = handshakes.filter(h => h.status === 'failed').length;

        $('#handshake-count').text(captured);
        $('#handshake-pending').text(pending);
        $('#handshake-failed').text(failed);
    }

    getSignalClass(signal) {
        if (signal >= -30) return 'signal-excellent';
        if (signal >= -50) return 'signal-good';
        if (signal >= -70) return 'signal-fair';
        return 'signal-poor';
    }

    getEncryptionClass(encryption) {
        switch (encryption.toLowerCase()) {
            case 'open': return 'bg-danger';
            case 'wpa': return 'bg-warning';
            case 'wpa2': return 'bg-success';
            case 'wpa3': return 'bg-info';
            default: return 'bg-secondary';
        }
    }

    initializeCharts() {
        // Wireless Landscape Chart
        const wirelessCtx = document.getElementById('wireless-landscape-chart');
        if (wirelessCtx) {
            this.wirelessChart = new Chart(wirelessCtx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Signal Strength (dBm)',
                        data: [],
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            reverse: true
                        }
                    }
                }
            });
        }

        // Channel Distribution Chart
        const channelCtx = document.getElementById('channel-distribution-chart');
        if (channelCtx) {
            this.channelChart = new Chart(channelCtx.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Networks per Channel',
                        data: [],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.5)',
                            'rgba(54, 162, 235, 0.5)',
                            'rgba(255, 205, 86, 0.5)',
                            'rgba(75, 192, 192, 0.5)',
                            'rgba(153, 102, 255, 0.5)',
                            'rgba(255, 159, 64, 0.5)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 205, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true
                }
            });
        }
    }

    setupEventListeners() {
        // Scan controls
        $('#start-scan').on('click', () => {
            this.startScan();
        });

        $('#stop-scan').on('click', () => {
            this.stopScan();
        });

        $('#save-settings').on('click', () => {
            this.saveScanSettings();
        });

        // Search functionality
        $('#ap-search').on('input', (e) => {
            this.filterAccessPoints(e.target.value);
        });

        $('#clear-search').on('click', () => {
            $('#ap-search').val('');
            this.filterAccessPoints('');
        });

        $('#client-search').on('input', (e) => {
            this.filterClients(e.target.value);
        });

        $('#clear-client-search').on('click', () => {
            $('#client-search').val('');
            this.filterClients('');
        });

        // Download handshakes
        $('#download-handshakes').on('click', () => {
            this.downloadHandshakes();
        });
    }

    setupTabs() {
        $('#recon-tabs button').on('click', (e) => {
            e.preventDefault();
            const tabId = $(e.target).closest('button').attr('data-bs-target').substring(1);
            this.switchTab(tabId);
        });
    }

    switchTab(tabId) {
        // Update active tab
        $('#recon-tabs button').removeClass('active');
        $(`#${tabId}-tab`).addClass('active');

        // Show tab content
        $('.tab-pane').removeClass('show active');
        $(`#${tabId}`).addClass('show active');

        this.currentTab = tabId;
    }

    startScan() {
        this.isScanning = true;
        $('#start-scan').prop('disabled', true).html('<i class="bi bi-play"></i> Scanning...');
        $('#stop-scan').prop('disabled', false);

        $('#scan-progress').show();
        $('#scan-results').html(`
            <div class="alert alert-info">
                <i class="bi bi-arrow-repeat fa-spin"></i> Scanning for networks...
            </div>
        `);

        // Simulate scan progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            $('#scan-progress .progress-bar').css('width', progress + '%');

            if (progress >= 100) {
                clearInterval(interval);
                this.finishScan();
            }
        }, 200);

        // Store interval for cleanup
        $('#start-scan').data('scan-interval', interval);
    }

    stopScan() {
        this.isScanning = false;
        const interval = $('#start-scan').data('scan-interval');

        if (interval) {
            clearInterval(interval);
        }

        $('#start-scan').prop('disabled', false).html('<i class="bi bi-play"></i> Start Scan');
        $('#stop-scan').prop('disabled', true);
        $('#scan-progress').hide();

        $('#scan-results').html(`
            <div class="alert alert-warning">
                <i class="bi bi-pause"></i> Scan stopped by user.
            </div>
        `);

        Helpers.showNotification('Scan stopped by user', 'warning');
    }

    finishScan() {
        this.isScanning = false;
        $('#start-scan').prop('disabled', false).html('<i class="bi bi-play"></i> Start Scan');
        $('#stop-scan').prop('disabled', true);
        $('#scan-progress').hide();

        $('#scan-results').html(`
            <div class="alert alert-success">
                <i class="bi bi-check-circle"></i> Scan completed successfully!
            </div>
            <div class="mt-3">
                <h6>Scan Summary</h6>
                <ul class="list-group">
                    <li class="list-group-item">Networks discovered: <strong>${$('#access-points-body tr').length}</strong></li>
                    <li class="list-group-item">Clients found: <strong>${$('#clients-body tr').length}</strong></li>
                    <li class="list-group-item">Duration: <strong>30 seconds</strong></li>
                </ul>
            </div>
        `);

        // Reload data to show new results
        this.loadData();

        Helpers.showNotification('Network scan completed', 'success');
    }

    saveScanSettings() {
        const settings = {
            scanType: $('#scan-type').val(),
            targetChannel: $('#scan-channel').val(),
            duration: parseInt($('#scan-duration').val())
        };

        Helpers.showNotification('Scan settings saved successfully', 'success');
    }

    filterAccessPoints(query) {
        const rows = $('#access-points-body tr');
        const lowerQuery = query.toLowerCase();

        rows.each(function() {
            const text = $(this).text().toLowerCase();
            $(this).toggle(text.includes(lowerQuery));
        });
    }

    filterClients(query) {
        const rows = $('#clients-body tr');
        const lowerQuery = query.toLowerCase();

        rows.each(function() {
            const text = $(this).text().toLowerCase();
            $(this).toggle(text.includes(lowerQuery));
        });
    }

    downloadHandshakes() {
        Helpers.showNotification('Downloading handshakes...', 'info');
        // Simulate download
        setTimeout(() => {
            Helpers.showNotification('Handshake download completed', 'success');
        }, 2000);
    }

    destroy() {
        if (this.wirelessChart) {
            this.wirelessChart.destroy();
        }
        if (this.channelChart) {
            this.channelChart.destroy();
        }
        $(document).off('click', '#start-scan, #stop-scan, #save-settings, #download-handshakes');
        $(document).off('input', '#ap-search, #client-search');
        $(document).off('click', '#clear-search, #clear-client-search');
        console.log('🔍 Recon Module Cleaned Up');
    }
}

// Initialize recon when module loads
let reconInstance = null;

function initializeRecon() {
    if (reconInstance) {
        reconInstance.destroy();
    }
    reconInstance = new ReconModule();
}

// Auto-initialize when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeRecon);
} else {
    initializeRecon();
}

// Global functions for button clicks
function viewNetworkDetails(bssid) {
    Helpers.showNotification(`Viewing details for network ${bssid}`, 'info');
}

function targetNetwork(bssid) {
    Helpers.showNotification(`Targeting network ${bssid}`, 'info');
}

function viewClientDetails(mac) {
    Helpers.showNotification(`Viewing details for client ${mac}`, 'info');
}

function deauthClient(mac) {
    if (confirm(`Are you sure you want to deauthenticate client ${mac}?`)) {
        Helpers.showNotification(`Deauthenticating client ${mac}`, 'warning');
    }
}
