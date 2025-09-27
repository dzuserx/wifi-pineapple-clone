// modules.js placeholder
class ModulesModule {
    constructor() {
        this.installedModules = [];
        this.availableModules = [];
        this.init();
    }
    
    async init() {
        await this.loadData();
        this.setupEventListeners();
    }
    
    async loadData() {
        try {
            const data = await API.getModulesData();
            this.updateModulesData(data);
        } catch (error) {
            Helpers.showNotification('Failed to load modules data', 'error');
        }
    }
    
    updateModulesData(data) {
        // Update installed modules
        if (data.installed) {
            this.installedModules = data.installed;
            this.updateInstalledModules(data.installed);
        }
        
        // Update available modules
        if (data.available) {
            this.availableModules = data.available;
            this.updateAvailableModules(data.available);
        }
    }
    
    updateInstalledModules(modules) {
        const container = $('#installed-modules');
        if (container.length && modules) {
            const html = modules.map(module => `
                <div class="module-card card">
                    <div class="card-body">
                        <div class="module-header">
                            <h5 class="module-name">${module.name}</h5>
                            <span class="module-version">v${module.version}</span>
                        </div>
                        <p class="module-description">${module.description}</p>
                        <div class="module-actions">
                            ${module.enabled ? 
                                `<button class="btn btn-warning btn-sm disable-module" data-module="${module.name}">
                                    <i class="bi bi-pause"></i> Disable
                                </button>` :
                                `<button class="btn btn-success btn-sm enable-module" data-module="${module.name}">
                                    <i class="bi bi-play"></i> Enable
                                </button>`
                            }
                            <button class="btn btn-info btn-sm configure-module" data-module="${module.name}">
                                <i class="bi bi-gear"></i> Configure
                            </button>
                            <button class="btn btn-danger btn-sm remove-module" data-module="${module.name}">
                                <i class="bi bi-trash"></i> Remove
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
            container.html(html);
        }
    }
    
    updateAvailableModules(modules) {
        const container = $('#available-modules');
        if (container.length && modules) {
            const html = modules.map(module => `
                <div class="module-card card">
                    <div class="card-body">
                        <div class="module-header">
                            <h5 class="module-name">${module.name}</h5>
                            <span class="module-version">v${module.version}</span>
                        </div>
                        <p class="module-description">${module.description}</p>
                        <div class="module-details">
                            <small>Author: ${module.author}</small>
                            <small>Size: ${Helpers.formatBytes(module.size)}</small>
                        </div>
                        <button class="btn btn-primary btn-sm install-module" data-module="${module.name}">
                            <i class="bi bi-download"></i> Install
                        </button>
                    </div>
                </div>
            `).join('');
            container.html(html);
        }
    }
    
    setupEventListeners() {
        // Search functionality
        $('#module-search').on('input', () => {
            this.filterModules();
        });
        
        // Tab switching
        $('.module-tabs .nav-link').on('click', (e) => {
            const tab = $(e.target).attr('href');
            this.switchTab(tab);
        });
    }
    
    filterModules() {
        const searchTerm = $('#module-search').val().toLowerCase();
        
        // Filter installed modules
        $('.module-card').each(function() {
            const moduleName = $(this).find('.module-name').text().toLowerCase();
            if (moduleName.includes(searchTerm)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }
    
    switchTab(tab) {
        $('.module-tab-content').hide();
        $(tab).show();
    }
    
    installModule(moduleName) {
        Helpers.showNotification(`Installing module: ${moduleName}`, 'info');
        // Simulate installation
        setTimeout(() => {
            Helpers.showNotification(`Module ${moduleName} installed successfully`, 'success');
        }, 2000);
    }
    
    enableModule(moduleName) {
        Helpers.showNotification(`Enabling module: ${moduleName}`, 'info');
        // Simulate enabling
        setTimeout(() => {
            Helpers.showNotification(`Module ${moduleName} enabled`, 'success');
        }, 1000);
    }
    
    disableModule(moduleName) {
        Helpers.showNotification(`Disabling module: ${moduleName}`, 'info');
        // Simulate disabling
        setTimeout(() => {
            Helpers.showNotification(`Module ${moduleName} disabled`, 'warning');
        }, 1000);
    }
}

new ModulesModule();