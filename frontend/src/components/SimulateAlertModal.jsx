import React, { useState } from 'react';

export default function SimulateAlertModal({ isOpen, onClose, onSimulate }) {
  const [alertName, setAlertName] = useState('HighHttp5xxErrorRate');
  const [serviceId, setServiceId] = useState('srv-orders');
  const [severity, setSeverity] = useState('P1');
  const [summary, setSummary] = useState('HTTP 500 error rate spiked past 5% on checkout endpoint');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSimulate({
      alert_name: alertName,
      service_id: serviceId,
      severity,
      summary,
      details: 'Automated Grafana webhook simulated alert'
    });
    onClose();
  };

  return (
    <div className="modal-overlay" id="modal-simulate-alert">
      <div className="modal-content">
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
          Simulate Grafana / Prometheus Alert Webhook
        </h3>
        <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
          Inject a synthetic alert payload to trigger real-time incident generation and degradation in the telemetry pipeline.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Alert Name</label>
            <input 
              className="form-input" 
              value={alertName} 
              onChange={(e) => setAlertName(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Target Microservice</label>
            <select 
              className="form-select" 
              value={serviceId} 
              onChange={(e) => setServiceId(e.target.value)}
            >
              <option value="srv-orders">srv-orders (Order Processing API)</option>
              <option value="srv-payments">srv-payments (Payment Gateway)</option>
              <option value="srv-auth">srv-auth (Authentication & Identity)</option>
              <option value="srv-inventory">srv-inventory (Inventory Worker)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Severity Level</label>
            <select 
              className="form-select" 
              value={severity} 
              onChange={(e) => setSeverity(e.target.value)}
            >
              <option value="P1">P1 — Critical Outage</option>
              <option value="P2">P2 — High Degradation</option>
              <option value="P3">P3 — Medium Warning</option>
              <option value="P4">P4 — Low Diagnostic</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Summary / Description</label>
            <textarea 
              className="form-textarea" 
              rows="3" 
              value={summary} 
              onChange={(e) => setSummary(e.target.value)}
              required 
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-danger" id="btn-submit-simulate-alert">
              ⚡ Fire Alert Webhook
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
