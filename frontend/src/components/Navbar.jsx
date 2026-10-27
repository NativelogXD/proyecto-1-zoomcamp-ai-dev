import React from 'react';

export default function Navbar({ systemStatus, onRefresh }) {
  const statusColor = 
    systemStatus === 'OPERATIONAL' ? 'healthy' :
    systemStatus === 'CRITICAL' ? 'down' : 'degraded';

  return (
    <nav className="navbar" id="main-navbar">
      <div className="brand">
        <div className="brand-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <div>
          <span>CloudOps Commander</span>
          <span className="brand-badge">Proyecto 1 AI Dev</span>
        </div>
      </div>

      <div className="nav-stats">
        <div className="stat-chip" id="nav-system-status">
          <span className={`stat-dot ${statusColor}`}></span>
          <span>Sistema: <strong>{systemStatus || 'VERIFICANDO...'}</strong></span>
        </div>

        <button 
          className="btn btn-secondary" 
          id="btn-refresh-dashboard"
          onClick={onRefresh}
          style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
        >
          Actualizar
        </button>
      </div>
    </nav>
  );
}
