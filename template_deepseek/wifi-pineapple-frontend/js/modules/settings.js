// Settings Module JavaScript
class SettingsModule {
    constructor() {
        this.currentTab = 'general';
        this.init();
    }

    async init() {
        console.log('⚙️ Settings Module Initializing...');
        await this.loadSettingsData();
        this.setupEventListeners();
        this.setupTabs();
    }

    async loadSettingsData() {
        try {
            const data = await API.getSettingsData();
            this.updateSettings(data);
        } catch (error) {
            console.error('Failed to load settings data:', error);
            Helpers.showNotification('Failed to load settings data', 'error');
        }
    }

    updateSettings(data) {
        if (data.general) {
            this.populateGeneralSettings(data.general);
        }
        if (data.networking) {
            this.populateNetworkingSettings(data.networking);
        }
        if (data.wifi) {
            this.populateWifiSettings(data.wifi);
        }
        if (data.leds) {
            this.populateLedSettings(data.leds);
        }
        if (data.advanced) {
            this.populateAdvancedSettings(data.advanced);
        }
    }

    populateGeneralSettings(settings) {
        $('#general-settings input[name="deviceName"]').val(settings.deviceName);
        $('#general-settings select[name="timezone"]').val(settings.timezone);
        $('#general-settings select[name="language"]').val(settings.language);
        $('#general-settings input[name="sessionTimeout"]').val(settings.sessionTimeout);

        $('#autostart-pineap').prop('checked', settings.autostart.pineap);
        $('#autostart-web').prop('checked', settings.autostart.web);
        $('#autostart-ssh').prop('checked', settings.autostart.ssh);
    }

    populateNetworkingSettings(settings) {
        // Ethernet settings
        $('#networking input[name="ethIp"]').val(settings.ethernet.ip);
        $('#networking input[name="ethMask"]').val(settings.ethernet.mask);
        $('#networking input[name="ethGateway"]').val(settings.ethernet.gateway);
        $('#networking input[name="ethDns"]').val(settings.ethernet.dns);

        // Wireless settings
        $('#networking select[name="wifiMode"]').val(settings.wireless.mode);
        $('#networking select[name="wifiChannel"]').val(settings.wireless.channel);
        $('#networking select[name="wifiPower"]').val(settings.wireless.txPower);
    }

    populateWifiSettings(settings) {
        $('#wifi input[name="ssid"]').val(settings.ap.ssid);
        $('#wifi select[name="security"]').val(settings.ap.security);
        $('#wifi input[name="password"]').val(settings.ap.password);
        $('#wifi select[name="channel"]').val(settings.ap.channel);

        $('#wifi input[name="beaconInterval"]').val(settings.advanced.beaconInterval);
        $('#wifi input[name="rtsThreshold"]').val(settings.advanced.rtsThreshold);
        $('#wifi input[name="fragThreshold"]').val(settings.advanced.fragThreshold);
        $('#short-preamble').prop('checked', settings.advanced.shortPreamble);
    }

    populateLedSettings(settings) {
        $('#leds select[name="powerLed"]').val(settings.powerLed);
        $('#leds select[name="wifiLed"]').val(settings.wifiLed);
        $('#leds select[name="usbLed"]').val(settings.usbLed);
    }

    populateAdvancedSettings(settings) {
        $('#advanced select[name="cpuGovernor"]').val(settings.cpuGovernor);
        $('#advanced select[name="memoryMgmt"]').val(settings.memoryMgmt);
        $('#enable-swap').prop('checked', settings.enableSwap);

        $('#enable-debug').prop('checked', settings.enableDebug);
        $('#verbose-output').prop('checked', settings.verboseOutput);
        $('#advanced select[name="logLevel"]').val(settings.logLevel);
    }

    setupEventListeners() {
        // Form submissions
        $('#general-settings').on('submit', (e) => {
            e.preventDefault();
            this.saveGeneralSettings();
        });

        $('#networking form').on('submit', (e) => {
            e.preventDefault();
            this.saveNetworkingSettings();
        });

        $('#wifi form').on('submit', (e) => {
            e.preventDefault();
            this.saveWifiSettings();
        });

        $('#leds form').on('submit', (e) => {
            e.preventDefault();
            this.saveLedSettings();
        });

        $('#advanced form').on('submit', (e) => {
            e.preventDefault();
            this.saveAdvancedSettings();
        });

        // LED pattern buttons
        $('.btn-outline-primary').on('click', function() {
            Helpers.showNotification('LED pattern saved', 'success');
        });

        $('.btn-outline-success').on('click', function() {
            Helpers.showNotification('Testing LED pattern...', 'info');
        });

        // Help links
        $('.text-decoration-none').on('click', function(e) {
            e.preventDefault();
            const linkText = $(this).text();
            Helpers.showNotification(`${linkText} - Feature not implemented yet`, 'info');
        });
    }

    setupTabs() {
        $('#settingsTabs a').on('click', (e) => {
            e.preventDefault();
            const tabId = $(e.target).closest('a').attr('href').substring(1);
            this.switchTab(tabId);
        });
    }

    switchTab(tabId) {
        // Update active tab
        $('#settingsTabs a').removeClass('active');
        $(`#${tabId}-tab`).addClass('active');

        // Show tab content
        $('.tab-pane').removeClass('show active');
        $(`#${tabId}`).addClass('show active');

        this.currentTab = tabId;
    }

    async saveGeneralSettings() {
        const formData = new FormData(document.getElementById('general-settings'));
        const settings = {
            deviceName: formData.get('deviceName'),
            timezone: formData.get('timezone'),
            language: formData.get('language'),
            sessionTimeout: parseInt(formData.get('sessionTimeout')),
            autostart: {
                pineap: $('#autostart-pineap').is(':checked'),
                web: $('#autostart-web').is(':checked'),
                ssh: $('#autostart-ssh').is(':checked')
            }
        };

        try {
            await API.updateGeneralSettings(settings);
            Helpers.showNotification('General settings saved successfully', 'success');
        } catch (error) {
            Helpers.showNotification('Failed to save general settings', 'error');
        }
    }

    async saveNetworkingSettings() {
        const settings = {
            ethernet: {
                ip: $('#networking input[name="ethIp"]').val(),
                mask: $('#networking input[name="ethMask"]').val(),
                gateway: $('#networking input[name="ethGateway"]').val(),
                dns: $('#networking input[name="ethDns"]').val()
            },
            wireless: {
                mode: $('#networking select[name="wifiMode"]').val(),
                channel: $('#networking select[name="wifiChannel"]').val(),
                txPower: $('#networking select[name="wifiPower"]').val()
            }
        };

        try {
            await API.updateNetworkingSettings(settings);
            Helpers.showNotification('Networking settings applied successfully', 'success');
        } catch (error) {
            Helpers.showNotification('Failed to apply networking settings', 'error');
        }
    }

    async saveWifiSettings() {
        const settings = {
            ap: {
                ssid: $('#wifi input[name="ssid"]').val(),
                security: $('#wifi select[name="security"]').val(),
                password: $('#wifi input[name="password"]').val(),
                channel: $('#wifi select[name="channel"]').val()
            },
            advanced: {
                beaconInterval: parseInt($('#wifi input[name="beaconInterval"]').val()),
                rtsThreshold: parseInt($('#wifi input[name="rtsThreshold"]').val()),
                fragThreshold: parseInt($('#wifi input[name="fragThreshold"]').val()),
                shortPreamble: $('#short-preamble').is(':checked')
            }
        };

        try {
            await API.updateWifiSettings(settings);
            Helpers.showNotification('WiFi settings applied successfully', 'success');
        } catch (error) {
            Helpers.showNotification('Failed to apply WiFi settings', 'error');
        }
    }

    async saveLedSettings() {
        const settings = {
            powerLed: $('#leds select[name="powerLed"]').val(),
            wifiLed: $('#leds select[name="wifiLed"]').val(),
            usbLed: $('#leds select[name="usbLed"]').val()
        };

        try {
            await API.updateLedSettings(settings);
            Helpers.showNotification('LED settings applied successfully', 'success');
        } catch (error) {
            Helpers.showNotification('Failed to apply LED settings', 'error');
        }
    }

    async saveAdvancedSettings() {
        const settings = {
            cpuGovernor: $('#advanced select[name="cpuGovernor"]').val(),
            memoryMgmt: $('#advanced select[name="memoryMgmt"]').val(),
            enableSwap: $('#enable-swap').is(':checked'),
            enableDebug: $('#enable-debug').is(':checked'),
            verboseOutput: $('#verbose-output').is(':checked'),
            logLevel: $('#advanced select[name="logLevel"]').val()
        };

        try {
            await API.updateAdvancedSettings(settings);
            Helpers.showNotification('Advanced settings applied successfully. System restart may be required.', 'warning');
        } catch (error) {
            Helpers.showNotification('Failed to apply advanced settings', 'error');
        }
    }

    destroy() {
        $(document).off('submit', '#general-settings, #networking form, #wifi form, #leds form, #advanced form');
        $(document).off('click', '.btn-outline-primary, .btn-outline-success, .text-decoration-none');
        console.log('⚙️ Settings Module Cleaned Up');
    }
}

// Initialize settings when module loads
let settingsInstance = null;

function initializeSettings() {
    if (settingsInstance) {
        settingsInstance.destroy();
    }
    settingsInstance = new SettingsModule();
}

// Auto-initialize when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSettings);
} else {
    initializeSettings();
}
