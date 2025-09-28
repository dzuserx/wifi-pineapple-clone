// WiFi Pineapple Main JavaScript - Corrected Version
class PineappleUI {
    constructor() {
        this.currentModule = 'dashboard';
        this.currentSubmodule = null;
        this.isInitialized = false;
        this.moduleInstances = new Map(); // Track module instances
    }

    init() {
        if (this.isInitialized) return;
        
        console.log('🚀 WiFi Pineapple UI Initializing...');
        this.setupEventListeners();
        this.initializeTheme();
        this.setupResizeHandler();
        this.checkSystemStatus();
        this.loadInitialModule();
        
        this.isInitialized = true;
        console.log('✅ WiFi Pineapple UI Ready');
    }

    setupEventListeners() {
        // Sidebar toggle
        $('#sidebarCollapse').on('click', () => {
            this.toggleSidebar();
        });

        // Main module navigation
        $(document).on('click', '.sidebar a[data-module]', (e) => {
            e.preventDefault();
            this.handleModuleNavigation(e.currentTarget);
        });

        // Module subsection navigation
        $(document).on('click', '.module-subsection', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleSubmoduleNavigation(e.currentTarget);
        });

        // Breadcrumb navigation
        $(document).on('click', '#module-breadcrumb a', (e) => {
            e.preventDefault();
            this.handleBreadcrumbNavigation(e.currentTarget);
        });

        // Theme toggle - FIXED: Use global function
        $('#theme-toggle').on('click', () => {
            if (typeof toggleTheme === 'function') {
                toggleTheme();
            } else {
                console.error('toggleTheme function not found');
                // Fallback
                const currentTheme = localStorage.getItem('wifi-pineapple-theme') || 'light';
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                this.applyThemeFallback(newTheme);
            }
        });

        // Window hash change (browser back/forward)
        $(window).on('hashchange', () => {
            this.handleHashChange();
        });

        // Global click handler for dynamic content
        $(document).on('click', '.btn', function() {
            const btn = $(this);
            if (!btn.hasClass('no-loading') && !btn.attr('disabled')) {
                btn.prop('disabled', true);
                const originalHtml = btn.html();
                btn.html('<i class="bi bi-arrow-repeat spinner"></i> Loading...');
                
                // Revert after 3 seconds (safety timeout)
                setTimeout(() => {
                    if (btn.prop('disabled')) {
                        btn.prop('disabled', false);
                        btn.html(originalHtml);
                    }
                }, 3000);
            }
        });
    }

    // Fallback theme function
    applyThemeFallback(theme) {
        const themeStyle = document.getElementById('theme-style');
        if (themeStyle) {
            themeStyle.href = `css/themes/${theme}.css`;
        }
        document.body.className = `${theme}-theme`;
        localStorage.setItem('wifi-pineapple-theme', theme);
        this.updateThemeToggleButton(theme);
        Helpers.showNotification(`${theme === 'light' ? 'Light' : 'Dark'} theme activated`, 'success');
    }

    updateThemeToggleButton(theme) {
        const button = $('#theme-toggle');
        const icon = button.find('i');
        const text = theme === 'light' ? 'Dark Mode' : 'Light Mode';
        const iconClass = theme === 'light' ? 'bi-moon' : 'bi-sun';
        
        icon.attr('class', `bi ${iconClass}`);
        button.html(`${icon.prop('outerHTML')} ${text}`);
    }

    toggleSidebar() {
        $('#sidebar').toggleClass('active');
        $('#content').toggleClass('active');
        
        const button = $('#sidebarCollapse');
        const icon = button.find('i');
        
        if ($('#sidebar').hasClass('active')) {
            icon.removeClass('bi-list').addClass('bi-x');
        } else {
            icon.removeClass('bi-x').addClass('bi-list');
        }
        
        // Save sidebar state
        localStorage.setItem('sidebar-state', $('#sidebar').hasClass('active') ? 'open' : 'closed');
    }

    handleModuleNavigation(element) {
        const link = $(element);
        const moduleName = link.data('module');
        
        // Close any open dropdowns
        $('.dropdown-menu').removeClass('show');
        
        // Update active state
        $('.sidebar li').removeClass('active');
        link.closest('li').addClass('active');
        
        this.loadModule(moduleName);
    }

    handleSubmoduleNavigation(element) {
        const link = $(element);
        const submodule = link.data('submodule');
        
        // Update active state
        $('.sidebar li').removeClass('active');
        link.closest('.nav-item').addClass('active');
        
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
            // Clean up previous module instance
            this.cleanupModuleInstance();
            
            this.showLoadingState(moduleName, submodule);
            this.updateModuleHeader(moduleName, submodule);
            this.updateBrowserHistory(moduleName, submodule);
            
            let contentUrl = `modules/${moduleName}/${moduleName}.html`;
            if (submodule) {
                contentUrl = `modules/${moduleName}/submodules/${submodule}.html`;
            }
            
            const response = await fetch(contentUrl);
            if (!response.ok) {
                throw new Error(`Failed to load module: ${response.status} ${response.statusText}`);
            }
            
            const content = await response.text();
            $('#module-dynamic-content').html(content);
            
            await this.loadModuleScript(moduleName, submodule);
            
            this.currentModule = moduleName;
            this.currentSubmodule = submodule;
            
            this.initializeModuleContent();
            
            console.log(`✅ Loaded module: ${moduleName}${submodule ? '/' + submodule : ''}`);
            
        } catch (error) {
            console.error('❌ Error loading module:', error);
            this.showErrorState(moduleName, submodule, error);
        }
    }

    cleanupModuleInstance() {
        const instanceKey = this.currentModule + (this.currentSubmodule ? `_${this.currentSubmodule}` : '');
        const existingInstance = this.moduleInstances.get(instanceKey);
        
        if (existingInstance && typeof existingInstance.destroy === 'function') {
            existingInstance.destroy();
            this.moduleInstances.delete(instanceKey);
        }
    }

    showLoadingState(moduleName, submodule) {
        const moduleDisplayName = submodule ? this.formatName(submodule) : this.formatName(moduleName);
        $('#module-dynamic-content').html(`
            <div class="text-center py-5">
                <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
                <h4 class="mt-3 text-primary">Loading ${moduleDisplayName}</h4>
                <p class="text-muted">Please wait while we load the module content...</p>
                <div class="progress mt-4" style="height: 6px; max-width: 300px; margin: 0 auto;">
                    <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 100%"></div>
                </div>
            </div>
        `);
    }

    showErrorState(moduleName, submodule, error) {
        const moduleDisplayName = submodule ? this.formatName(submodule) : this.formatName(moduleName);
        $('#module-dynamic-content').html(`
            <div class="alert alert-danger m-4">
                <div class="d-flex align-items-center">
                    <i class="bi bi-exclamation-triangle display-4 me-3"></i>
                    <div>
                        <h4 class="alert-heading">Module Load Error</h4>
                        <p class="mb-2">Failed to load <strong>${moduleDisplayName}</strong> module.</p>
                        <small class="text-muted">Error: ${error.message}</small>
                    </div>
                </div>
                <hr>
                <div class="d-flex gap-2 flex-wrap">
                    <button class="btn btn-primary" onclick="pineappleUI.retryLoad()">
                        <i class="bi bi-arrow-clockwise"></i> Try Again
                    </button>
                    <button class="btn btn-outline-secondary" onclick="pineappleUI.loadModule('dashboard')">
                        <i class="bi bi-speedometer2"></i> Return to Dashboard
                    </button>
                    <button class="btn btn-outline-info" onclick="console.error('Module load error:', '${error.message}')">
                        <i class="bi bi-bug"></i> Debug Info
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
        
        const displayName = submodule ? this.formatName(submodule) : this.formatName(moduleName);
        
        $('#module-title').text(displayName);
        $('#module-description').html(description);
        $('#current-module-name').text(displayName);
        
        this.updateBreadcrumb(moduleName, submodule);
    }

    formatName(name) {
        return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    updateBreadcrumb(moduleName, submodule = null) {
        const breadcrumb = $('#module-breadcrumb ol');
        breadcrumb.empty();
        
        breadcrumb.append(`
            <li class="breadcrumb-item">
                <a href="#dashboard" data-module="dashboard">
                    <i class="bi bi-speedometer2"></i> Dashboard
                </a>
            </li>
        `);
        
        if (submodule) {
            breadcrumb.append(`
                <li class="breadcrumb-item">
                    <a href="#${moduleName}" data-module="${moduleName}">
                        ${this.formatName(moduleName)}
                    </a>
                </li>
            `);
            breadcrumb.append(`<li class="breadcrumb-item active">${this.formatName(submodule)}</li>`);
        } else {
            breadcrumb.append(`<li class="breadcrumb-item active">${this.formatName(moduleName)}</li>`);
        }
    }

    updateBrowserHistory(moduleName, submodule = null) {
        let hash = `#${moduleName}`;
        if (submodule) {
            hash += `/${submodule}`;
        }
        
        if (window.location.hash !== hash) {
            window.location.hash = hash;
        }
    }

    async loadModuleScript(moduleName, submodule = null) {
        try {
            let scriptUrl = `js/modules/${moduleName}.js`;
            if (submodule) {
                scriptUrl = `js/modules/${moduleName}/submodules/${submodule}.js`;
            }
            
            // Remove existing module script if any
            $(`script[src="${scriptUrl}"]`).remove();
            
            const response = await fetch(scriptUrl, { method: 'HEAD' });
            if (response.ok) {
                return new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = scriptUrl;
                    script.onload = () => {
                        // Store module instance if available
                        const instanceKey = moduleName + (submodule ? `_${submodule}` : '');
                        const globalInstance = window[`${moduleName}Instance`] || window[`${submodule}Instance`];
                        if (globalInstance) {
                            this.moduleInstances.set(instanceKey, globalInstance);
                        }
                        resolve();
                    };
                    script.onerror = reject;
                    document.body.appendChild(script);
                });
            }
        } catch (error) {
            console.log(`ℹ️ No specific JavaScript found for ${submodule ? submodule + ' ' : ''}${moduleName}`);
        }
    }

    initializeModuleContent() {
        // Initialize Bootstrap components
        $('[data-toggle="tooltip"]').tooltip();
        $('[data-toggle="popover"]').popover();
        
        // Add smooth scrolling to anchor links
        $('a[href^="#"]').not('[data-module]').on('click', function(e) {
            const target = $(this.getAttribute('href'));
            if (target.length) {
                e.preventDefault();
                $('html, body').animate({
                    scrollTop: target.offset().top - 80
                }, 800);
            }
        });
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
            if ($('#sidebar').hasClass('active')) {
                this.toggleSidebar();
            }
        }
        
        // Restore sidebar state on large screens
        if ($(window).width() >= 768) {
            const savedState = localStorage.getItem('sidebar-state');
            if (savedState === 'open' && !$('#sidebar').hasClass('active')) {
                this.toggleSidebar();
            }
        }
    }

    checkSystemStatus() {
        // Simulate system status monitoring
        setInterval(() => {
            const statusIndicator = $('.status-indicator');
            const statusText = $('.system-status small');
            
            // Simulate occasional status changes
            if (Math.random() < 0.1) { // 10% chance to change status
                if (statusIndicator.hasClass('online')) {
                    statusIndicator.removeClass('online').addClass('offline');
                    statusText.text('System Offline');
                    Helpers.showNotification('System connection lost', 'warning');
                } else {
                    statusIndicator.removeClass('offline').addClass('online');
                    statusText.text('System Online');
                    Helpers.showNotification('System connection restored', 'success');
                }
            }
        }, 30000);
    }

    initializeTheme() {
        if (typeof initializeTheme === 'function') {
            initializeTheme();
        } else {
            // Fallback theme initialization
            const savedTheme = localStorage.getItem('wifi-pineapple-theme') || 'light';
            this.applyThemeFallback(savedTheme);
        }
    }

    loadInitialModule() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            const parts = hash.split('/');
            if (parts.length === 1) {
                this.loadModule(parts[0]);
            } else if (parts.length === 2) {
                this.loadModule(parts[0], parts[1]);
            }
        } else {
            this.loadModule('dashboard');
        }
    }

    // Public API methods
    showNotification(message, type = 'info') {
        Helpers.showNotification(message, type);
    }

    navigateTo(moduleName, submodule = null) {
        this.loadModule(moduleName, submodule);
    }

    getCurrentModule() {
        return {
            module: this.currentModule,
            submodule: this.currentSubmodule
        };
    }
}

// Global functions
function navigateToModule(moduleName, submodule = null) {
    pineappleUI.navigateTo(moduleName, submodule);
}

function showNotification(message, type = 'info') {
    pineappleUI.showNotification(message, type);
}

// Initialize the application
const pineappleUI = new PineappleUI();

// Start the application when DOM is ready
$(document).ready(function() {
    pineappleUI.init();
});

// Add CSS for loading animations
const loadingStyles = document.createElement('style');
loadingStyles.textContent = `
    .btn .spinner {
        animation: spin 1s linear infinite;
        display: inline-block;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .progress-bar-animated {
        animation: progress-bar-stripes 1s linear infinite;
    }
    
    @keyframes progress-bar-stripes {
        from { background-position: 1rem 0; }
        to { background-position: 0 0; }
    }
    
    .fade-in {
        animation: fadeIn 0.5s ease-in;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(loadingStyles);

// Make pineappleUI globally available
window.pineappleUI = pineappleUI;
window.navigateToModule = navigateToModule;
window.showNotification = showNotification;

console.log('🌐 WiFi Pineapple Frontend Loaded');