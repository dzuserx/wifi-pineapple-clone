// theme.js placeholder
// Theme management utility
const ThemeManager = {
    currentTheme: 'light',
    
    init() {
        this.loadTheme();
        this.applyTheme(this.currentTheme);
    },
    
    toggle() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        this.saveTheme();
        this.updateToggleButton();
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
        const iconClass = this.currentTheme === 'light' ? 'fa-moon-o' : 'fa-sun-o';
        
        icon.attr('class', `fa ${iconClass}`);
        button.html(`${icon.prop('outerHTML')} ${text}`);
    }
};

// Initialize theme manager
function initializeTheme() {
    ThemeManager.init();
}

// Toggle theme function
function toggleTheme() {
    ThemeManager.toggle();
}