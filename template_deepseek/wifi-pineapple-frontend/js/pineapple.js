// WiFi Pineapple Enhanced Main JavaScript
class PineappleUI {
    constructor() {
        this.currentModule = 'dashboard';
        this.currentSubmodule = null;
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.initializeTheme();
        this.setupResizeHandler();
        this.checkSystemStatus();
    }
    
    setupEventListeners() {
        // Sidebar toggle
        $('#sidebarCollapse').on('click', () => {
            this.toggleSidebar();
        });
        
        // Main module navigation
        $('.sidebar a[data-module]').on('click', (e) => {
            e.preventDefault();
            this.handleModuleNavigation(e.target);
        });
        
        // Module subsection navigation
        $('.module-subsection').on('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleSubmoduleNavigation(e.target);
        });
        
        // Breadcrumb navigation
        $(document).on('click', '#module-breadcrumb a', (e) => {
            e.preventDefault();
            this.handleBreadcrumbNavigation(e.target);
        });
        
        // Theme toggle
        $('#theme-toggle').on('click', () => {
            toggleTheme();
        });
        
        // Window hash change (browser back/forward)
        $(window).on('hashchange', () => {
            this.handleHashChange();
        });
        
        // Refresh dashboard button
        $('#refresh-activity').on('click', () => {
            this.refreshDashboard();
        });
    }
    
    toggleSidebar() {
        $('#sidebar').toggleClass('active');
        $('#content').toggleClass('active');
        
        // Update button icon
        const button = $('#sidebarCollapse');
        const icon = button.find('i');
        
        if ($('#sidebar').hasClass('active')) {
            icon.removeClass('bi-list').addClass('bi-x');
        } else {
            icon.removeClass('bi-x').addClass('bi-list');
        }
    }
    
    handleModuleNavigation(element) {
        const link = $(element).closest('a');
        const moduleName = link.data('module');
        
        // Update active state
        $('.sidebar li').removeClass('active');
        link.closest('li').addClass('active');
        
        // Close any open dropdowns
        $('.dropdown-menu').removeClass('show');
        
        // Load module
        this.loadModule(moduleName);
    }
    
    handleSubmoduleNavigation(element) {
        const link = $(element).closest('a');
        const submodule = link.data('submodule');
        
        // Update active state
        $('.sidebar li').removeClass('active');
        link.closest('.nav-item').addClass('active');
        
        // Load submodule
        this.loadModule('modules', submodule);
    }
    
    handleBreadcrumbNavigation(element) {
        const link = $(element);
        const moduleName = link.data('module');
        this.loadModule(moduleName);
    }
    
    handleHashChange() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            const parts = hash.split('/');
            if (parts.length === 1) {
                this.loadModule(parts[0]);
            } else if (parts.length === 2) {
                this.loadModule(parts[0], parts[1]);
            }
        }
    }
    
    async loadModule(moduleName, submodule = null) {
        try {
            this.showLoadingState(moduleName, submodule);
            this.updateModuleHeader(moduleName, submodule);
            this.updateBrowserHistory(moduleName, submodule);
            
            let contentUrl = `modules/${moduleName}/${moduleName}.html`;
            if (submodule) {
                contentUrl = `modules/${moduleName}/submodules/${submodule}.html`;
            }
            
            const response = await fetch(contentUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const content = await response.text();
            $('#module-dynamic-content').html(content);
            
            await this.loadModuleScript(moduleName, submodule);
            
            this.currentModule = moduleName;
            this.currentSubmodule = submodule;
            
            // Initialize any dynamic content in the loaded module
            this.initializeModuleContent();
            
        } catch (error) {
            console.error('Error loading module:', error);
            this.showErrorState(moduleName, submodule, error);
        }
    }
    
    showLoadingState(moduleName, submodule) {
        const moduleDisplayName = submodule ? submodule.replace('-', ' ') : moduleName;
        $('#module-dynamic-content').html(`
            <div class="text-center py-5">
                <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
                <h4 class="mt-3">Loading ${moduleDisplayName}</h4>
                <p class="text-muted">Please wait while we load the module content...</p>
                <div class="progress mt-4" style="height: 6px;">
                    <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 100%"></div>
                </div>
            </div>
        `);
    }
    
    showErrorState(moduleName, submodule, error) {
        const moduleDisplayName = submodule ? submodule.replace('-', ' ') : moduleName;
        $('#module-dynamic-content').html(`
            <div class="alert alert-danger">
                <div class="d-flex align-items-center">
                    <i class="bi bi-exclamation-triangle display-4 me-3"></i>
                    <div>
                        <h4 class="alert-heading">Module Load Error</h4>
                        <p class="mb-2">Failed to load ${moduleDisplayName} module.</p>
                        <small class="text-muted">Error: ${error.message}</small>
                    </div>
                </div>
                <hr>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary" onclick="pineappleUI.retryLoad()">
                        <i class="bi bi-arrow-clockwise"></i> Try Again
                    </button>
                    <button class="btn btn-outline-secondary" onclick="pineappleUI.loadModule('dashboard')">
                        <i class="bi bi-speedometer2"></i> Return to Dashboard
                    </button>
                </div>
            </div>
        `);
    }
    
    retryLoad() {
        this.loadModule(this.currentModule, this.currentSubmodule);
    }
    
    updateModuleHeader(moduleName, submodule = null) {
        const link = $(`.sidebar a[data-module="${moduleName}"]`);
        let description = link.data('description') || 'Module interface';
        
        if (submodule) {
            const subLink = $(`.module-subsection[data-submodule="${submodule}"]`);
            description = subLink.data('description') || description;
        }
        
        const displayName = submodule ? this.formatModuleName(submodule) : this.formatModuleName(moduleName);
        
        $('#module-title').text(displayName);
        $('#module-description').html(description);
        $('#current-module-name').text(displayName);
        
        this.updateBreadcrumb(moduleName, submodule);
    }
    
    formatModuleName(name) {
        return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    
    updateBreadcrumb(moduleName, submodule = null) {
        const breadcrumb = $('#module-breadcrumb ol');
        breadcrumb.empty();
        
        // Always start with Dashboard
        breadcrumb.append(`
            <li class="breadcrumb-item">
                <a href="#dashboard" data-module="dashboard">
                    <i class="bi bi-speedometer2"></i> Dashboard
                </a>
            </li>
        `);
        
        if (submodule) {
            // Add parent module link
            breadcrumb.append(`
                <li class="breadcrumb-item">
                    <a href="#${moduleName}" data-module="${moduleName}">
                        ${this.formatModuleName(moduleName)}
                    </a>
                </li>
            `);
            // Current submodule (active)
            breadcrumb.append(`<li class="breadcrumb-item active">${this.formatModuleName(submodule)}</li>`);
        } else {
            // Current module (active)
            breadcrumb.append(`<li class="breadcrumb-item active">${this.formatModuleName(moduleName)}</li>`);
        }
    }
    
    updateBrowserHistory(moduleName, submodule = null) {
        let hash = `#${moduleName}`;
        if (submodule) {
            hash += `/${submodule}`;
        }
        window.location.hash = hash;
    }
    
    async loadModuleScript(moduleName, submodule = null) {
        try {
            let scriptUrl = `js/modules/${moduleName}.js`;
            if (submodule) {
                scriptUrl = `js/modules/${moduleName}/submodules/${submodule}.js`;
            }
            
            // Remove existing module script if any
            $(`script[src="${scriptUrl}"]`).remove();
            
            // Check if script exists
            const response = await fetch(scriptUrl);
            if (response.ok) {
                // Add new script
                return new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = scriptUrl;
                    script.onload = resolve;
                    script.onerror = reject;
                    document.body.appendChild(script);
                });
            }
        } catch (error) {
            console.warn(`No specific JavaScript found for ${submodule ? submodule + ' ' : ''}${moduleName}`);
        }
    }
    
    initializeModuleContent() {
        // Initialize tooltips
        $('[data-toggle="tooltip"]').tooltip();
        
        // Initialize popovers
        $('[data-toggle="popover"]').popover();
        
        // Add smooth scrolling to anchor links
        $('a[href^="#"]').on('click', function(e) {
            e.preventDefault();
            const target = $(this.getAttribute('href'));
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top - 80
                }, 800);
            }
        });
        
        // Initialize any charts or advanced UI components
        this.initializeCharts();
    }
    
    initializeCharts() {
        // Placeholder for chart initialization
        // This would be implemented based on specific module requirements
    }
    
    setupResizeHandler() {
        let resizeTimer;
        $(window).on('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }
    
    handleResize() {
        if ($(window).width() < 768) {
            $('#sidebar').removeClass('active');
            $('#content').removeClass('active');
            $('#sidebarCollapse i').removeClass('bi-x').addClass('bi-list');
        }
    }
    
    checkSystemStatus() {
        // Simulate system status check
        setInterval(() => {
            const statusIndicator = $('.status-indicator');
            if (statusIndicator.hasClass('online')) {
                statusIndicator.removeClass('online').addClass('offline');
                statusIndicator.next('small').text('System Offline');
            } else {
                statusIndicator.removeClass('offline').addClass('online');
                statusIndicator.next('small').text('System Online');
            }
        }, 30000); // Check every 30 seconds
    }
    
    refreshDashboard() {
        Helpers.showNotification('Refreshing dashboard data...', 'info');
        
        // Simulate API call
        setTimeout(() => {
            // Update random stats for demo purposes
            $('#total-clients').text(Math.floor(Math.random() * 50) + 10);
            $('#total-networks').text(Math.floor(Math.random() * 20) + 5);
            $('#active-modules-count').text(Math.floor(Math.random() * 5) + 1);
            
            Helpers.showNotification('Dashboard updated successfully', 'success');
        }, 1000);
    }
    
    initializeTheme() {
        if (typeof initializeTheme === 'function') {
            initializeTheme();
        }
    }
}

// Initialize the application
const pineappleUI = new PineappleUI();

// Global function for module navigation (can be called from anywhere)
function navigateToModule(moduleName, submodule = null) {
    pineappleUI.loadModule(moduleName, submodule);
}

// Handle page load
$(window).on('load', function() {
    // Check if there's a hash in the URL
    const hash = window.location.hash.substring(1);
    if (hash) {
        const parts = hash.split('/');
        if (parts.length === 1) {
            pineappleUI.loadModule(parts[0]);
        } else if (parts.length === 2) {
            pineappleUI.loadModule(parts[0], parts[1]);
        }
    } else {
        // Default to dashboard
        pineappleUI.loadModule('dashboard');
    }
    
    // Add loading animation to buttons
    $('.btn').on('click', function() {
        const btn = $(this);
        if (!btn.hasClass('no-loading')) {
            btn.prop('disabled', true);
            const originalHtml = btn.html();
            btn.html('<i class="bi bi-arrow-repeat spinner"></i> Loading...');
            
            // Revert after 2 seconds (in case of error)
            setTimeout(() => {
                btn.prop('disabled', false);
                btn.html(originalHtml);
            }, 2000);
        }
    });
});

// CSS for button loading animation
const style = document.createElement('style');
style.textContent = `
    .btn .spinner {
        animation: spin 1s linear infinite;
    }
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);