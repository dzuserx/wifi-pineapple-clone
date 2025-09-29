// API Service for WiFi Pineapple UI
const API = {
    baseUrl: '/api',
    timeout: 10000,
    
    async request(endpoint, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        
        const config = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            signal: controller.signal,
            ...options
        };
        
        try {
            const url = `${this.baseUrl}${endpoint}`;
            console.log(`🔗 API Request: ${config.method} ${url}`);
            
            const response = await fetch(url, config);
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log(`✅ API Response: ${endpoint}`, data);
            
            return data;
            
        } catch (error) {
            clearTimeout(timeoutId);
            console.error(`❌ API Error: ${endpoint}`, error);
            
            if (error.name === 'AbortError') {
                throw new Error('Request timeout: The server took too long to respond');
            }
            
            throw error;
        }
    },
    
    // Dashboard endpoints
    async getDashboardData() {
        return this.request('/mock/dashboard.json');
    },

    // Campaigns endpoints
    async getCampaignsData() {
        return this.request('/mock/campaigns.json');
    },

    async createCampaign(campaignData) {
        return this.request('/campaigns/create', {
            method: 'POST',
            body: JSON.stringify(campaignData)
        });
    },

    async updateCampaign(campaignId, campaignData) {
        return this.request(`/campaigns/${campaignId}`, {
            method: 'PUT',
            body: JSON.stringify(campaignData)
        });
    },

    async deleteCampaign(campaignId) {
        return this.request(`/campaigns/${campaignId}`, {
            method: 'DELETE'
        });
    },

    async toggleCampaign(campaignId, action) {
        return this.request(`/campaigns/${campaignId}/toggle`, {
            method: 'POST',
            body: JSON.stringify({ action })
        });
    },

    // Cloud C2 endpoints
    async getCloudC2Data() {
        return this.request('/mock/cloud-c2.json');
    },

    async connectToCloudC2(connectionData) {
        return this.request('/cloud-c2/connect', {
            method: 'POST',
            body: JSON.stringify(connectionData)
        });
    },

    async disconnectFromCloudC2() {
        return this.request('/cloud-c2/disconnect', {
            method: 'POST'
        });
    },

    async syncCloudData() {
        return this.request('/cloud-c2/sync', {
            method: 'POST'
        });
    },

    // Settings endpoints
    async getSettingsData() {
        return this.request('/mock/settings.json');
    },

    async updateGeneralSettings(settings) {
        return this.request('/settings/general', {
            method: 'PUT',
            body: JSON.stringify(settings)
        });
    },

    async updateNetworkingSettings(settings) {
        return this.request('/settings/networking', {
            method: 'PUT',
            body: JSON.stringify(settings)
        });
    },

    async updateWifiSettings(settings) {
        return this.request('/settings/wifi', {
            method: 'PUT',
            body: JSON.stringify(settings)
        });
    },

    async updateLedSettings(settings) {
        return this.request('/settings/leds', {
            method: 'PUT',
            body: JSON.stringify(settings)
        });
    },

    async updateAdvancedSettings(settings) {
        return this.request('/settings/advanced', {
            method: 'PUT',
            body: JSON.stringify(settings)
        });
    },
    
    // Recon endpoints
    async getReconData() {
        return this.request('/mock/recon.json');
    },
    
    async startScan(scanConfig) {
        return this.request('/recon/scan', {
            method: 'POST',
            body: JSON.stringify(scanConfig)
        });
    },
    
    async stopScan() {
        return this.request('/recon/stop', {
            method: 'POST'
        });
    },
    
    // PineAP endpoints
    async getPineAPData() {
        return this.request('/mock/pineap.json');
    },
    
    async togglePineAP(enabled) {
        return this.request('/pineap/toggle', {
            method: 'POST',
            body: JSON.stringify({ enabled })
        });
    },
    
    async addSSID(ssid) {
        return this.request('/pineap/ssid', {
            method: 'POST',
            body: JSON.stringify({ ssid })
        });
    },
    
    // Networking endpoints
    async getNetworkingData() {
        return this.request('/mock/networking.json');
    },
    
    async updateNetworkSettings(settings) {
        return this.request('/networking/settings', {
            method: 'PUT',
            body: JSON.stringify(settings)
        });
    },
    
    // Modules endpoints
    async getModulesData() {
        return this.request('/mock/modules.json');
    },
    
    async installModule(moduleId) {
        return this.request('/modules/install', {
            method: 'POST',
            body: JSON.stringify({ moduleId })
        });
    },
    
    async toggleModule(moduleId, enabled) {
        return this.request('/modules/toggle', {
            method: 'POST',
            body: JSON.stringify({ moduleId, enabled })
        });
    },
    
    // Reporting endpoints
    async getReportingData() {
        return this.request('/mock/reporting.json');
    },
    
    async generateReport(reportConfig) {
        return this.request('/reporting/generate', {
            method: 'POST',
            body: JSON.stringify(reportConfig)
        });
    },
    
    // Help endpoints
    async getHelpData() {
        return this.request('/mock/help.json');
    },
    
    // System endpoints
    async getSystemInfo() {
        return this.request('/system/info');
    },
    
    async restartService(serviceName) {
        return this.request('/system/restart', {
            method: 'POST',
            body: JSON.stringify({ service: serviceName })
        });
    },
    
    async getLogs(service, lines = 50) {
        return this.request(`/system/logs/${service}?lines=${lines}`);
    },
    
    // File upload
    async uploadFile(file, endpoint) {
        const formData = new FormData();
        formData.append('file', file);
        
        return this.request(endpoint, {
            method: 'POST',
            body: formData,
            headers: {
                // Let browser set Content-Type for FormData
            }
        });
    },
    
    // WebSocket connection for real-time updates
    connectWebSocket() {
        return new Promise((resolve, reject) => {
            try {
                const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
                const wsUrl = `${protocol}//${window.location.host}/ws`;
                
                const ws = new WebSocket(wsUrl);
                
                ws.onopen = () => {
                    console.log('🔌 WebSocket connected');
                    resolve(ws);
                };
                
                ws.onerror = (error) => {
                    console.error('❌ WebSocket error:', error);
                    reject(error);
                };
                
                ws.onclose = (event) => {
                    console.log('🔌 WebSocket disconnected:', event.code, event.reason);
                };
                
            } catch (error) {
                reject(error);
            }
        });
    },
    
    // Utility methods
    setBaseUrl(url) {
        this.baseUrl = url;
    },
    
    setTimeout(ms) {
        this.timeout = ms;
    },
    
    // Mock data for development
    async getMockData(endpoint) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockData = {
            '/mock/dashboard.json': {
                status: {
                    clients: 24,
                    networks: 15,
                    modules: 3,
                    uptime: '5d 12h'
                },
                recentActivity: [
                    {
                        type: 'client_connected',
                        message: 'New client connected to open network',
                        timestamp: new Date().toISOString(),
                        client: 'AA:BB:CC:11:22:33'
                    },
                    {
                        type: 'scan_completed',
                        message: 'Network reconnaissance scan completed',
                        timestamp: new Date(Date.now() - 15 * 60000).toISOString()
                    }
                ]
            },
            '/mock/recon.json': {
                networks: [
                    {
                        ssid: 'HomeWiFi',
                        bssid: '00:11:22:33:44:55',
                        channel: 6,
                        signal: -45,
                        encryption: 'WPA2'
                    }
                ],
                clients: [
                    {
                        mac: 'AA:BB:CC:11:22:33',
                        vendor: 'Apple Inc.',
                        signal: -55
                    }
                ]
            }
        };
        
        return mockData[endpoint] || { error: 'Mock data not found' };
    }
};

// Request/Response interceptors
API.interceptors = {
    request: [],
    response: [],
    
    addRequestInterceptor(interceptor) {
        this.request.push(interceptor);
    },
    
    addResponseInterceptor(interceptor) {
        this.response.push(interceptor);
    }
};

// Add default interceptors
API.interceptors.addRequestInterceptor((config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Add timestamp
    config.headers['X-Timestamp'] = Date.now();
    
    return config;
});

API.interceptors.addResponseInterceptor((response) => {
    // Check for session expiration
    if (response.status === 401) {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
        throw new Error('Session expired');
    }
    
    return response;
});

// Error handling wrapper
API.withErrorHandling = (fn) => {
    return async (...args) => {
        try {
            return await fn(...args);
        } catch (error) {
            console.error('API Error:', error);
            Helpers.showNotification(error.message, 'error');
            throw error;
        }
    };
};

// Make API globally available
window.API = API;

console.log('🌐 API service loaded successfully');