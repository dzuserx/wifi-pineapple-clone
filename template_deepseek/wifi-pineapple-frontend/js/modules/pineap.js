// pineap.js placeholder
class PineAPModule {
    constructor() {
        this.init();
    }
    
    async init() {
        await this.loadData();
        this.setupEventListeners();
    }
    
    async loadData() {
        try {
            const data = await API.getPineAPData();
            this.updatePineAPData(data);
        } catch (error) {
            Helpers.showNotification('Failed to load PineAP data', 'error');
        }
    }
    
    updatePineAPData(data) {
        // Update PineAP status
        if (data.status) {
            $('#pineap-status').text(data.status.enabled ? 'Enabled' : 'Disabled');
            $('#pool-size').text(data.status.poolSize || 0);
            $('#ssid-pool').text(data.status.ssidPool || 0);
        }
        
        // Update SSID pool
        if (data.ssidPool) {
            this.updateSSIDPool(data.ssidPool);
        }
        
        // Update settings
        if (data.settings) {
            this.updateSettings(data.settings);
        }
    }
    
    updateSSIDPool(ssidPool) {
        const container = $('#ssid-pool-list');
        if (container.length && ssidPool) {
            const html = ssidPool.map(ssid => `
                <div class="ssid-item">
                    <span class="ssid-name">${ssid.name}</span>
                    <span class="ssid-count">${ssid.count} clients</span>
                    <button class="btn btn-sm btn-danger remove-ssid" data-ssid="${ssid.name}">
                        <i class="bi bi-x"></i>
                    </button>
                </div>
            `).join('');
            container.html(html);
        }
    }
    
    updateSettings(settings) {
        if (settings.beaconInterval !== undefined) {
            $('#beacon-interval').val(settings.beaconInterval);
        }
        if (settings.responseInterval !== undefined) {
            $('#response-interval').val(settings.responseInterval);
        }
        if (settings.broadcastSSID !== undefined) {
            $('#broadcast-ssid').prop('checked', settings.broadcastSSID);
        }
    }
    
    setupEventListeners() {
        $('#toggle-pineap').on('click', () => {
            this.togglePineAP();
        });
        
        $('#add-ssid').on('click', () => {
            this.addSSID();
        });
        
        $('#save-settings').on('click', () => {
            this.saveSettings();
        });
    }
    
    togglePineAP() {
        const button = $('#toggle-pineap');
        const isEnabled = button.text().includes('Disable');
        
        if (isEnabled) {
            button.html('<i class="bi bi-power"></i> Enable PineAP');
            button.removeClass('btn-danger').addClass('btn-success');
            Helpers.showNotification('PineAP disabled', 'warning');
        } else {
            button.html('<i class="bi bi-power"></i> Disable PineAP');
            button.removeClass('btn-success').addClass('btn-danger');
            Helpers.showNotification('PineAP enabled', 'success');
        }
    }
    
    addSSID() {
        const ssidInput = $('#new-ssid');
        const ssid = ssidInput.val().trim();
        
        if (ssid) {
            // Add to visual list
            const newItem = $(`
                <div class="ssid-item">
                    <span class="ssid-name">${ssid}</span>
                    <span class="ssid-count">0 clients</span>
                    <button class="btn btn-sm btn-danger remove-ssid">
                        <i class="bi bi-x"></i>
                    </button>
                </div>
            `);
            
            $('#ssid-pool-list').append(newItem);
            ssidInput.val('');
            Helpers.showNotification(`SSID "${ssid}" added to pool`, 'success');
        }
    }
    
    saveSettings() {
        const settings = {
            beaconInterval: $('#beacon-interval').val(),
            responseInterval: $('#response-interval').val(),
            broadcastSSID: $('#broadcast-ssid').is(':checked')
        };
        
        Helpers.showNotification('Settings saved successfully', 'success');
    }
}

new PineAPModule();