class EvilPortalModule {
    constructor() {
        this.portals = [];
        this.activePortal = null;
        this.capturedCredentials = [];
        this.init();
    }
    
    async init() {
        await this.loadPortals();
        await this.loadCredentials();
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
}

new EvilPortalModule();