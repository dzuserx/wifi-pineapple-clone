// api.js placeholder
// API communication utility
const API = {
    baseUrl: '/api',
    
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };
        
        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    },
    
    // Dashboard endpoints
    async getDashboardData() {
        return this.request('/mock/dashboard.json');
    },
    
    // Recon endpoints
    async getReconData() {
        return this.request('/mock/recon.json');
    },
    
    // PineAP endpoints
    async getPineAPData() {
        return this.request('/mock/pineap.json');
    },
    
    // Networking endpoints
    async getNetworkingData() {
        return this.request('/mock/networking.json');
    },
    
    // Modules endpoints
    async getModulesData() {
        return this.request('/mock/modules.json');
    },
    
    // Reporting endpoints
    async getReportingData() {
        return this.request('/mock/reporting.json');
    },
    
    // Help endpoints
    async getHelpData() {
        return this.request('/mock/help.json');
    },
    
    // POST methods for actions
    async postAction(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    
    async startScan() {
        return this.postAction('/recon/scan');
    },
    
    async stopScan() {
        return this.postAction('/recon/stop');
    },
    
    async togglePineAP(enabled) {
        return this.postAction('/pineap/toggle', { enabled });
    },
    
    async saveSettings(module, settings) {
        return this.postAction(`/${module}/settings`, settings);
    }
};