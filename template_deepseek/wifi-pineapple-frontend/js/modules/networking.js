// networking.js placeholder
class NetworkingModule {
    constructor() {
        this.init();
    }
    
    async init() {
        await this.loadData();
        this.setupEventListeners();
    }
    
    async loadData() {
        try {
            const data = await API.getNetworkingData();
            this.updateNetworkingData(data);
        } catch (error) {
            Helpers.showNotification('Failed to load networking data', 'error');
        }
    }
    
    updateNetworkingData(data) {
        // Update interface status
        if (data.interfaces) {
            this.updateInterfaces(data.interfaces);
        }
        
        // Update DHCP status
        if (data.dhcp) {
            this.updateDHCP(data.dhcp);
        }
        
        // Update routing table
        if (data.routing) {
            this.updateRouting(data.routing);
        }
    }
    
    updateInterfaces(interfaces) {
        const container = $('#interface-list');
        if (container.length && interfaces) {
            const html = interfaces.map(intf => `
                <div class="interface-item">
                    <div class="interface-name">
                        <strong>${intf.name}</strong>
                        <span class="status-badge ${intf.status === 'up' ? 'active' : 'inactive'}">
                            ${intf.status}
                        </span>
                    </div>
                    <div class="interface-details">
                        <small>IP: ${intf.ip || 'N/A'}</small>
                        <small>MAC: ${intf.mac}</small>
                    </div>
                </div>
            `).join('');
            container.html(html);
        }
    }
    
    updateDHCP(dhcp) {
        if (dhcp.enabled !== undefined) {
            $('#dhcp-enabled').prop('checked', dhcp.enabled);
        }
        if (dhcp.leaseTime) {
            $('#lease-time').val(dhcp.leaseTime);
        }
        if (dhcp.range) {
            $('#dhcp-range-start').val(dhcp.range.start);
            $('#dhcp-range-end').val(dhcp.range.end);
        }
    }
    
    updateRouting(routing) {
        const container = $('#routing-table');
        if (container.length && routing) {
            const html = routing.map(route => `
                <tr>
                    <td>${route.destination}</td>
                    <td>${route.gateway}</td>
                    <td>${route.interface}</td>
                    <td>${route.metric}</td>
                </tr>
            `).join('');
            container.find('tbody').html(html);
        }
    }
    
    setupEventListeners() {
        $('#save-network-settings').on('click', () => {
            this.saveNetworkSettings();
        });
        
        $('#restart-network').on('click', () => {
            this.restartNetwork();
        });
        
        $('#toggle-interface').on('click', () => {
            this.toggleInterface();
        });
    }
    
    saveNetworkSettings() {
        const settings = {
            hostname: $('#hostname').val(),
            domain: $('#domain').val(),
            dhcp: {
                enabled: $('#dhcp-enabled').is(':checked'),
                leaseTime: $('#lease-time').val(),
                range: {
                    start: $('#dhcp-range-start').val(),
                    end: $('#dhcp-range-end').val()
                }
            }
        };
        
        Helpers.showNotification('Network settings saved', 'success');
    }
    
    restartNetwork() {
        Helpers.showNotification('Restarting network services...', 'info');
        setTimeout(() => {
            Helpers.showNotification('Network services restarted successfully', 'success');
        }, 2000);
    }
    
    toggleInterface() {
        const button = $('#toggle-interface');
        const interfaceName = $('#interface-select').val();
        const isUp = button.text().includes('Down');
        
        if (isUp) {
            button.html(`<i class="fa fa-toggle-off"></i> Bring Up ${interfaceName}`);
            button.removeClass('btn-warning').addClass('btn-success');
            Helpers.showNotification(`Interface ${interfaceName} brought down`, 'warning');
        } else {
            button.html(`<i class="fa fa-toggle-on"></i> Bring Down ${interfaceName}`);
            button.removeClass('btn-success').addClass('btn-warning');
            Helpers.showNotification(`Interface ${interfaceName} brought up`, 'success');
        }
    }
}

new NetworkingModule();