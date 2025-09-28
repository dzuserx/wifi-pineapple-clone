// Enhanced Theme Management Utility
const ThemeManager = {
    currentTheme: 'light',
    
    init() {
        this.loadTheme();
        this.applyTheme(this.currentTheme);
        this.setupSystemThemeDetection();
        this.updateToggleButton();
    },
    
    setupSystemThemeDetection() {
        // Detect system theme preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // Only use system theme if no user preference is saved
            if (!localStorage.getItem('wifi-pineapple-theme')) {
                this.currentTheme = 'dark';
                this.applyTheme('dark');
            }
        }
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            // Only follow system theme if no user preference is set
            if (!localStorage.getItem('wifi-pineapple-theme')) {
                this.currentTheme = e.matches ? 'dark' : 'light';
                this.applyTheme(this.currentTheme);
                this.updateToggleButton();
            }
        });
    },
    
    toggle() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        this.saveTheme();
        this.updateToggleButton();
        this.animateThemeTransition();
        
        // Show notification
        const themeName = this.currentTheme === 'light' ? 'Light' : 'Dark';
        Helpers.showNotification(`${themeName} theme activated`, 'success');
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
        
        // Save to localStorage for persistence
        this.saveTheme();
    },
    
    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        metaThemeColor.content = theme === 'dark' ? '#1a1a1a' : '#667eea';
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
    },
    
    getThemeInfo() {
        return {
            current: this.currentTheme,
            isDark: this.isDarkMode(),
            isSystem: !localStorage.getItem('wifi-pineapple-theme')
        };
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

function resetTheme() {
    ThemeManager.resetToSystemTheme();
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
    
    /* Smooth transitions for theme changes */
    body.light-theme, body.dark-theme {
        transition: background-color 0.3s ease, color 0.3s ease;
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

// Initialize theme when DOM is ready
$(document).ready(function() {
    initializeTheme();
});

// Export for module use
window.ThemeManager = ThemeManager;
window.initializeTheme = initializeTheme;
window.toggleTheme = toggleTheme;