/**
 * Centralized API Client for CloudOps Commander
 * Strictly complies with openapi.yaml
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, { ...options, headers });
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.detail || `HTTP Error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (err) {
      console.error(`[API Client Error] ${options.method || 'GET'} ${endpoint}:`, err);
      throw err;
    }
  }

  // System & Health
  async getHealth() {
    return this.request('/healthz');
  }

  async getSystemSummary() {
    return this.request('/api/v1/system/summary');
  }

  // Microservices
  async listServices() {
    return this.request('/api/v1/services');
  }

  async getServiceById(id) {
    return this.request(`/api/v1/services/${id}`);
  }

  async createService(data) {
    return this.request('/api/v1/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Incidents
  async listIncidents(params = {}) {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.severity) query.append('severity', params.severity);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request(`/api/v1/incidents${qs}`);
  }

  async getIncidentById(id) {
    return this.request(`/api/v1/incidents/${id}`);
  }

  async createIncident(data) {
    return this.request('/api/v1/incidents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateIncident(id, data) {
    return this.request(`/api/v1/incidents/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async investigateIncident(id) {
    return this.request(`/api/v1/incidents/${id}/investigate`, {
      method: 'POST',
    });
  }

  // Runbooks
  async listRunbooks() {
    return this.request('/api/v1/runbooks');
  }

  async executeRunbook(runbookId, incidentId, parameters = {}) {
    return this.request(`/api/v1/runbooks/${runbookId}/execute`, {
      method: 'POST',
      body: JSON.stringify({ incident_id: incidentId, parameters }),
    });
  }

  // Webhooks / Alert Simulator
  async ingestAlertWebhook(payload) {
    return this.request('/api/v1/webhooks/alert', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}

export const api = new ApiClient(API_BASE_URL);
export default api;
