import React, { useState } from 'react';

export default function SimulateAlertModal({ isOpen, onClose, onSimulate }) {
  const [alertName, setAlertName] = useState('HighHttp5xxErrorRate');
  const [serviceId, setServiceId] = useState('srv-orders');
  const [severity, setSeverity] = useState('P1');
  const [summary, setSummary] = useState('La tasa de respuestas HTTP 500 supero el umbral critico del 5%');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSimulate({
      alert_name: alertName,
      service_id: serviceId,
      severity,
      summary,
      details: 'Notificacion simulada de webhook de Prometheus'
    });
    onClose();
  };

  return (
    <div className="modal-overlay" id="modal-simulate-alert">
      <div className="modal-content">
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
          Simular Webhook de Alerta de Monitoreo
        </h3>
        <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
          Inyecte una carga util sintetica para evaluar la creacion de incidentes y la degradacion automatica de telemetria.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Nombre de Alerta</label>
            <input 
              className="form-input" 
              value={alertName} 
              onChange={(e) => setAlertName(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Microservicio Afectado</label>
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
            <label className="form-label">Nivel de Severidad</label>
            <select 
              className="form-select" 
              value={severity} 
              onChange={(e) => setSeverity(e.target.value)}
            >
              <option value="P1">P1 — Interrupcion Critica</option>
              <option value="P2">P2 — Degradacion Alta</option>
              <option value="P3">P3 — Advertencia Media</option>
              <option value="P4">P4 — Diagnostico Bajo</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Descripcion del Evento</label>
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
              Cancelar
            </button>
            <button type="submit" className="btn btn-danger" id="btn-submit-simulate-alert">
              Emitir Alerta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
