// pineapple.js placeholder
// WiFi Pineapple Main JavaScript
$(document).ready(function () {
    // Sidebar toggle
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $('#content').toggleClass('active');
    });

    // Module navigation
    $('.sidebar a[data-module]').on('click', function (e) {
        e.preventDefault();
        
        // Update active state
        $('.sidebar li').removeClass('active');
        $(this).parent().addClass('active');
        
        // Load module
        const moduleName = $(this).data('module');
        loadModule(moduleName);
    });

    // Theme switching
    $('#theme-toggle').on('click', function () {
        toggleTheme();
    });

    // Initialize theme
    initializeTheme();
});

// Module loader
async function loadModule(moduleName) {
    try {
        // Show loading state
        $('#module-content').html(`
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
                <p class="mt-3">Loading ${moduleName} module...</p>
            </div>
        `);

        // Load module content
        const response = await fetch(`modules/${moduleName}/${moduleName}.html`);
        const content = await response.text();
        
        $('#module-content').html(content);
        
        // Load module-specific JavaScript
        await loadModuleScript(moduleName);
        
    } catch (error) {
        console.error('Error loading module:', error);
        $('#module-content').html(`
            <div class="alert alert-danger">
                <h4>Error loading module</h4>
                <p>Failed to load ${moduleName} module. Please try again.</p>
            </div>
        `);
    }
}

// Load module-specific JavaScript
async function loadModuleScript(moduleName) {
    try {
        const scriptUrl = `js/modules/${moduleName}.js`;
        const response = await fetch(scriptUrl);
        
        if (response.ok) {
            // Remove existing module script if any
            $(`script[src="${scriptUrl}"]`).remove();
            
            // Add new script
            const script = document.createElement('script');
            script.src = scriptUrl;
            document.body.appendChild(script);
        }
    } catch (error) {
        console.warn(`No specific JavaScript found for ${moduleName}`);
    }
}

// Initialize dashboard as default
$(window).on('load', function () {
    loadModule('dashboard');
});

// Enhanced module loader with subsection support
async function loadModule(moduleName, submodule = null) {
    try {
        $('#module-content').html(`
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
                <p class="mt-3">Loading ${submodule ? submodule + ' ' : ''}${moduleName}...</p>
            </div>
        `);

        let contentUrl = `modules/${moduleName}/${moduleName}.html`;
        if (submodule) {
            contentUrl = `modules/${moduleName}/submodules/${submodule}.html`;
        }

        const response = await fetch(contentUrl);
        const content = await response.text();
        $('#module-content').html(content);
        
        await loadModuleScript(moduleName, submodule);
        
    } catch (error) {
        console.error('Error loading module:', error);
        $('#module-content').html(`
            <div class="alert alert-danger">
                <h4>Error loading module</h4>
                <p>Failed to load ${submodule ? submodule + ' ' : ''}${moduleName} module. Please try again.</p>
            </div>
        `);
    }
}

// Enhanced module script loader
async function loadModuleScript(moduleName, submodule = null) {
    try {
        let scriptUrl = `js/modules/${moduleName}.js`;
        if (submodule) {
            scriptUrl = `js/modules/${moduleName}/submodules/${submodule}.js`;
        }
        
        const response = await fetch(scriptUrl);
        if (response.ok) {
            $(`script[src="${scriptUrl}"]`).remove();
            const script = document.createElement('script');
            script.src = scriptUrl;
            document.body.appendChild(script);
        }
    } catch (error) {
        console.warn(`No specific JavaScript found for ${submodule ? submodule + ' ' : ''}${moduleName}`);
    }
}

// Update event listeners for module subsections
$(document).ready(function () {
    // Existing sidebar toggle code...
    
    // Module navigation with subsection support
    $('.sidebar a[data-module]').on('click', function (e) {
        e.preventDefault();
        
        // Update active state
        $('.sidebar li').removeClass('active');
        $(this).closest('li').addClass('active');
        
        // Load module
        const moduleName = $(this).data('module');
        loadModule(moduleName);
    });

    // Module subsection navigation
    $('.module-subsection').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Update active state
        $('.sidebar li').removeClass('active');
        $(this).closest('.nav-item').addClass('active');
        
        const moduleName = 'modules'; // Always modules for subsections
        const submodule = $(this).data('submodule');
        loadModule(moduleName, submodule);
    });

    // Existing theme and initialization code...
});