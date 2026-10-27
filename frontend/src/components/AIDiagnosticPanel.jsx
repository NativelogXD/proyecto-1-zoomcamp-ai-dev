import React from 'react';

export default function AIDiagnosticPanel({ 
  selectedIncident, 
  investigation, 
  isInvestigating, 
  onExecuteRunbook 
}) {
  if (!selectedIncident) {
    return (
      <div className="panel" id="panel-ai-diagnostics">
        <div className="panel-header">
          <h2 className="panel-title">
            Investigador de Incidentes por IA
          </h2>
        </div>
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
          <p>Seleccione un incidente activo para examinar el paquete de evidencias e iniciar el diagnostico automatizado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="panel" id="panel-ai-diagnostics">
      <div className="panel-header">
        <h2 className="panel-title">
          Consola de Diagnostico: {selectedIncident.id}
        </h2>
        <span className={`badge badge-${selectedIncident.severity.toLowerCase()}`}>
          {selectedIncident.severity}
        </span>
      </div>

      {isInvestigating ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#818cf8' }}>
          <p style={{ fontSize: '1rem' }}>
            Analizando trazas distribuidas, registros de error y confirmaciones recientes...
          </p>
        </div>
      ) : investigation ? (
        <div className="ai-console" id="ai-diagnostic-results">
          <div className="ai-header">
            <span>Indice de Confianza: <strong>{investigation.confidence_score}%</strong></span>
            <span>Objetivo: <code>{investigation.evidence_packet?.service_id}</code></span>
          </div>

          <div>
            <span style={{ color: '#f87171', fontWeight: 'bold' }}>[CAUSA RAIZ IDENTIFICADA]:</span>
            <p style={{ marginTop: '0.25rem', color: '#f1f5f9', lineHeight: 1.4 }}>
              {investigation.root_cause}
            </p>
          </div>

          <div>
            <span style={{ color: '#a5b4fc', fontWeight: 'bold' }}>[PAQUETE DE EVIDENCIA]:</span>
            <div className="evidence-box">
              {investigation.evidence_packet?.stack_trace || 'Sin traza disponible.'}
              {'\n'}
              {investigation.evidence_packet?.recent_commit && (
                `\n[CONTEXTO DE DESPLIEGUE]: ${investigation.evidence_packet.recent_commit}`
              )}
            </div>
          </div>

          <div>
            <span style={{ color: '#34d399', fontWeight: 'bold' }}>[PLAN DE MITIGACION]:</span>
            <ul style={{ paddingLeft: '1.25rem', marginTop: '0.25rem' }}>
              {investigation.action_plan.map((step, idx) => (
                <li key={idx} style={{ margin: '0.2rem 0' }}>{step}</li>
              ))}
            </ul>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Runbook Recomendado:</span>
              <p><code>{investigation.recommended_runbook_id}</code></p>
            </div>

            <button
              className="btn btn-success"
              id="btn-remediate-now"
              onClick={() => onExecuteRunbook(investigation.recommended_runbook_id, selectedIncident.id)}
            >
              Ejecutar Remediacion
            </button>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
          <p>No se ha ejecutado un diagnostico previo para este evento.</p>
          <button 
            className="btn btn-primary" 
            style={{ marginTop: '1rem' }}
            onClick={() => onExecuteRunbook(null, selectedIncident.id, true)}
          >
            Iniciar Diagnostico con IA
          </button>
        </div>
      )}
    </div>
  );
}
