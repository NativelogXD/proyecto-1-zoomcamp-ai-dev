import React from 'react';

export default function Navbar({ systemStatus, onRefresh }) {
  const statusColor = 
    systemStatus === 'OPERATIONAL' ? 'healthy' :
    systemStatus === 'CRITICAL' ? 'down' : 'degraded';

  return (
    <nav className="navbar" id="main-navbar">
      <div className="brand">
        <div className="brand-icon">
          <span>🛡️</span>
        </div>
        <div>
          <span>CloudOps Commander</span>
          <span className="brand-badge">AI SRE 2026</span>
        </div>
      </div>

      <div className="nav-stats">
        <div className="stat-chip" id="nav-system-status">
          <span className={`stat-dot ${statusColor}`}></span>
          <span>System: <strong>{systemStatus || 'CHECKING...'}</strong></span>
        </div>

        <button 
          className="btn btn-secondary" 
          id="btn-refresh-dashboard"
          onClick={onRefresh}
          style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
        >
          🔄 Refresh
        </button>
      </div>
    </nav>
  );
}
