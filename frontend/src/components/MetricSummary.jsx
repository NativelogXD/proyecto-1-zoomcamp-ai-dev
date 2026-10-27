import React from 'react';

export default function MetricSummary({ summary }) {
  if (!summary) return null;

  return (
    <div className="metrics-grid" id="metrics-summary-grid">
      <div className="metric-card" id="metric-total-services">
        <span className="metric-label">Microservicios Monitoreados</span>
        <span className="metric-value">{summary.total_services}</span>
        <span style={{ fontSize: '0.75rem', color: '#34d399' }}>
          Estado Optimo: {summary.healthy_services}
        </span>
      </div>

      <div className="metric-card" id="metric-active-incidents">
        <span className="metric-label">Incidentes Activos</span>
        <span className="metric-value" style={{ color: summary.active_incidents > 0 ? '#f87171' : '#34d399' }}>
          {summary.active_incidents}
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Requieren Atencion SRE
        </span>
      </div>

      <div className="metric-card" id="metric-resolved-incidents">
        <span className="metric-label">Incidentes Resueltos</span>
        <span className="metric-value" style={{ color: '#60a5fa' }}>
          {summary.resolved_incidents}
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Mitigados Mediante Runbooks
        </span>
      </div>

      <div className="metric-card" id="metric-uptime">
        <span className="metric-label">Disponibilidad de Flota</span>
        <span className="metric-value" style={{ color: '#a78bfa' }}>
          99.94%
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Promedio Global
        </span>
      </div>
    </div>
  );
}
