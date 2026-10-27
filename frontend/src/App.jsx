import React, { useState, useEffect } from 'react';
import api from './services/api';
import Navbar from './components/Navbar';
import MetricSummary from './components/MetricSummary';
import ServiceTopology from './components/ServiceTopology';
import IncidentFeed from './components/IncidentFeed';
import AIDiagnosticPanel from './components/AIDiagnosticPanel';
import RunbookCatalog from './components/RunbookCatalog';
import SimulateAlertModal from './components/SimulateAlertModal';

export default function App() {
  const [summary, setSummary] = useState(null);
  const [services, setServices] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [runbooks, setRunbooks] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [investigation, setInvestigation] = useState(null);
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Fetch all dashboard data
  const fetchData = async () => {
    try {
      const [sumData, srvData, incData, rbData] = await Promise.all([
        api.getSystemSummary(),
        api.listServices(),
        api.listIncidents(),
        api.listRunbooks(),
      ]);
      setSummary(sumData);
      setServices(srvData);
      setIncidents(incData);
      setRunbooks(rbData);

      // Auto-select first active incident if none selected
      if (!selectedIncident && incData.length > 0) {
        setSelectedIncident(incData[0]);
      }
    } catch (err) {
      console.error('Error al cargar datos del panel:', err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, []);

  // Handle AI Investigation
  const handleInvestigate = async (incidentId) => {
    const inc = incidents.find((i) => i.id === incidentId);
    if (inc) setSelectedIncident(inc);
    setIsInvestigating(true);
    try {
      const result = await api.investigateIncident(incidentId);
      setInvestigation(result);
      showToast(`Diagnostico por IA completado para el incidente ${incidentId}`, 'success');
      fetchData();
    } catch (err) {
      showToast(`Fallo en la investigacion: ${err.message}`, 'error');
    } finally {
      setIsInvestigating(false);
    }
  };

  // Handle Runbook Execution
  const handleExecuteRunbook = async (runbookId, incidentId, triggerInvestigateOnly = false) => {
    if (triggerInvestigateOnly) {
      handleInvestigate(incidentId);
      return;
    }

    try {
      const result = await api.executeRunbook(runbookId, incidentId);
      showToast(`Procedimiento ${runbookId} ejecutado con exito en ${result.execution_time_ms}ms`, 'success');
      setInvestigation(null);
      await fetchData();
    } catch (err) {
      showToast(`Fallo en la ejecucion del runbook: ${err.message}`, 'error');
    }
  };

  // Handle Alert Simulation
  const handleSimulateAlert = async (payload) => {
    try {
      const created = await api.ingestAlertWebhook(payload);
      showToast(`Alerta simulada '${payload.alert_name}' genero el incidente ${created.id}`, 'error');
      await fetchData();
      setSelectedIncident(created);
    } catch (err) {
      showToast(`Fallo en la simulacion: ${err.message}`, 'error');
    }
  };

  const showToast = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar 
        systemStatus={summary?.system_status} 
        onRefresh={fetchData} 
      />

      <main className="container">
        {notification && (
          <div 
            style={{
              padding: '0.75rem 1.25rem',
              marginBottom: '1.5rem',
              borderRadius: 'var(--radius-md)',
              background: notification.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
              border: `1px solid ${notification.type === 'error' ? '#f87171' : '#34d399'}`,
              color: '#f8fafc',
              fontSize: '0.875rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>{notification.message}</span>
            <button 
              onClick={() => setNotification(null)}
              style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}
            >
              Cerrar
            </button>
          </div>
        )}

        <MetricSummary summary={summary} />

        <div className="action-bar">
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Centro de Comando y Operaciones de Incidentes
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Triaje de telemetria en tiempo real, diagnostico estructurado de causa raiz y ejecucion controlada de manuales SRE.
            </p>
          </div>

          <button 
            className="btn btn-danger"
            id="btn-open-simulate-modal"
            onClick={() => setIsAlertModalOpen(true)}
          >
            Simular Alerta de Monitoreo
          </button>
        </div>

        <div className="dashboard-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <ServiceTopology services={services} />
            <IncidentFeed 
              incidents={incidents}
              selectedIncident={selectedIncident}
              onSelectIncident={(inc) => {
                setSelectedIncident(inc);
                setInvestigation(null);
              }}
              onInvestigate={handleInvestigate}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <AIDiagnosticPanel 
              selectedIncident={selectedIncident}
              investigation={investigation}
              isInvestigating={isInvestigating}
              onExecuteRunbook={handleExecuteRunbook}
            />
            <RunbookCatalog 
              runbooks={runbooks}
              selectedIncident={selectedIncident}
              onExecuteRunbook={handleExecuteRunbook}
            />
          </div>
        </div>
      </main>

      <SimulateAlertModal 
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        onSimulate={handleSimulateAlert}
      />
    </div>
  );
}
