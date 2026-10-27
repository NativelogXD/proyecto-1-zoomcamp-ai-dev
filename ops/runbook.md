# Manual de Operaciones SRE y Procedimientos Estandarizados (Runbooks)

Sistema: CloudOps Commander (Proyecto 1 Zoomcamp AI Dev)  
Ambito: Flota de Microservicios (Order API, Payments, Auth e Inventory)  
Responsable: Equipo de Site Reliability Engineering (SRE)

---

## 1. Matriz de Clasificacion de Incidentes

| Nivel de Severidad | SLA de Respuesta | Condiciones de Activacion | Ruta de Escalamiento |
| :---: | :---: | :--- | :--- |
| **P1 — Critico** | < 5 minutos | Caida total del servicio, tasa 5xx > 5%, falla de pagos | Ingeniero de Guardia + Lider Tecnico |
| **P2 — Alto** | < 15 minutos | Latencia p95 > 1000ms, degradacion de servicio secundario, saturacion de pool > 85% | Ingeniero de Guardia Primario |
| **P3 — Medio** | < 1 hora | Errores aislados intermitentes, cola de procesamiento retrasada | Equipo de Desarrollo del Servicio |
| **P4 — Bajo** | Proximo ciclo | Advertencias menores de diagnostico o cosméticas | Pila de Trabajo Regular |

---

## 2. Procedimientos Operativos Estandarizados (SOP)

### SOP-01: Tasa Elevada de Errores HTTP 5xx en Order API
- **Sintomas:** Alerta de Prometheus `HighHttp5xxErrorRate` activada; Grafana reporta aumento sostenido de respuestas HTTP 500 en `/api/orders`.
- **Diagnostico:**
  1. Revisar el paquete de evidencias invocando `/api/v1/incidents/{id}/investigate` o la herramienta MCP `query_incident_logs`.
  2. Correlacionar con cambios recientes de version.
- **Accion de Remediacion:**
  - Ejecutar Runbook: `rb-restart-service`
  ```bash
  curl -X POST http://localhost:8000/api/v1/runbooks/rb-restart-service/execute \
    -H "Content-Type: application/json" \
    -d '{"incident_id": "<ID_INCIDENTE>", "parameters": {"graceful_timeout_sec": 5}}'
  ```
- **Verificacion:**
  - Consultar el estado de `/api/v1/services/srv-orders`: debe retornar `HEALTHY` con tasa de error inferior al 0.1%.

---

### SOP-02: Saturacion de Conexiones o Bloqueos en Base de Datos
- **Sintomas:** Consultas hacia la base de datos exceden el tiempo limite; el numero de conexiones activas alcanza el umbral maximo.
- **Accion de Remediacion:**
  - Ejecutar Runbook: `rb-flush-cache`
  ```bash
  curl -X POST http://localhost:8000/api/v1/runbooks/rb-flush-cache/execute \
    -H "Content-Type: application/json" \
    -d '{"incident_id": "<ID_INCIDENTE>", "parameters": {"flush_all": false}}'
  ```
- **Verificacion:**
  - La ocupacion del pool de conexiones desciende por debajo del 20%.

---

### SOP-03: Picos Repentinos de Carga y Aumento de Latencia
- **Sintomas:** La latencia p95 supera los 1500ms durante campanas promocionales o trafico imprevisto.
- **Accion de Remediacion:**
  - Ejecutar Runbook: `rb-scale-replicas`
  ```bash
  curl -X POST http://localhost:8000/api/v1/runbooks/rb-scale-replicas/execute \
    -H "Content-Type: application/json" \
    -d '{"incident_id": "<ID_INCIDENTE>", "parameters": {"replicas": 4}}'
  ```
- **Verificacion:**
  - La latencia se normaliza por debajo de 50ms.

---

### SOP-04: Regresion por Despliegue de Nueva Version
- **Sintomas:** Una version recientemente liberada produce incompatibilidades de esquema o excepciones no controladas.
- **Accion de Remediacion:**
  - Ejecutar Runbook: `rb-rollback-deployment`
  ```bash
  curl -X POST http://localhost:8000/api/v1/runbooks/rb-rollback-deployment/execute \
    -H "Content-Type: application/json" \
    -d '{"incident_id": "<ID_INCIDENTE>", "parameters": {"target_revision": "previous"}}'
  ```
- **Verificacion:**
  - El servicio revierte a la revision previa estable y las pruebas de humo concluyen con exito.
