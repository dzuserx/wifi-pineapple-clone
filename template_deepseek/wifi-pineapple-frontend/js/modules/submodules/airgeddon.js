class AirgeddonModule {
    constructor() {
        this.currentMenu = 'interface-setup';
        this.menuStack = [];
        this.menus = {
            'interface-setup': [
                { key: 'select-interface', label: '1. Select Interface', description: 'Select network interface' },
                { key: 'interface-mode', label: '2. Put Interface in Monitor or Managed Mode', description: 'Select mode' },
                { key: 'interface-validation', label: '3. Validation', description: 'Validate and continue' }
            ],
            'target-discovery': [
                { key: 'network-list', label: '4. Explore for Targets', description: 'List of networks' },
                { key: 'target-selection', label: 'Select Target Network', description: 'Select target for attack' }
            ],
            'attack-methods': [
                { key: 'dos-attacks', label: '5. DOS Attacks Menu' },
                { key: 'handshake-tools', label: '6. Handshake Tools Menu' },
                { key: 'offline-wpa', label: '7. Offline WPA/WPA2 Decrypt Menu' },
                { key: 'wps-attacks', label: '8. WPS Attacks Menu' },
                { key: 'evil-twin', label: '9. Evil Twin Attacks Menu' },
                { key: 'wep-attacks', label: '10. WEP Attacks Menu' }
            ],
            'advanced-features': [
                { key: 'persistence-config', label: 'Persistence & Configuration' },
                { key: 'logging-reporting', label: 'Logging & Reporting' },
                { key: 'utility-functions', label: 'Utility Functions' }
            ]
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderInterfaceSetup();
    }

    setupEventListeners() {
        $('#airgeddon-menu').on('click', '.list-group-item', (e) => {
            const menuKey = $(e.currentTarget).data('menu');
            this.navigateToMenu(menuKey);
        });

        $('#back-to-main').on('click', () => {
            this.returnToMainMenu();
        });

        $('#airgeddon-submenu').on('click', '.submenu-item', (e) => {
            const action = $(e.currentTarget).data('action');
            this.handleAction(action);
        });
    }

    navigateToMenu(menuKey) {
        this.menuStack.push(this.currentMenu);
        this.slideOutCurrentMenu(() => {
            this.currentMenu = menuKey;
            switch(menuKey) {
                case 'interface-setup':
                    this.renderInterfaceSetup();
                    break;
                case 'target-discovery':
                    this.renderTargetDiscovery();
                    break;
                case 'attack-methods':
                    this.renderAttackMethods();
                    break;
                case 'advanced-features':
                    this.renderAdvancedFeatures();
                    break;
                default:
                    this.renderSubMenu(menuKey);
            }
            this.slideInNewMenu();
        });
    }

    slideOutCurrentMenu(callback) {
        if ($('#airgeddon-menu').is(':visible')) {
            $('#airgeddon-menu .card').addClass('slide-left-out');
            setTimeout(() => {
                $('#airgeddon-menu').hide();
                $('#airgeddon-menu .card').removeClass('slide-left-out');
                callback();
            }, 500);
        } else {
            $('#airgeddon-submenu').addClass('slide-left-out');
            setTimeout(() => {
                $('#airgeddon-submenu').hide().removeClass('slide-left-out');
                callback();
            }, 500);
        }
    }

    slideInNewMenu() {
        if (this.currentMenu === 'interface-setup' || this.currentMenu === 'target-discovery' || this.currentMenu === 'attack-methods' || this.currentMenu === 'advanced-features') {
            $('#airgeddon-menu').show();
            $('#airgeddon-menu .card').addClass('slide-right-in');
            setTimeout(() => {
                $('#airgeddon-menu .card').removeClass('slide-right-in');
            }, 500);
        } else {
            $('#airgeddon-submenu').show().addClass('slide-right-in');
            setTimeout(() => {
                $('#airgeddon-submenu').removeClass('slide-right-in');
            }, 500);
        }
    }

    returnToMainMenu() {
        this.menuStack = [];
        this.currentMenu = 'interface-setup';
        this.slideOutCurrentMenu(() => {
            this.renderInterfaceSetup();
            this.slideInNewMenu();
        });
    }

    renderInterfaceSetup() {
        let content = `
        <div class="menu-section-card mb-4">
            <div class="card">
                <div class="card-header">
                    <h5 class="section-title mb-0">────── Phase 1: Interface Setup ──────────────────────────────────────────────</h5>
                </div>
                <div class="card-body">
                    <label for="interface-select">Select Interface:</label>
                    <select id="interface-select" class="form-select mb-3">
                        <option value="wlan0">wlan0 - Driver: iwlwifi, Chipset: Intel 7260, Capabilities: Monitor, Managed</option>
                        <option value="wlan1">wlan1 - Driver: ath9k, Chipset: Atheros AR9285, Capabilities: Monitor, Managed</option>
                    </select>

                    <label for="mode-select">Select Mode:</label>
                    <select id="mode-select" class="form-select mb-3">
                        <option value="monitor">Monitor</option>
                        <option value="managed">Managed</option>
                    </select>

                    <div class="d-flex justify-content-between">
                        <button id="back-to-preparation" class="btn btn-secondary">Back to Preparation</button>
                        <button id="save-interface-settings" class="btn btn-primary">Save and Continue to Target Discovery</button>
                    </div>
                </div>
            </div>
        </div>`;
        $('#airgeddon-menu').html(content);

        $('#back-to-preparation').on('click', () => {
            this.returnToMainMenu();
        });

        $('#save-interface-settings').on('click', () => {
            this.navigateToMenu('target-discovery');
        });
    }

    renderTargetDiscovery() {
        let content = `
        <div class="menu-section-card mb-4">
            <div class="card">
                <div class="card-header">
                    <h5 class="section-title mb-0">────── Phase 2: Target Discovery ──────────────────────────────────────────────</h5>
                </div>
                <div class="card-body">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Checkbox</th>
                                <th>#</th>
                                <th>BSSID</th>
                                <th>ESSID</th>
                                <th>Channel</th>
                                <th>Signal</th>
                                <th>Encryption</th>
                                <th>WPS</th>
                                <th>Clients</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><input type="checkbox" /></td>
                                <td>1</td>
                                <td>00:11:22:33:44:55</td>
                                <td>Network1</td>
                                <td>6</td>
                                <td>-40 dBm</td>
                                <td>WPA2</td>
                                <td>Enabled</td>
                                <td>3</td>
                            </tr>
                            <tr>
                                <td><input type="checkbox" /></td>
                                <td>2</td>
                                <td>66:77:88:99:AA:BB</td>
                                <td>Network2</td>
                                <td>11</td>
                                <td>-70 dBm</td>
                                <td>WEP</td>
                                <td>Disabled</td>
                                <td>0</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="d-flex align-items-center">
                        <label for="target-input" class="me-2">Enter Target Number:</label>
                        <input type="number" id="target-input" class="form-control me-2" style="width: 100px;" min="1" max="10" />
                        <button id="save-target-selection" class="btn btn-primary">Save and Continue to Attack Methods</button>
                    </div>
                </div>
            </div>
        </div>`;
        $('#airgeddon-menu').html(content);

        $('#save-target-selection').on('click', () => {
            this.navigateToMenu('attack-methods');
        });
    }

    renderAttackMethods() {
        let content = `
        <div class="menu-section-card mb-4">
            <div class="card">
                <div class="card-header">
                    <h5 class="section-title mb-0">────── Phase 3: Attack Methods ──────────────────────────────────────────────</h5>
                </div>
                <div class="card-body">
                    <div class="list-group">
                        <button class="list-group-item list-group-item-action" data-menu="dos-attacks">5. DOS Attacks Menu</button>
                        <button class="list-group-item list-group-item-action" data-menu="handshake-tools">6. Handshake Tools Menu</button>
                        <button class="list-group-item list-group-item-action" data-menu="offline-wpa">7. Offline WPA/WPA2 Decrypt Menu</button>
                        <button class="list-group-item list-group-item-action" data-menu="wps-attacks">8. WPS Attacks Menu</button>
                        <button class="list-group-item list-group-item-action" data-menu="evil-twin">9. Evil Twin Attacks Menu</button>
                        <button class="list-group-item list-group-item-action" data-menu="wep-attacks">10. WEP Attacks Menu</button>
                    </div>
                </div>
            </div>
        </div>`;
        $('#airgeddon-menu').html(content);

        $('.list-group-item').on('click', (e) => {
            const menuKey = $(e.currentTarget).data('menu');
            this.navigateToMenu(menuKey);
        });
    }

    renderAdvancedFeatures() {
        let content = `
        <div class="menu-section-card mb-4">
            <div class="card">
                <div class="card-header">
                    <h5 class="section-title mb-0">────── Advanced Features ──────────────────────────────────────────────</h5>
                </div>
                <div class="card-body">
                    <div class="list-group">
                        <button class="list-group-item list-group-item-action" data-menu="persistence-config">Persistence & Configuration</button>
                        <button class="list-group-item list-group-item-action" data-menu="logging-reporting">Logging & Reporting</button>
                        <button class="list-group-item list-group-item-action" data-menu="utility-functions">Utility Functions</button>
                    </div>
                </div>
            </div>
        </div>`;
        $('#airgeddon-menu').html(content);

        $('.list-group-item').on('click', (e) => {
            const menuKey = $(e.currentTarget).data('menu');
            this.navigateToMenu(menuKey);
        });
    }

    renderSubMenu(menuKey) {
        let content = '';
        switch(menuKey) {
            case 'dos-attacks':
                content = `
                <div class="menu-section-card mb-4">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="section-title mb-0">────── DOS Attacks Menu ──────────────────────────────────────────────</h5>
                        </div>
                        <div class="card-body">
                            <div class="list-group">
                                <button class="list-group-item list-group-item-action submenu-item" data-action="deauth-attack">5.1. Deauth Attack</button>
                                <button class="list-group-item list-group-item-action submenu-item" data-action="beacon-flood">5.2. Beacon Flood Attack</button>
                                <button class="list-group-item list-group-item-action submenu-item" data-action="auth-dos">5.3. Auth DOS Attack</button>
                            </div>
                        </div>
                    </div>
                </div>`;
                break;
            case 'handshake-tools':
                content = `
                <div class="menu-section-card mb-4">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="section-title mb-0">────── Handshake Tools Menu ──────────────────────────────────────────</h5>
                        </div>
                        <div class="card-body">
                            <div class="list-group">
                                <button class="list-group-item list-group-item-action submenu-item" data-action="capture-handshake">6.1. Capture WPA Handshake</button>
                                <button class="list-group-item list-group-item-action submenu-item" data-action="clean-handshake">6.2. Clean/Optimize Handshake</button>
                                <button class="list-group-item list-group-item-action submenu-item" data-action="verify-handshake">6.3. Verify Handshake</button>
                            </div>
                        </div>
                    </div>
                </div>`;
                break;
            case 'offline-wpa':
                content = `
                <div class="menu-section-card mb-4">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="section-title mb-0">────── Offline WPA/WPA2 Decrypt Menu ───────────────────────────────────</h5>
                        </div>
                        <div class="card-body">
                            <div class="list-group">
                                <button class="list-group-item list-group-item-action submenu-item" data-action="dictionary-attack">7.1. Dictionary Attack</button>
                                <button class="list-group-item list-group-item-action submenu-item" data-action="bruteforce-attack">7.2. Bruteforce Attack</button>
                            </div>
                        </div>
                    </div>
                </div>`;
                break;
            case 'wps-attacks':
                content = `
                <div class="menu-section-card mb-4">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="section-title mb-0">────── WPS Attacks Menu ──────────────────────────────────────────────</h5>
                        </div>
                        <div class="card-body">
                            <div class="list-group">
                                <button class="list-group-item list-group-item-action submenu-item" data-action="wps-pin-attack">8.1. WPS PIN Attack</button>
                                <button class="list-group-item list-group-item-action submenu-item" data-action="wps-pixie-dust">8.2. WPS Pixie Dust Attack</button>
                            </div>
                        </div>
                    </div>
                </div>`;
                break;
            case 'evil-twin':
                content = `
                <div class="menu-section-card mb-4">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="section-title mb-0">────── Evil Twin Attacks Menu ────────────────────────────────────────</h5>
                        </div>
                        <div class="card-body">
                            <div class="list-group">
                                <button class="list-group-item list-group-item-action submenu-item" data-action="evil-twin-ap">9.1. Evil Twin AP Attack</button>
                                <button class="list-group-item list-group-item-action submenu-item" data-action="evil-twin-sniffing">9.2. Evil Twin AP Attack with sniffing</button>
                                <button class="list-group-item list-group-item-action submenu-item" data-action="evil-twin-sslstrip">9.3. Evil Twin AP Attack with sniffing and sslstrip</button>
                            </div>
                        </div>
                    </div>
                </div>`;
                break;
            case 'wep-attacks':
                content = `
                <div class="menu-section-card mb-4">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="section-title mb-0">────── WEP Attacks Menu ──────────────────────────────────────────────</h5>
                        </div>
                        <div class="card-body">
                            <div class="list-group">
                                <button class="list-group-item list-group-item-action submenu-item" data-action="wep-fake-auth">10.1. WEP Fake Auth Attack</button>
                                <button class="list-group-item list-group-item-action submenu-item" data-action="wep-chop-chop">10.2. WEP Chop-Chop Attack</button>
                                <button class="list-group-item list-group-item-action submenu-item" data-action="wep-fragmentation">10.3. WEP Fragmentation Attack</button>
                            </div>
                        </div>
                    </div>
                </div>`;
                break;
            case 'persistence-config':
                content = `
                <div class="menu-section-card mb-4">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="section-title mb-0">────── Persistence & Configuration ─────────────────────────────────────</h5>
                        </div>
                        <div class="card-body">
                            <div class="list-group">
                                <button class="list-group-item list-group-item-action submenu-item" data-action="language-selection">Language Selection</button>
                                <button class="list-group-item list-group-item-action submenu-item" data-action="interface-preferences">Interface Preferences</button>
                                <button class="list-group-item list-group-item-action submenu-item" data-action="default-wordlists">Default Wordlists</button>
                                <button class="list-group-item list-group-item-action submenu-item" data-action="attack-presets">Attack Presets</button>
                                <button class="list-group-item list-group-item-action submenu-item" data-action="save-settings">Save Current Settings</button>
                                <button class="list-group-item list-group-item-action submenu-item" data-action="reset-defaults">Reset to Defaults</button>
                            </div>
                        </div>
                    </div>
                </div>`;
                break;
            case 'logging-reporting':
                content = `
                <div class="menu-section-card mb-4">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="section-title mb-0">────── Logging & Reporting ───────────────────────────────────────────</h5>
                        </div>
                        <div class="card-body">
                            <div class="list-group">
                                <button class="list-group-item list-group-item-action submenu-item" data-action="enable-logging">Enable/Disable Logging</button>
                                <button class="list-group-item list-group-item-action submenu-item" data-action="view-logs">View Attack Logs</button>
                                <button class="list-group-item list-group-item-action submenu-item" data-action="export-results">Export Results</button>
                                <button class="list-group-item list-group-item-action submenu-item" data-action="clear-logs">Clear Logs</button>
                                <button class="list-group-item list-group-item-action submenu-item" data-action="set-log-level">Set Log Level</button>
                            </div>
                        </div>
                    </div>
                </div>`;
                break;
            case 'utility-functions':
                content = `
                <div class="menu-section-card mb-4">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="section-title mb-0">────── Utility Functions ─────────────────────────────────────────────</h5>
                        </div>
                        <div class="card-body">
                            <div class="list-group">
                                <button class="list-group-item list-group-item-action submenu-item" data-action="update-airgeddon">Update Airgeddon</button>
                                <button class="list-group-item list-group-item-action submenu-item" data-action="check-dependencies">Check Dependencies</button>
                                <button class="list-group-item list-group-item-action submenu-item" data-action="system-info">System Information</button>
                                <button class="list-group-item list-group-item-action submenu-item" data-action="clean-files">Clean Temporary Files</button>
                                <button class="list-group-item list-group-item-action submenu-item" data-action="about">About Airgeddon</button>
                            </div>
                        </div>
                    </div>
                </div>`;
                break;
            default:
                content = `<h5>${menuKey.replace(/-/g, ' ').toUpperCase()} MENU</h5><p>Details coming soon...</p>`;
        }
        $('#airgeddon-submenu').html(content);
    }

    handleAction(action) {
        // Placeholder for handling specific actions
        alert(`Action "${action}" not implemented yet.`);
    }
}

new AirgeddonModule();
