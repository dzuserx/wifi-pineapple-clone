class EvilPortalModule {
    constructor() {
        this.portals = [];
        this.activePortal = null;
        this.capturedCredentials = [];
        this.permanentClients = [];
        this.allowedClients = [];
        this.init();
    }

    async init() {
        await this.loadPortals();
        await this.loadCredentials();
        await this.loadPermanentClients();
        await this.loadAllowedClients();
        this.setupEventListeners();
        this.updateUI();
    }

    async loadPortals() {
        try {
            const savedPortals = localStorage.getItem('evilPortals');
            if (savedPortals) {
                this.portals = JSON.parse(savedPortals);
            } else {
                // Default portals
                this.portals = [
                    {
                        id: 1,
                        name: 'Facebook Login',
                        type: 'social',
                        description: 'Facebook-style login portal',
                        template: 'facebook',
                        enabled: false,
                        created: new Date().toISOString()
                    },
                    {
                        id: 2,
                        name: 'Airport WiFi',
                        type: 'public',
                        description: 'Airport free WiFi portal',
                        template: 'airport',
                        enabled: false,
                        created: new Date().toISOString()
                    },
                    {
                        id: 3,
                        name: 'Hotel WiFi',
                        type: 'public',
                        description: 'Hotel WiFi login portal',
                        template: 'hotel',
                        enabled: true,
                        created: new Date().toISOString()
                    }
                ];
            }

            this.activePortal = this.portals.find(p => p.enabled) || null;
        } catch (error) {
            console.error('Error loading portals:', error);
        }
    }

    async loadCredentials() {
        try {
            const savedCredentials = localStorage.getItem('capturedCredentials');
            if (savedCredentials) {
                this.capturedCredentials = JSON.parse(savedCredentials);
            }
        } catch (error) {
            console.error('Error loading credentials:', error);
        }
    }

    async loadPermanentClients() {
        try {
            const savedClients = localStorage.getItem('permanentClients');
            if (savedClients) {
                this.permanentClients = JSON.parse(savedClients);
            }
        } catch (error) {
            console.error('Error loading permanent clients:', error);
        }
    }

    async loadAllowedClients() {
        try {
            const savedClients = localStorage.getItem('allowedClients');
            if (savedClients) {
                this.allowedClients = JSON.parse(savedClients);
            }
        } catch (error) {
            console.error('Error loading allowed clients:', error);
        }
    }

    setupEventListeners() {
        $('#portal-enabled').on('change', () => {
            this.togglePortal();
        });

        $('#create-portal').on('click', () => {
            this.showCreatePortalModal();
        });

        $(document).on('click', '.activate-portal', (e) => {
            const portalId = $(e.target).closest('button').data('id');
            this.activatePortal(portalId);
        });

        $(document).on('click', '.edit-portal', (e) => {
            const portalId = $(e.target).closest('button').data('id');
            this.editPortal(portalId);
        });

        $(document).on('click', '.delete-portal', (e) => {
            const portalId = $(e.target).closest('button').data('id');
            this.deletePortal(portalId);
        });

        // Activation buttons
        $('#start-portal').on('click', () => {
            this.startPortal();
        });

        $('#start-web-server').on('click', () => {
            this.startWebServer();
        });

        $('#enable-on-boot').on('click', () => {
            this.toggleBootEnable();
        });

        // Permanent clients
        $('#add-permanent-client').on('click', () => {
            this.showAddPermanentClientModal();
        });

        $(document).on('click', '.remove-permanent-client', (e) => {
            const mac = $(e.target).closest('button').data('mac');
            this.removePermanentClient(mac);
        });

        // Allowed clients
        $('#add-allowed-client').on('click', () => {
            this.showAddAllowedClientModal();
        });

        $(document).on('click', '.revoke-allowed-client', (e) => {
            const mac = $(e.target).closest('button').data('mac');
            this.revokeAllowedClient(mac);
        });

        // Simulate credential capture
        setInterval(() => {
            if (this.activePortal) {
                this.simulateCredentialCapture();
            }
        }, 10000);
    }

    togglePortal() {
        const enabled = $('#portal-enabled').is(':checked');

        if (enabled && !this.activePortal) {
            Helpers.showNotification('Please activate a portal first', 'warning');
            $('#portal-enabled').prop('checked', false);
            return;
        }

        if (enabled) {
            Helpers.showNotification(`Portal "${this.activePortal.name}" activated`, 'success');
        } else {
            Helpers.showNotification('Portal deactivated', 'warning');
        }

        this.updateUI();
    }

    activatePortal(portalId) {
        // Deactivate all other portals
        this.portals.forEach(portal => {
            portal.enabled = portal.id === portalId;
        });

        this.activePortal = this.portals.find(p => p.id === portalId);
        this.savePortals();

        $('#portal-enabled').prop('checked', true);
        Helpers.showNotification(`Portal "${this.activePortal.name}" activated`, 'success');
        this.updateUI();
    }

    editPortal(portalId) {
        const portal = this.portals.find(p => p.id === portalId);
        if (portal) {
            Helpers.showNotification(`Editing portal: ${portal.name}`, 'info');
            // In a real implementation, this would open an editor
        }
    }

    deletePortal(portalId) {
        if (confirm('Are you sure you want to delete this portal?')) {
            this.portals = this.portals.filter(p => p.id !== portalId);
            if (this.activePortal && this.activePortal.id === portalId) {
                this.activePortal = null;
                $('#portal-enabled').prop('checked', false);
            }
            this.savePortals();
            Helpers.showNotification('Portal deleted successfully', 'success');
            this.updateUI();
        }
    }

    showCreatePortalModal() {
        Helpers.showNotification('Create portal functionality would open here', 'info');
        // In a real implementation, this would open a modal
    }

    // Activation methods
    startPortal() {
        Helpers.showNotification('Starting Evil Portal service...', 'info');
        $('#portal-status').text('Starting...');

        // Simulate starting the portal
        setTimeout(() => {
            $('#portal-status').text('Active');
            Helpers.showNotification('Evil Portal service started successfully', 'success');
        }, 2000);
    }

    startWebServer() {
        Helpers.showNotification('Starting web server...', 'info');

        // Simulate starting the web server
        setTimeout(() => {
            Helpers.showNotification('Web server started successfully', 'success');
        }, 1500);
    }

    toggleBootEnable() {
        const btn = $('#enable-on-boot');
        const isEnabled = btn.hasClass('btn-warning');

        if (isEnabled) {
            btn.removeClass('btn-warning').addClass('btn-success');
            btn.html('<i class="bi bi-bootstrap"></i> Enable on Boot');
            Helpers.showNotification('Portal disabled on boot', 'warning');
        } else {
            btn.removeClass('btn-success').addClass('btn-warning');
            btn.html('<i class="bi bi-bootstrap-reboot"></i> Disable on Boot');
            Helpers.showNotification('Portal enabled on boot', 'success');
        }
    }

    simulateCredentialCapture() {
        const sampleCredentials = [
            { username: 'user123', password: 'password123', client: 'AA:BB:CC:11:22:33' },
            { username: 'test@example.com', password: 'testpass', client: 'BB:CC:DD:22:33:44' },
            { username: 'admin', password: 'admin123', client: 'CC:DD:EE:33:44:55' }
        ];

        if (Math.random() > 0.7) { // 30% chance of capture
            const cred = sampleCredentials[Math.floor(Math.random() * sampleCredentials.length)];
            this.captureCredential(cred);
        }
    }

    captureCredential(credential) {
        credential.timestamp = new Date().toLocaleString();
        credential.portal = this.activePortal.name;
        this.capturedCredentials.unshift(credential);

        // Keep only last 50 credentials
        if (this.capturedCredentials.length > 50) {
            this.capturedCredentials = this.capturedCredentials.slice(0, 50);
        }

        this.saveCredentials();
        this.updateCredentialsTable();
        this.updateStats();

        Helpers.showNotification(`New credential captured from ${credential.client}`, 'success');
    }

    updateCredentialsTable() {
        const tbody = $('#credentials-table tbody');
        tbody.empty();

        this.capturedCredentials.forEach(cred => {
            const row = `
                <tr>
                    <td>${cred.timestamp}</td>
                    <td><code>${cred.username}</code></td>
                    <td><code>••••••••</code></td>
                    <td><small>${cred.client}</small></td>
                    <td>${cred.portal}</td>
                </tr>
            `;
            tbody.append(row);
        });
    }

    updateStats() {
        $('#clients-captured').text(this.getUniqueClients().length);
        $('#credentials-collected').text(this.capturedCredentials.length);
        $('#active-portal-name').text(this.activePortal ? this.activePortal.name : 'None');
    }

    getUniqueClients() {
        const clients = new Set(this.capturedCredentials.map(cred => cred.client));
        return Array.from(clients);
    }

    savePortals() {
        localStorage.setItem('evilPortals', JSON.stringify(this.portals));
    }

    saveCredentials() {
        localStorage.setItem('capturedCredentials', JSON.stringify(this.capturedCredentials));
    }

    updateUI() {
        this.updatePortalsList();
        this.updateStats();
        this.updateCredentialsTable();
        this.updatePermanentClientsTable();
        this.updateAllowedClientsTable();

        const isEnabled = $('#portal-enabled').is(':checked');
        $('#portal-status').html(isEnabled ?
            '<span class="badge badge-success">Active</span>' :
            '<span class="badge badge-secondary">Inactive</span>');
    }

    updatePortalsList() {
        const container = $('.portal-templates');
        container.empty();

        this.portals.forEach(portal => {
            const isActive = portal.enabled;
            const portalCard = `
                <div class="portal-template card mb-3 ${isActive ? 'border-success' : ''}">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="mb-1">${portal.name}</h6>
                                <p class="mb-1 text-muted small">${portal.description}</p>
                                <span class="badge badge-${isActive ? 'success' : 'secondary'}">
                                    ${isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div>
                                <button class="btn btn-sm btn-${isActive ? 'warning' : 'success'} activate-portal mr-1" data-id="${portal.id}">
                                    <i class="bi bi-${isActive ? 'pause' : 'play'}"></i>
                                </button>
                                <button class="btn btn-sm btn-info edit-portal mr-1" data-id="${portal.id}">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button class="btn btn-sm btn-danger delete-portal" data-id="${portal.id}">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.append(portalCard);
        });
    }

    updatePermanentClientsTable() {
        const tbody = $('#permanent-clients-table tbody');
        if (tbody.length) {
            tbody.empty();
            this.permanentClients.forEach(client => {
                const row = `
                    <tr>
                        <td><code>${client.mac}</code></td>
                        <td>${client.hostname}</td>
                        <td>${client.added}</td>
                        <td>
                            <button class="btn btn-sm btn-danger remove-permanent-client" data-mac="${client.mac}">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
                tbody.append(row);
            });
        }
    }

    updateAllowedClientsTable() {
        const tbody = $('#allowed-clients-table tbody');
        if (tbody.length) {
            tbody.empty();
            this.allowedClients.forEach(client => {
                const row = `
                    <tr>
                        <td><code>${client.mac}</code></td>
                        <td>${client.username}</td>
                        <td>${client.authenticatedAt}</td>
                        <td>
                            <button class="btn btn-sm btn-warning revoke-allowed-client" data-mac="${client.mac}">
                                <i class="bi bi-x-circle"></i> Revoke
                            </button>
                        </td>
                    </tr>
                `;
                tbody.append(row);
            });
        }
    }

    // Permanent clients methods
    showAddPermanentClientModal() {
        const mac = prompt('Enter MAC address (e.g., AA:BB:CC:11:22:33):');
        if (mac) {
            const hostname = prompt('Enter hostname (optional):') || 'Unknown';
            this.addPermanentClient(mac.toUpperCase(), hostname);
        }
    }

    addPermanentClient(mac, hostname) {
        const client = {
            mac: mac,
            hostname: hostname,
            added: new Date().toLocaleDateString()
        };

        this.permanentClients.push(client);
        this.savePermanentClients();
        this.updatePermanentClientsTable();
        Helpers.showNotification(`Permanent client ${mac} added`, 'success');
    }

    removePermanentClient(mac) {
        if (confirm(`Remove permanent client ${mac}?`)) {
            this.permanentClients = this.permanentClients.filter(client => client.mac !== mac);
            this.savePermanentClients();
            this.updatePermanentClientsTable();
            Helpers.showNotification(`Permanent client ${mac} removed`, 'warning');
        }
    }

    // Allowed clients methods
    showAddAllowedClientModal() {
        const mac = prompt('Enter MAC address (e.g., AA:BB:CC:11:22:33):');
        if (mac) {
            const username = prompt('Enter username:');
            if (username) {
                this.addAllowedClient(mac.toUpperCase(), username);
            }
        }
    }

    addAllowedClient(mac, username) {
        const client = {
            mac: mac,
            username: username,
            authenticatedAt: new Date().toLocaleString()
        };

        this.allowedClients.push(client);
        this.saveAllowedClients();
        this.updateAllowedClientsTable();
        Helpers.showNotification(`Client ${mac} granted access`, 'success');
    }

    revokeAllowedClient(mac) {
        if (confirm(`Revoke access for client ${mac}?`)) {
            this.allowedClients = this.allowedClients.filter(client => client.mac !== mac);
            this.saveAllowedClients();
            this.updateAllowedClientsTable();
            Helpers.showNotification(`Access revoked for client ${mac}`, 'warning');
        }
    }

    savePermanentClients() {
        localStorage.setItem('permanentClients', JSON.stringify(this.permanentClients));
    }

    saveAllowedClients() {
        localStorage.setItem('allowedClients', JSON.stringify(this.allowedClients));
    }
}

new EvilPortalModule();
