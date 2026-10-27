import React from 'react';

export default function ServiceTopology({ services }) {
  return (
    <div className="panel" id="panel-service-topology">
      <div className="panel-header">
        <h2 className="panel-title">
          Topologia de Microservicios
        </h2>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {services.length} registrados
        </span>
      </div>

      <div className="services-list" id="services-grid">
        {services.map((svc) => (
          <div key={svc.id} className={`service-card ${svc.status}`} id={`service-card-${svc.id}`}>
            <div className="service-title">
              <span>{svc.name}</span>
              <span className={`badge badge-${svc.status.toLowerCase()}`}>
                {svc.status}
              </span>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              {svc.description}
            </p>

            <div className="service-meta">
              <span>Latencia: <strong>{svc.latency_ms}ms</strong></span>
              <span>Errores: <strong>{(svc.error_rate * 100).toFixed(1)}%</strong></span>
              <span>Uptime: <strong>{svc.uptime_percentage}%</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
