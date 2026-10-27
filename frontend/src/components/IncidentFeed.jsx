import React, { useState } from 'react';

export default function IncidentFeed({ 
  incidents, 
  selectedIncident, 
  onSelectIncident, 
  onInvestigate 
}) {
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const filtered = filterSeverity === 'ALL'
    ? incidents
    : incidents.filter((inc) => inc.severity === filterSeverity);

  return (
    <div className="panel" id="panel-incidents-feed">
      <div className="panel-header">
        <h2 className="panel-title">
          Registro de Incidentes Activos
        </h2>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {['ALL', 'P1', 'P2', 'P3'].map((sev) => (
            <button
              key={sev}
              className={`btn btn-secondary ${filterSeverity === sev ? 'active' : ''}`}
              style={{ 
                padding: '0.25rem 0.6rem', 
                fontSize: '0.75rem',
                borderColor: filterSeverity === sev ? 'var(--accent-primary)' : 'var(--border-color)'
              }}
              onClick={() => setFilterSeverity(sev)}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      <div className="incidents-list" id="incidents-container">
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            No se registran incidentes bajo el filtro seleccionado.
          </div>
        ) : (
          filtered.map((inc) => {
            const isSelected = selectedIncident && selectedIncident.id === inc.id;
            return (
              <div 
                key={inc.id} 
                className={`incident-card ${isSelected ? 'active' : ''}`}
                id={`incident-item-${inc.id}`}
                onClick={() => onSelectIncident(inc)}
              >
                <div className="incident-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={`badge badge-${inc.severity.toLowerCase()}`}>
                      {inc.severity}
                    </span>
                    <span className="incident-title">{inc.title}</span>
                  </div>
                  <span className={`badge badge-${inc.status === 'RESOLVED' ? 'healthy' : 'degraded'}`}>
                    {inc.status}
                  </span>
                </div>

                <p className="incident-desc">{inc.description}</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Objetivo: <code>{inc.service_id}</code> &bull; {new Date(inc.created_at).toLocaleTimeString()}
                  </span>

                  {inc.status !== 'RESOLVED' && (
                    <button 
                      className="btn btn-primary"
                      id={`btn-investigate-${inc.id}`}
                      style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onInvestigate(inc.id);
                      }}
                    >
                      Diagnosticar con IA
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
