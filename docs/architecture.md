# Arquitectura del Sistema — Proyecto 1 Zoomcamp AI Dev

> Documento de diseno detallado que especifica la arquitectura del sistema, los modelos de datos, los contratos de comunicacion y el ciclo cerrado de triaje y recuperacion de incidentes.

---

## 1. Topologia de Arquitectura de Alto Nivel

```mermaid
flowchart TD
    subgraph Clientes["Clientes y Fuentes de Telemetria"]
        UsuarioWeb["Interfaz SRE / Operador<br/>(React SPA en puerto 3000)"]
        Monitoreo["Prometheus / Grafana / Webhooks"]
        ClienteAgente["Asistente de Codigo con IA<br/>(Claude Code, Antigravity, Cursor)"]
    end

    subgraph Plataforma["Entorno del Sistema (Docker Compose)"]
        subgraph CapaFrontend["Capa de Frontend (:3000)"]
            SPA["Servidor Estatico Nginx Alpine<br/>React 18 + Vite"]
            ClienteAPI["Cliente de API Centralizado<br/>services/api.js"]
            SPA --> ClienteAPI
        end

        subgraph CapaBackend["Capa de Aplicacion y Operaciones (:8000)"]
            FastAPI["API REST FastAPI 0.115+<br/>app/main.py"]
            Contrato["Contrato OpenAPI 3.0<br/>openapi.yaml"]
            InvestigadorIA["Investigador de Incidentes por IA<br/>app/services/ai_investigator.py"]
            MotorRunbooks["Motor de Ejecucion de Runbooks<br/>app/services/runbook_runner.py"]

            FastAPI <--> Contrato
            FastAPI --> InvestigadorIA
            FastAPI --> MotorRunbooks
        end

        subgraph CapaPersistencia["Capa de Datos y Persistencia (:5432)"]
            PostgresDB[("Motor PostgreSQL 16<br/>(Produccion y Compose)")]
            SQLiteDB[("Motor SQLite 3<br/>(Desarrollo Local y Pruebas en Memoria)")]
        end

        subgraph CapaMCP["Capa de Herramientas para Agentes"]
            ServidorMCP["Servidor FastMCP<br/>mcp-server/server.py"]
        end
    end

    UsuarioWeb --> SPA
    ClienteAPI -- "REST JSON HTTP/1.1" --> FastAPI
    Monitoreo -- "POST /api/v1/webhooks/alert" --> FastAPI
    ClienteAgente -- "Protocolo de Herramientas Stdio / SSE" --> ServidorMCP
    ServidorMCP -- "Llamadas REST" --> FastAPI

    FastAPI --> PostgresDB
    FastAPI -. "Respaldo y Pruebas" .-> SQLiteDB
```

---

## 2. Ciclo de Vida del Incidente y Secuencia de Recuperacion

```mermaid
sequenceDiagram
    autonumber
    participant FuenteAlerta as Prometheus / Webhook
    participant Backend as Backend FastAPI (:8000)
    participant BD as PostgreSQL / SQLite
    participant IA as Investigador de Incidentes
    participant Interfaz as Panel de Control SRE (:3000)
    participant Operador as Ingeniero de Guardia

    FuenteAlerta->>Backend: POST /api/v1/webhooks/alert (Carga util de alerta)
    Backend->>BD: Persistir Incidente (estado: OPEN, severidad: P1)
    Backend->>BD: Degradar estado del microservicio a DEGRADED
    Backend-->>FuenteAlerta: HTTP 201 Created (Incidente inc-xxx)

    Interfaz->>Backend: Consulta periodica /api/v1/system/summary e /incidents
    Backend-->>Interfaz: Incidente inc-xxx visible en el panel

    Operador->>Interfaz: Solicita "Diagnosticar con IA" sobre inc-xxx
    Interfaz->>Backend: POST /api/v1/incidents/inc-xxx/investigate
    Backend->>IA: Correlacionar registros, trazas de error y confirmaciones
    IA-->>Backend: Paquete de Evidencia + Runbook sugerido (rb-restart-service)
    Backend->>BD: Actualizar estado del incidente a INVESTIGATING
    Backend-->>Interfaz: Mostrar analisis de causa raiz y certeza (96%)

    Operador->>Interfaz: Pulsa "Ejecutar Remediacion"
    Interfaz->>Backend: POST /api/v1/runbooks/rb-restart-service/execute
    Backend->>Backend: Ejecutar procedimiento controlado de reinicio
    Backend->>BD: Asentar registro en runbook_execution_logs
    Backend->>BD: Restaurar estado del microservicio a HEALTHY
    Backend->>BD: Marcar incidente como RESOLVED (registrar resolved_at)
    Backend-->>Interfaz: HTTP 200 OK (execution_time_ms: 1250ms, status: SUCCESS)
    Interfaz-->>Operador: Notificacion: Microservicio recuperado a estado HEALTHY
```

---

## 3. Arquitectura de la Capa de Datos

La persistencia del sistema esta implementada mediante SQLAlchemy 2.0 con resolucion dinamica del motor de base de datos:

1. **Desarrollo Local y Pruebas Automatizadas:**
   - Dialecto: `sqlite:///./data/cloudops.db` (en archivo) o `sqlite:///:memory:` (en memoria para pytest mediante `StaticPool`).
   - Beneficio: Puesta en marcha instantanea sin dependencias de infraestructura y ejecucion de pruebas completas en menos de un segundo.
2. **Entorno de Produccion y Docker Compose:**
   - Dialecto: `postgresql://cloudops:cloudops_password@postgres:5432/cloudops_db`.
   - Beneficio: Aislamiento transaccional estricto, alta concurrencia y compatibilidad nativa con despliegues en la nube.
3. **Entidades Principales:**
   - `services`: Inventario de microservicios, latencia promedio, tasa de fallas y estado de disponibilidad.
   - `incidents`: Registro historico de eventos operativos, severidad, diagnostico de causa y marcas de tiempo de resolucion.
   - `runbooks`: Catalogo de procedimientos de mitigacion con definicion de esquemas de parametros admisibles.
   - `runbook_execution_logs`: Registro inmutable de auditoria de cada accion ejecutada manual o automaticamente.
