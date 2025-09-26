class NetworkScannerModule {
    constructor() {
        this.isScanning = false;
        this.scanResults = [];
        this.init();
    }
    
    async init() {
        this.setupEventListeners();
        this.loadPreviousScans();
    }
    
    setupEventListeners() {
        $('#start-network-scan').on('click', () => {
            this.toggleScan();
        });
        
        $('#scan-settings-form').on('submit', (e) => {
            e.preventDefault();
            this.saveSettings();
        });
        
        $('#export-scan-results').on('click', () => {
            this.exportResults();
        });
        
        $('#clear-scan-results').on('click', () => {
            this.clearResults();
        });
    }
    
    toggleScan() {
        this.isScanning = !this.isScanning;
        const button = $('#start-network-scan');
        
        if (this.isScanning) {
            button.html('<i class="fa fa-stop"></i> Stop Scan');
            button.removeClass('btn-primary').addClass('btn-danger');
            this.startScan();
        } else {
            button.html('<i class="fa fa-play"></i> Start Scan');
            button.removeClass('btn-danger').addClass('btn-primary');
            this.stopScan();
        }
    }
    
    startScan() {
        Helpers.showNotification('Network scan started', 'success');
        $('#scan-status').html('<span class="badge badge-success">Scanning...</span>');
        
        // Simulate scan progress
        this.simulateScanProgress();
    }
    
    stopScan() {
        Helpers.showNotification('Network scan stopped', 'warning');
        $('#scan-status').html('<span class="badge badge-secondary">Ready</span>');
    }
    
    simulateScanProgress() {
        let progress = 0;
        const progressInterval = setInterval(() => {
            if (!this.isScanning) {
                clearInterval(progressInterval);
                return;
            }
            
            progress += 5;
            $('#scan-progress').css('width', progress + '%').text(progress + '%');
            
            if (progress >= 100) {
                clearInterval(progressInterval);
                this.completeScan();
            }
        }, 500);
    }
    
    completeScan() {
        this.isScanning = false;
        $('#start-network-scan').html('<i class="fa fa-play"></i> Start Scan')
            .removeClass('btn-danger').addClass('btn-primary');
        $('#scan-status').html('<span class="badge badge-success">Complete</span>');
        
        // Generate sample scan results
        this.generateSampleResults();
        Helpers.showNotification('Network scan completed', 'success');
    }
    
    generateSampleResults() {
        const sampleNetworks = [
            {
                ssid: 'HomeNetwork',
                bssid: '00:11:22:33:44:55',
                channel: 6,
                signal: -45,
                encryption: 'WPA2',
                clients: 3,
                vendor: 'TP-Link'
            },
            {
                ssid: 'Office_WiFi',
                bssid: 'AA:BB:CC:DD:EE:FF',
                channel: 11,
                signal: -62,
                encryption: 'WPA2',
                clients: 8,
                vendor: 'Cisco'
            },
            {
                ssid: 'Guest Access',
                bssid: '11:22:33:44:55:66',
                channel: 1,
                signal: -78,
                encryption: 'Open',
                clients: 12,
                vendor: 'Netgear'
            }
        ];
        
        this.scanResults = sampleNetworks;
        this.updateResultsTable();
        this.saveResults();
    }
    
    updateResultsTable() {
        const tbody = $('#network-results tbody');
        tbody.empty();
        
        this.scanResults.forEach(network => {
            const signalStrength = this.getSignalStrength(network.signal);
            const row = `
                <tr>
                    <td><strong>${network.ssid}</strong></td>
                    <td><code>${network.bssid}</code></td>
                    <td>${network.channel}</td>
                    <td>
                        <div class="progress" style="height: 10px;">
                            <div class="progress-bar bg-${signalStrength.color}" 
                                 style="width: ${signalStrength.percentage}%"></div>
                        </div>
                        <small>${network.signal} dBm</small>
                    </td>
                    <td><span class="badge badge-${network.encryption === 'Open' ? 'warning' : 'info'}">${network.encryption}</span></td>
                    <td>${network.clients}</td>
                    <td>${network.vendor}</td>
                </tr>
            `;
            tbody.append(row);
        });
    }
    
    getSignalStrength(signal) {
        if (signal >= -50) return { color: 'success', percentage: 100 };
        if (signal >= -60) return { color: 'info', percentage: 80 };
        if (signal >= -70) return { color: 'warning', percentage: 60 };
        return { color: 'danger', percentage: 40 };
    }
    
    saveSettings() {
        const settings = {
            scanType: $('#scan-type').val(),
            channels: $('#scan-channels').val(),
            timeout: $('#scan-timeout').val()
        };
        
        localStorage.setItem('networkScannerSettings', JSON.stringify(settings));
        Helpers.showNotification('Scan settings saved', 'success');
    }
    
    saveResults() {
        const scanData = {
            timestamp: new Date().toISOString(),
            results: this.scanResults
        };
        
        let previousScans = JSON.parse(localStorage.getItem('networkScans') || '[]');
        previousScans.unshift(scanData);
        
        // Keep only last 10 scans
        if (previousScans.length > 10) {
            previousScans = previousScans.slice(0, 10);
        }
        
        localStorage.setItem('networkScans', JSON.stringify(previousScans));
    }
    
    loadPreviousScans() {
        const previousScans = JSON.parse(localStorage.getItem('networkScans') || '[]');
        $('#total-scans').text(previousScans.length);
    }
    
    exportResults() {
        const csvContent = this.generateCSV();
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `network-scan-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        Helpers.showNotification('Scan results exported', 'success');
    }
    
    generateCSV() {
        let csv = 'SSID,BSSID,Channel,Signal,Encryption,Clients,Vendor\n';
        this.scanResults.forEach(network => {
            csv += `"${network.ssid}","${network.bssid}",${network.channel},${network.signal},"${network.encryption}",${network.clients},"${network.vendor}"\n`;
        });
        return csv;
    }
    
    clearResults() {
        if (confirm('Are you sure you want to clear all scan results?')) {
            this.scanResults = [];
            this.updateResultsTable();
            Helpers.showNotification('Scan results cleared', 'info');
        }
    }
}

new NetworkScannerModule();