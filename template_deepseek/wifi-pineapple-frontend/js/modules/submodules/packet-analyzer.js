class PacketAnalyzerModule {
    constructor() {
        this.isAnalyzing = false;
        this.packets = [];
        this.filters = {};
        this.init();
    }
    
    async init() {
        this.loadSettings();
        this.setupEventListeners();
        this.updateUI();
    }
    
    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('packetAnalyzerSettings');
            if (savedSettings) {
                this.filters = JSON.parse(savedSettings);
                this.applySavedFilters();
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }
    
    setupEventListeners() {
        $('#start-analysis').on('click', () => {
            this.toggleAnalysis();
        });
        
        $('#apply-filters').on('click', () => {
            this.applyFilters();
        });
        
        $('#clear-packets').on('click', () => {
            this.clearPackets();
        });
        
        $('#export-packets').on('click', () => {
            this.exportPackets();
        });
        
        // Simulate packet capture when active
        setInterval(() => {
            if (this.isAnalyzing) {
                this.simulatePacketCapture();
            }
        }, 2000);
    }
    
    toggleAnalysis() {
        this.isAnalyzing = !this.isAnalyzing;
        const button = $('#start-analysis');
        
        if (this.isAnalyzing) {
            button.html('<i class="fa fa-stop"></i> Stop Analysis');
            button.removeClass('btn-primary').addClass('btn-danger');
            this.startAnalysis();
        } else {
            button.html('<i class="fa fa-play"></i> Start Analysis');
            button.removeClass('btn-danger').addClass('btn-primary');
            this.stopAnalysis();
        }
    }
    
    startAnalysis() {
        Helpers.showNotification('Packet analysis started', 'success');
        $('#analysis-status').html('<span class="badge badge-success">Analyzing</span>');
    }
    
    stopAnalysis() {
        Helpers.showNotification('Packet analysis stopped', 'warning');
        $('#analysis-status').html('<span class="badge badge-secondary">Ready</span>');
    }
    
    simulatePacketCapture() {
        const samplePackets = [
            {
                timestamp: new Date().toLocaleTimeString(),
                source: '192.168.1.100',
                destination: '8.8.8.8',
                protocol: 'DNS',
                length: 78,
                info: 'Standard query'
            },
            {
                timestamp: new Date().toLocaleTimeString(),
                source: '192.168.1.101',
                destination: '142.250.189.206',
                protocol: 'HTTP',
                length: 543,
                info: 'GET /search?q=wifi'
            },
            {
                timestamp: new Date().toLocaleTimeString(),
                source: '192.168.1.102',
                destination: '172.217.168.174',
                protocol: 'HTTPS',
                length: 1289,
                info: 'TLS Client Hello'
            }
        ];
        
        const randomPacket = samplePackets[Math.floor(Math.random() * samplePackets.length)];
        this.capturePacket(randomPacket);
    }
    
    capturePacket(packet) {
        // Apply filters
        if (this.filters.protocol && this.filters.protocol !== 'all' && packet.protocol !== this.filters.protocol) {
            return;
        }
        
        if (this.filters.minLength && packet.length < this.filters.minLength) {
            return;
        }
        
        this.packets.unshift(packet);
        
        // Keep only last 200 packets
        if (this.packets.length > 200) {
            this.packets = this.packets.slice(0, 200);
        }
        
        this.updatePacketsTable();
        this.updateStats();
    }
    
    updatePacketsTable() {
        const tbody = $('#packets-table tbody');
        tbody.empty();
        
        this.packets.forEach(packet => {
            const protocolClass = this.getProtocolClass(packet.protocol);
            const row = `
                <tr>
                    <td>${packet.timestamp}</td>
                    <td><code>${packet.source}</code></td>
                    <td><code>${packet.destination}</code></td>
                    <td><span class="badge badge-${protocolClass}">${packet.protocol}</span></td>
                    <td>${packet.length}</td>
                    <td><small>${packet.info}</small></td>
                </tr>
            `;
            tbody.append(row);
        });
    }
    
    getProtocolClass(protocol) {
        const classes = {
            'HTTP': 'info',
            'HTTPS': 'success',
            'DNS': 'warning',
            'TCP': 'primary',
            'UDP': 'secondary'
        };
        return classes[protocol] || 'dark';
    }
    
    applyFilters() {
        this.filters = {
            protocol: $('#filter-protocol').val(),
            minLength: $('#filter-min-length').val() || 0,
            sourceIP: $('#filter-source-ip').val(),
            destinationIP: $('#filter-destination-ip').val()
        };
        
        localStorage.setItem('packetAnalyzerSettings', JSON.stringify(this.filters));
        Helpers.showNotification('Filters applied', 'success');
        
        // Re-filter existing packets
        this.updatePacketsTable();
    }
    
    applySavedFilters() {
        $('#filter-protocol').val(this.filters.protocol || 'all');
        $('#filter-min-length').val(this.filters.minLength || '');
        $('#filter-source-ip').val(this.filters.sourceIP || '');
        $('#filter-destination-ip').val(this.filters.destinationIP || '');
    }
    
    updateStats() {
        $('#total-packets').text(this.packets.length);
        
        const protocols = {};
        this.packets.forEach(packet => {
            protocols[packet.protocol] = (protocols[packet.protocol] || 0) + 1;
        });
        
        $('#protocol-stats').empty();
        Object.entries(protocols).forEach(([protocol, count]) => {
            $('#protocol-stats').append(`
                <div class="stat-item">
                    <span>${protocol}:</span>
                    <strong>${count}</strong>
                </div>
            `);
        });
    }
    
    clearPackets() {
        if (confirm('Are you sure you want to clear all captured packets?')) {
            this.packets = [];
            this.updatePacketsTable();
            this.updateStats();
            Helpers.showNotification('Packets cleared', 'info');
        }
    }
    
    exportPackets() {
        const csvContent = this.generateCSV();
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `packet-capture-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        Helpers.showNotification('Packets exported', 'success');
    }
    
    generateCSV() {
        let csv = 'Timestamp,Source,Destination,Protocol,Length,Info\n';
        this.packets.forEach(packet => {
            csv += `"${packet.timestamp}","${packet.source}","${packet.destination}","${packet.protocol}",${packet.length},"${packet.info}"\n`;
        });
        return csv;
    }
    
    updateUI() {
        this.applySavedFilters();
        this.updateStats();
    }
}

new PacketAnalyzerModule();