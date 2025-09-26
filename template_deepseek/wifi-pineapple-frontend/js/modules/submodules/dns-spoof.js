class DNSSpoofModule {
    constructor() {
        this.spoofingRules = [];
        this.isSpoofingEnabled = true;
        this.init();
    }
    
    async init() {
        await this.loadRules();
        this.setupEventListeners();
        this.updateUI();
    }
    
    async loadRules() {
        try {
            const savedRules = localStorage.getItem('dnsSpoofRules');
            if (savedRules) {
                this.spoofingRules = JSON.parse(savedRules);
            } else {
                // Default rules
                this.spoofingRules = [
                    { id: 1, domain: 'google.com', redirectTo: '172.16.42.1', enabled: true },
                    { id: 2, domain: 'facebook.com', redirectTo: '172.16.42.1', enabled: true },
                    { id: 3, domain: 'twitter.com', redirectTo: '172.16.42.1', enabled: false }
                ];
            }
            
            const savedEnabled = localStorage.getItem('dnsSpoofEnabled');
            this.isSpoofingEnabled = savedEnabled !== 'false';
        } catch (error) {
            console.error('Error loading rules:', error);
        }
    }
    
    setupEventListeners() {
        $('#dns-spoof-enabled').on('change', () => {
            this.toggleSpoofing();
        });
        
        $('#add-rule').on('click', () => {
            this.showAddRuleModal();
        });
        
        $('#dns-rule-form').on('submit', (e) => {
            e.preventDefault();
            this.addRule();
        });
        
        // Handle rule actions
        $(document).on('click', '.toggle-rule', (e) => {
            const ruleId = $(e.target).closest('button').data('id');
            this.toggleRule(ruleId);
        });
        
        $(document).on('click', '.delete-rule', (e) => {
            const ruleId = $(e.target).closest('button').data('id');
            this.deleteRule(ruleId);
        });
    }
    
    toggleSpoofing() {
        this.isSpoofingEnabled = $('#dns-spoof-enabled').is(':checked');
        localStorage.setItem('dnsSpoofEnabled', this.isSpoofingEnabled);
        
        const status = this.isSpoofingEnabled ? 'enabled' : 'disabled';
        Helpers.showNotification(`DNS spoofing ${status}`, 'success');
        this.updateUI();
    }
    
    showAddRuleModal() {
        $('#spoof-domain').val('');
        $('#redirect-ip').val('172.16.42.1');
        $('#enable-rule').prop('checked', true);
    }
    
    addRule() {
        const domain = $('#spoof-domain').val().trim();
        const redirectTo = $('#redirect-ip').val().trim();
        const enabled = $('#enable-rule').is(':checked');
        
        if (!domain || !redirectTo) {
            Helpers.showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!Helpers.validateIP(redirectTo)) {
            Helpers.showNotification('Please enter a valid IP address', 'error');
            return;
        }
        
        const newRule = {
            id: Date.now(),
            domain: domain.toLowerCase(),
            redirectTo,
            enabled
        };
        
        this.spoofingRules.push(newRule);
        this.saveRules();
        this.updateRulesTable();
        
        $('#dns-rule-form')[0].reset();
        Helpers.showNotification('DNS rule added successfully', 'success');
    }
    
    toggleRule(ruleId) {
        const rule = this.spoofingRules.find(r => r.id == ruleId);
        if (rule) {
            rule.enabled = !rule.enabled;
            this.saveRules();
            this.updateRulesTable();
            Helpers.showNotification(`Rule ${rule.enabled ? 'enabled' : 'disabled'}`, 'info');
        }
    }
    
    deleteRule(ruleId) {
        if (confirm('Are you sure you want to delete this rule?')) {
            this.spoofingRules = this.spoofingRules.filter(r => r.id != ruleId);
            this.saveRules();
            this.updateRulesTable();
            Helpers.showNotification('Rule deleted successfully', 'success');
        }
    }
    
    saveRules() {
        localStorage.setItem('dnsSpoofRules', JSON.stringify(this.spoofingRules));
    }
    
    updateRulesTable() {
        const tbody = $('#dns-rules-table tbody');
        tbody.empty();
        
        this.spoofingRules.forEach(rule => {
            const statusClass = rule.enabled ? 'success' : 'secondary';
            const statusText = rule.enabled ? 'Active' : 'Inactive';
            const toggleIcon = rule.enabled ? 'fa-pause' : 'fa-play';
            const toggleClass = rule.enabled ? 'warning' : 'success';
            
            const row = `
                <tr>
                    <td><code>${rule.domain}</code></td>
                    <td><code>${rule.redirectTo}</code></td>
                    <td><span class="badge badge-${statusClass}">${statusText}</span></td>
                    <td>
                        <button class="btn btn-sm btn-${toggleClass} toggle-rule" data-id="${rule.id}">
                            <i class="fa ${toggleIcon}"></i>
                        </button>
                        <button class="btn btn-sm btn-danger delete-rule" data-id="${rule.id}">
                            <i class="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.append(row);
        });
    }
    
    updateUI() {
        $('#dns-spoof-enabled').prop('checked', this.isSpoofingEnabled);
        
        const enabledRules = this.spoofingRules.filter(r => r.enabled).length;
        $('#active-rules-count').text(enabledRules);
        $('#total-rules-count').text(this.spoofingRules.length);
        
        this.updateRulesTable();
    }
}

new DNSSpoofModule();