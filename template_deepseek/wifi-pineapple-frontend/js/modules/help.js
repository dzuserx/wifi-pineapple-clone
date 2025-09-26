// help.js placeholder
class HelpModule {
    constructor() {
        this.init();
    }
    
    async init() {
        await this.loadData();
        this.setupEventListeners();
    }
    
    async loadData() {
        try {
            const data = await API.getHelpData();
            this.updateHelpData(data);
        } catch (error) {
            Helpers.showNotification('Failed to load help content', 'error');
        }
    }
    
    updateHelpData(data) {
        // Update documentation
        if (data.documentation) {
            this.updateDocumentation(data.documentation);
        }
        
        // Update FAQs
        if (data.faqs) {
            this.updateFAQs(data.faqs);
        }
        
        // Update system info
        if (data.systemInfo) {
            this.updateSystemInfo(data.systemInfo);
        }
    }
    
    updateDocumentation(docs) {
        const container = $('#documentation-content');
        if (container.length && docs) {
            const html = docs.map(doc => `
                <div class="doc-section">
                    <h4>${doc.title}</h4>
                    <p>${doc.content}</p>
                    ${doc.examples ? `
                        <div class="doc-examples">
                            <h5>Examples:</h5>
                            <pre><code>${doc.examples}</code></pre>
                        </div>
                    ` : ''}
                </div>
            `).join('');
            container.html(html);
        }
    }
    
    updateFAQs(faqs) {
        const container = $('#faq-content');
        if (container.length && faqs) {
            const html = faqs.map(faq => `
                <div class="faq-item">
                    <div class="faq-question" data-toggle="collapse" data-target="#faq-${faq.id}">
                        <strong>Q: ${faq.question}</strong>
                        <i class="fa fa-chevron-down"></i>
                    </div>
                    <div id="faq-${faq.id}" class="collapse">
                        <div class="faq-answer">
                            <p>${faq.answer}</p>
                        </div>
                    </div>
                </div>
            `).join('');
            container.html(html);
        }
    }
    
    updateSystemInfo(systemInfo) {
        const container = $('#system-info');
        if (container.length && systemInfo) {
            const html = `
                <div class="system-info-item">
                    <strong>Firmware Version:</strong> ${systemInfo.firmwareVersion}
                </div>
                <div class="system-info-item">
                    <strong>Hardware Model:</strong> ${systemInfo.hardwareModel}
                </div>
                <div class="system-info-item">
                    <strong>Uptime:</strong> ${systemInfo.uptime}
                </div>
                <div class="system-info-item">
                    <strong>Memory Usage:</strong> ${systemInfo.memoryUsage}
                </div>
                <div class="system-info-item">
                    <strong>Storage Usage:</strong> ${systemInfo.storageUsage}
                </div>
            `;
            container.html(html);
        }
    }
    
    setupEventListeners() {
        // Search functionality
        $('#help-search').on('input', () => {
            this.searchHelp();
        });
        
        // Tab switching
        $('.help-tabs .nav-link').on('click', (e) => {
            const tab = $(e.target).attr('href');
            this.switchHelpTab(tab);
        });
        
        // FAQ accordion
        $(document).on('click', '.faq-question', function() {
            $(this).find('i').toggleClass('fa-chevron-down fa-chevron-up');
        });
    }
    
    searchHelp() {
        const searchTerm = $('#help-search').val().toLowerCase();
        
        // Search in documentation
        $('.doc-section').each(function() {
            const content = $(this).text().toLowerCase();
            if (content.includes(searchTerm)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
        
        // Search in FAQs
        $('.faq-item').each(function() {
            const content = $(this).text().toLowerCase();
            if (content.includes(searchTerm)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }
    
    switchHelpTab(tab) {
        $('.help-tab-content').hide();
        $(tab).show();
    }
    
    checkForUpdates() {
        Helpers.showNotification('Checking for updates...', 'info');
        setTimeout(() => {
            Helpers.showNotification('Your system is up to date', 'success');
        }, 2000);
    }
    
    restartSystem() {
        if (confirm('Are you sure you want to restart the system?')) {
            Helpers.showNotification('System restarting...', 'warning');
            // Simulate restart
            setTimeout(() => {
                Helpers.showNotification('System restarted successfully', 'success');
            }, 5000);
        }
    }
}

new HelpModule();