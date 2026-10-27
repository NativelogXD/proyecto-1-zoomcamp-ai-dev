import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '../services/api';

describe('Centralized ApiClient Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('getHealth calls /healthz and parses JSON response', async () => {
    const mockHealth = { status: 'ok', timestamp: '2026-10-27T12:00:00Z', database: 'connected' };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockHealth,
    });

    const result = await api.getHealth();
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8000/healthz',
      expect.objectContaining({
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      })
    );
    expect(result).toEqual(mockHealth);
  });

  it('listServices fetches from /api/v1/services', async () => {
    const mockServices = [{ id: 'srv-orders', name: 'Order API' }];
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockServices,
    });

    const result = await api.listServices();
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8000/api/v1/services',
      expect.anything()
    );
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('srv-orders');
  });

  it('investigateIncident issues POST to /api/v1/incidents/{id}/investigate', async () => {
    const mockDiag = {
      incident_id: 'inc-101',
      confidence_score: 95.0,
      root_cause: 'Deadlock in database',
      recommended_runbook_id: 'rb-restart-service',
    };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockDiag,
    });

    const result = await api.investigateIncident('inc-101');
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8000/api/v1/incidents/inc-101/investigate',
      expect.objectContaining({ method: 'POST' })
    );
    expect(result.recommended_runbook_id).toBe('rb-restart-service');
  });

  it('throws friendly error message when HTTP response is not ok', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: async () => ({ detail: 'Incident inc-999 not found' }),
    });

    await expect(api.getIncidentById('inc-999')).rejects.toThrow(
      'Incident inc-999 not found'
    );
  });
});
