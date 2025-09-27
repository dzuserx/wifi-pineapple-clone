// Enhanced Theme Management Utility
const ThemeManager = {
    currentTheme: 'light',
    
    init() {
        this.loadTheme();
        this.applyTheme(this.currentTheme);
        this.setupSystemThemeDetection();
    },
    
    setupSystemThemeDetection() {
        // Detect system theme preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            if (!localStorage.getItem('wifi-pineapple-theme')) {
                this.currentTheme = 'dark';
                this.applyTheme('dark');
            }
        }
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('wifi-pineapple-theme')) {
                this.currentTheme = e.matches ? 'dark' : 'light';
                this.applyTheme(this.currentTheme);
            }
        });
    },
    
    toggle() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        this.saveTheme();
        this.updateToggleButton();
        this.animateThemeTransition();
    },
    
    applyTheme(theme) {
        const themeStyle = document.getElementById('theme-style');
        const body = document.body;
        
        // Remove existing theme classes
        body.classList.remove('light-theme', 'dark-theme');
        
        // Set new theme
        themeStyle.href = `css/themes/${theme}.css`;
        body.classList.add(`${theme}-theme`);
        
        this.currentTheme = theme;
        
        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(theme);
    },
    
    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        metaThemeColor.content = theme === 'dark' ? '#1a1a1a' : '#ffffff';
    },
    
    animateThemeTransition() {
        const body = document.body;
        body.style.transition = 'all 0.3s ease';
        
        // Force reflow
        void body.offsetWidth;
        
        setTimeout(() => {
            body.style.transition = '';
        }, 300);
    },
    
    loadTheme() {
        const savedTheme = localStorage.getItem('wifi-pineapple-theme');
        if (savedTheme) {
            this.currentTheme = savedTheme;
        }
    },
    
    saveTheme() {
        localStorage.setItem('wifi-pineapple-theme', this.currentTheme);
    },
    
    updateToggleButton() {
        const button = $('#theme-toggle');
        const icon = button.find('i');
        const text = this.currentTheme === 'light' ? 'Dark Mode' : 'Light Mode';
        const iconClass = this.currentTheme === 'light' ? 'bi-moon' : 'bi-sun';
        
        icon.attr('class', `bi ${iconClass}`);
        button.html(`${icon.prop('outerHTML')} ${text}`);
        
        // Add animation
        button.addClass('pulse');
        setTimeout(() => button.removeClass('pulse'), 600);
    },
    
    // Additional theme-related utilities
    getCurrentTheme() {
        return this.currentTheme;
    },
    
    isDarkMode() {
        return this.currentTheme === 'dark';
    },
    
    resetToSystemTheme() {
        localStorage.removeItem('wifi-pineapple-theme');
        this.setupSystemThemeDetection();
        Helpers.showNotification('Theme reset to system preference', 'info');
    }
};

// Global functions
function initializeTheme() {
    ThemeManager.init();
}

function toggleTheme() {
    ThemeManager.toggle();
}

function getCurrentTheme() {
    return ThemeManager.getCurrentTheme();
}

function isDarkMode() {
    return ThemeManager.isDarkMode();
}

// Add CSS for theme transition animations
const themeStyles = document.createElement('style');
themeStyles.textContent = `
    .pulse {
        animation: pulse 0.6s ease-in-out;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .theme-transition * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
    }
`;
document.head.appendChild(themeStyles);

// Apply theme transition class during changes
const originalToggle = ThemeManager.toggle;
ThemeManager.toggle = function() {
    document.body.classList.add('theme-transition');
    originalToggle.apply(this, arguments);
    setTimeout(() => {
        document.body.classList.remove('theme-transition');
    }, 300);
};