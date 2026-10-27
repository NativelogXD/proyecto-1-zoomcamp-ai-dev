import React from 'react';

export default function RunbookCatalog({ runbooks, selectedIncident, onExecuteRunbook }) {
  return (
    <div className="panel" id="panel-runbooks">
      <div className="panel-header">
        <h2 className="panel-title">
          <span>📚</span> SRE Operational Runbooks
        </h2>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {runbooks.length} available
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {runbooks.map((rb) => (
          <div key={rb.id} className="runbook-item" id={`runbook-item-${rb.id}`}>
            <div className="runbook-info">
              <span className="runbook-title">{rb.title}</span>
              <span className="runbook-desc">{rb.description}</span>
              <span style={{ fontSize: '0.7rem', color: '#818cf8', marginTop: '0.2rem' }}>
                Target: <code>{rb.target_service_id}</code> &bull; Safe Automation
              </span>
            </div>

            <button
              className="btn btn-secondary"
              id={`btn-run-${rb.id}`}
              style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem', whiteSpace: 'nowrap' }}
              disabled={!selectedIncident}
              onClick={() => onExecuteRunbook(rb.id, selectedIncident ? selectedIncident.id : 'inc-101')}
            >
              ▶ Run
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
