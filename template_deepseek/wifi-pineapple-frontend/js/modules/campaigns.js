// Campaigns Module JavaScript
class CampaignsModule {
    constructor() {
        this.statsInterval = null;
        this.currentTab = 'manage';
        this.init();
    }

    async init() {
        console.log('🚩 Campaigns Module Initializing...');
        await this.loadCampaignsData();
        this.setupEventListeners();
        this.setupTabs();
        this.startLiveUpdates();
    }

    async loadCampaignsData() {
        try {
            const data = await API.getCampaignsData();
            this.updateCampaigns(data);
        } catch (error) {
            console.error('Failed to load campaigns data:', error);
            Helpers.showNotification('Failed to load campaigns data', 'error');
        }
    }

    updateCampaigns(data) {
        if (data.stats) {
            $('#total-campaigns').text(data.stats.total || 0);
            $('#active-campaigns').text(data.stats.active || 0);
            $('#paused-campaigns').text(data.stats.paused || 0);
            $('#campaign-results').text(data.stats.results || 0);
        }

        if (data.campaigns) {
            this.updateCampaignsTable(data.campaigns);
        }
    }

    updateCampaignsTable(campaigns) {
        const tbody = $('#manage table tbody');
        tbody.empty();

        campaigns.forEach(campaign => {
            const statusBadge = this.getStatusBadge(campaign.status);
            const row = `
                <tr>
                    <td>${campaign.name}</td>
                    <td>${statusBadge}</td>
                    <td>${campaign.mode}</td>
                    <td>${campaign.results}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary edit-campaign" data-id="${campaign.id}">Edit</button>
                        <button class="btn btn-sm btn-outline-${campaign.status === 'active' ? 'danger' : 'success'} toggle-campaign" data-id="${campaign.id}" data-action="${campaign.status === 'active' ? 'stop' : 'start'}">
                            ${campaign.status === 'active' ? 'Stop' : 'Start'}
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-campaign" data-id="${campaign.id}">Delete</button>
                    </td>
                </tr>
            `;
            tbody.append(row);
        });
    }

    getStatusBadge(status) {
        const badges = {
            'active': '<span class="badge badge-success">Active</span>',
            'paused': '<span class="badge badge-warning">Paused</span>',
            'stopped': '<span class="badge badge-secondary">Stopped</span>',
            'completed': '<span class="badge badge-info">Completed</span>'
        };
        return badges[status] || '<span class="badge badge-secondary">Unknown</span>';
    }

    setupEventListeners() {
        // New campaign button
        $('#new-campaign').on('click', () => {
            this.showNewCampaignForm();
        });

        // Campaign actions
        $(document).on('click', '.edit-campaign', (e) => {
            const campaignId = $(e.target).data('id');
            this.editCampaign(campaignId);
        });

        $(document).on('click', '.toggle-campaign', (e) => {
            const campaignId = $(e.target).data('id');
            const action = $(e.target).data('action');
            this.toggleCampaign(campaignId, action);
        });

        $(document).on('click', '.delete-campaign', (e) => {
            const campaignId = $(e.target).data('id');
            this.deleteCampaign(campaignId);
        });

        // Campaign editor form
        $('#campaign-editor').on('submit', (e) => {
            e.preventDefault();
            this.saveCampaign();
        });

        // Mode selection
        $('.btn-sm').filter('[class*="btn-"]').on('click', function() {
            const mode = $(this).text().toLowerCase().replace('select ', '');
            Helpers.showNotification(`${mode} mode selected`, 'info');
        });

        // Report generation
        $('#formats form').on('submit', (e) => {
            e.preventDefault();
            this.generateReport();
        });
    }

    setupTabs() {
        $('#campaignTabs a').on('click', (e) => {
            e.preventDefault();
            const tabId = $(e.target).closest('a').attr('href').substring(1);
            this.switchTab(tabId);
        });
    }

    switchTab(tabId) {
        // Update active tab
        $('#campaignTabs a').removeClass('active');
        $(`#${tabId}-tab`).addClass('active');

        // Show tab content
        $('.tab-pane').removeClass('show active');
        $(`#${tabId}`).addClass('show active');

        this.currentTab = tabId;
    }

    showNewCampaignForm() {
        this.switchTab('editing');
        $('#campaign-editor')[0].reset();
        Helpers.showNotification('Create new campaign', 'info');
    }

    editCampaign(campaignId) {
        // Mock edit functionality
        this.switchTab('editing');
        Helpers.showNotification(`Editing campaign ${campaignId}`, 'info');
    }

    async toggleCampaign(campaignId, action) {
        try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 500));
            Helpers.showNotification(`Campaign ${action}ped successfully`, 'success');
            this.loadCampaignsData();
        } catch (error) {
            Helpers.showNotification('Failed to toggle campaign', 'error');
        }
    }

    deleteCampaign(campaignId) {
        if (confirm('Are you sure you want to delete this campaign?')) {
            Helpers.showNotification(`Campaign ${campaignId} deleted`, 'warning');
            this.loadCampaignsData();
        }
    }

    saveCampaign() {
        const formData = new FormData(document.getElementById('campaign-editor'));
        const campaignData = Object.fromEntries(formData);

        Helpers.showNotification('Campaign saved successfully', 'success');
        this.switchTab('manage');
        this.loadCampaignsData();
    }

    generateReport() {
        Helpers.showNotification('Report generation started', 'info');
        setTimeout(() => {
            Helpers.showNotification('Report generated successfully', 'success');
        }, 2000);
    }

    startLiveUpdates() {
        this.statsInterval = setInterval(() => {
            this.updateLiveStats();
        }, 10000);
    }

    updateLiveStats() {
        // Mock live updates
        const current = parseInt($('#total-campaigns').text()) || 0;
        const newTotal = Math.max(0, current + Math.floor(Math.random() * 3) - 1);
        $('#total-campaigns').text(newTotal);

        const active = parseInt($('#active-campaigns').text()) || 0;
        const newActive = Math.max(0, Math.min(newTotal, active + Math.floor(Math.random() * 2) - 1));
        $('#active-campaigns').text(newActive);
    }

    destroy() {
        if (this.statsInterval) {
            clearInterval(this.statsInterval);
        }
        $(document).off('click', '.edit-campaign, .toggle-campaign, .delete-campaign');
        console.log('🚩 Campaigns Module Cleaned Up');
    }
}

// Initialize campaigns when module loads
let campaignsInstance = null;

function initializeCampaigns() {
    if (campaignsInstance) {
        campaignsInstance.destroy();
    }
    campaignsInstance = new CampaignsModule();
}

// Auto-initialize when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCampaigns);
} else {
    initializeCampaigns();
}
