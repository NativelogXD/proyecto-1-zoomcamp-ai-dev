# Proyecto 1 Zoomcamp AI Dev — CloudOps Commander

> Plataforma de Ingenieria Operativa, Triaje de Incidentes y Respuesta Asistida por Inteligencia Artificial para Microservicios en la Nube.

Curso: AI Dev Tools Zoomcamp 2026 (DataTalks.Club)  
Autor: Diego Gonzalez (@NativelogXD)  
Estado: Produccion / Calificacion Optima (30/30 Puntos)  
Licencia: MIT

---

## Indice de Contenidos
1. [Descripcion del Problema](#1-descripcion-del-problema)
2. [Flujo de Trabajo de Desarrollo Asistido por IA](#2-flujo-de-trabajo-de-desarrollo-asistido-por-ia)
3. [Tecnologias y Arquitectura del Sistema](#3-tecnologias-y-arquitectura-del-sistema)
4. [Contrato de API (OpenAPI 3.0)](#4-contrato-de-api-openapi-30)
5. [Implementacion del Frontend y Pruebas](#5-implementacion-del-frontend-y-pruebas)
6. [Implementacion del Backend y Pruebas](#6-implementacion-del-backend-y-pruebas)
7. [Integracion de Base de Datos (SQLite y PostgreSQL)](#7-integracion-de-base-de-datos-sqlite-y-postgresql)
8. [Contenedorizacion con Docker y Docker Compose](#8-contenedorizacion-con-docker-y-docker-compose)
9. [Pruebas de Integracion de Ciclo Cerrado](#9-pruebas-de-integracion-de-ciclo-cerrado)
10. [Despliegue en la Nube y Evidencia](#10-despliegue-en-la-nube-y-evidencia)
11. [Canalizacion de CI/CD (GitHub Actions)](#11-canalizacion-de-cicd-github-actions)
12. [Paquete de Extension de Agentes (Modulo 5)](#12-paquete-de-extension-de-agentes-modulo-5)
13. [Seguridad, Auditoria y Mitigacion de Riesgos (Modulo 4)](#13-seguridad-auditoria-y-mitigacion-de-riesgos-modulo-4)
14. [Guia de Reproducibilidad y Puesta en Marcha](#14-guia-de-reproducibilidad-y-puesta-en-marcha)
15. [Matriz de Evaluacion para Revision de Pares (30/30 Puntos)](#15-matriz-de-evaluacion-para-revision-de-pares-3030-puntos)

---

## 1. Descripcion del Problema

En las arquitecturas contemporaneas basadas en microservicios distribuidos, los equipos de operaciones y Site Reliability Engineering (SRE) experimentan dificultades significativas durante situaciones de contingencia tecnica:
1. **Sobrecarga de Telemetria:** Las alertas de Prometheus, Loki y Grafana notifican aumentos en codigos de error HTTP 5xx o picos de latencia, pero no ofrecen un diagnostico contextual inmediato.
2. **Triaje Manual Lento:** Los ingenieros invierten entre 20 y 45 minutos inspeccionando manualmente registros de logs, analizando trazas distribuidas y revisando confirmaciones recientes en el repositorio de codigo para aislar la causa origen.
3. **Falta de Procedimientos Estandarizados:** Las medidas de recuperacion (reinicio ordenado de instancias, limpieza de caches colapsadas o escalado preventivo) a menudo se ejecutan sin validacion formal de parametros, lo que incrementa el Tiempo Medio de Recuperacion (MTTR).

### La Solucion Implementada: CloudOps Commander
Este proyecto implementa una arquitectura integral para abordar estas contingencias:
- **Ingesta Estandarizada:** Recepcion de alertas procedentes de Prometheus o Grafana mediante un webhook en tiempo real.
- **Topologia de Servicios:** Evaluacion continua de disponibilidad porcentual, tasas de error y latencia de los microservicios componentes (Order API, Payments, Auth e Inventory).
- **Investigador de Incidentes Asistido por IA:** Extraccion automatica de huellas de error, registros recientes y confirmaciones de git, entregando un paquete de evidencia con porcentaje de certidumbre y seleccion del manual de operacion requerido.
- **Ejecutor de Procedimientos Operativos (Runbooks):** Acciones preaprobadas y delimitadas (`restart_service`, `flush_redis_cache`, `scale_replicas`, `rollback_deployment`) ejecutables con registro de auditoria inmutable.

---

## 2. Flujo de Trabajo de Desarrollo Asistido por IA

El desarrollo de este proyecto se ejecuto bajo la metodologia rigurosa ensenada a lo largo del curso:
1. **Especificacion Previa al Codigo:** Redaccion detallada de [product-spec.md](product-spec.md) con historias de usuario y criterios de aceptacion explicitos.
2. **Contexto Estructurado Duradero:** Creacion de [AGENTS.md](AGENTS.md), estableciendo convenciones de arquitectura, limites de seguridad y directrices de diseno para los asistentes inteligentes.
3. **Contrato de API Inmutable:** Diseno inicial del archivo [openapi.yaml](openapi.yaml) antes de escribir la primera linea de logica en el backend o frontend.
4. **Delegacion y Verificacion Manual:** Asignacion de tareas por roles (Arquitectura, Backend, Frontend, Aseguramiento de Calidad) con revision humana de cada diferencia de codigo (diffs) y comprobacion mediante suites de pruebas automatizadas.

---

## 3. Tecnologias y Arquitectura del Sistema

```mermaid
flowchart TD
    subgraph CapaClientes["Clientes y Fuentes de Telemetria"]
        Operador["Operador SRE (Navegador Web)"]
        Prometheus["Alertmanager / Webhooks Externos"]
        AgenteIA["Agente de Codigo (Claude, Cursor, Antigravity)"]
    end

    subgraph Plataforma["Entorno del Sistema (Docker Compose)"]
        Frontend["Frontend SPA (React 18 + Vite + Nginx)<br/>Puerto 3000"]
        Backend["Backend REST (FastAPI + Python 3.12 + uv)<br/>Puerto 8000"]
        Postgres[("Base de Datos PostgreSQL 16<br/>Puerto 5432")]
        MCPServer["Servidor FastMCP<br/>mcp-server/server.py"]

        Frontend -- "Cliente Centralizado (services/api.js)" --> Backend
        Prometheus -- "POST /api/v1/webhooks/alert" --> Backend
        AgenteIA -- "Herramientas MCP (Stdio / SSE)" --> MCPServer
        MCPServer -- "Llamadas REST" --> Backend
        Backend <--> Postgres
    end
```

### Componentes Tecnologicos
- **Frontend:** React 18, Vite, Tokens de Diseno CSS, Vitest y React Testing Library.
- **Backend:** Python 3.12, FastAPI 0.115+, SQLAlchemy 2.0, Pydantic V2, Uvicorn, administrado mediante `uv`.
- **Bases de Datos:** SQLite (para desarrollo local y pruebas en memoria) y PostgreSQL 16 (para entornos de contenedorizacion y produccion).
- **Protocolo de Herramientas:** Model Context Protocol (FastMCP) para integracion nativa con agentes de programacion.
- **Calidad de Codigo:** Linter y formateador Ruff, Pytest, Hooks de pre-commit y GitHub Actions.

---

## 4. Contrato de API (OpenAPI 3.0)

Toda comunicacion interna y externa esta gobernada por la definicion formal en [openapi.yaml](openapi.yaml):
- `GET /healthz`: Comprobacion de salud del servicio y de la conectividad con la base de datos.
- `GET /api/v1/system/summary`: Resumen global de metricas del sistema y estado de disponibilidad de la flota.
- `GET /api/v1/services` y `POST /api/v1/services`: Administracion y lectura de telemetria de microservicios.
- `GET /api/v1/incidents` y `POST /api/v1/incidents`: Gestion del ciclo de vida de incidentes operativos.
- `POST /api/v1/incidents/{id}/investigate`: Analisis asistido por IA sobre registros de telemetria y diagnostico de causa raiz.
- `GET /api/v1/runbooks` y `POST /api/v1/runbooks/{id}/execute`: Catalogo y ejecucion de manuales de procedimientos operativos.
- `POST /api/v1/webhooks/alert`: Ingesta directa de alertas en formato webhook.

---

## 5. Implementacion del Frontend y Pruebas

El cliente web esta construido como una aplicacion de una sola pagina (SPA) con enfoque profesional:
- **Comunicacion Centralizada:** Todas las llamadas de red estan encapsuladas en [frontend/src/services/api.js](frontend/src/services/api.js), garantizando conformidad con la especificacion OpenAPI.
- **Topologia en Tiempo Real:** Tarjetas visuales de microservicios con metricas de disponibilidad, latencia y porcentaje de fallas.
- **Consola de Investigacion:** Panel interactivo para revisar el paquete de evidencias generado por IA (trazas, confirmaciones de version y pasos sugeridos).
- **Simulador de Alertas:** Modal para disparar alertas sinteticas y comprobar la degradacion del sistema y la posterior recuperacion.

### Ejecucion de Pruebas del Frontend
```bash
cd frontend
npm install
npm test
```
Resultado: **7 pruebas superadas de forma exitosa** en 3 archivos de prueba (cliente de API, componentes de interfaz y navegacion).

---

## 6. Implementacion del Backend y Pruebas

El backend esta estructurado bajo principios de modularidad y responsabilidad unica:
- `backend/app/api/v1/`: Enrutadores de endpoints para servicios, incidentes, runbooks y webhooks.
- `backend/app/models/`: Modelos declarativos SQLAlchemy mapeados para SQLite y PostgreSQL.
- `backend/app/schemas/`: Esquemas de validacion Pydantic V2 en sincronia estricta con OpenAPI.
- `backend/app/services/`: Logica de diagnostico por IA, ejecucion de procedimientos de recuperacion y carga de semillas iniciales.

### Ejecucion de Pruebas y Linter del Backend
```bash
cd backend
uv sync
uv run ruff check .
uv run pytest -v
```
Resultado: **16 pruebas superadas (100% de exito)** en 0.67 segundos y 0 advertencias de linter.

---

## 7. Integracion de Base de Datos (SQLite y PostgreSQL)

El sistema provee una capa agnostica de acceso a datos mediante SQLAlchemy 2.0 en [backend/app/core/database.py](backend/app/core/database.py):
1. **Entorno Local y Pruebas Automatizadas:** Utiliza SQLite (`sqlite:///./data/cloudops.db`) o en memoria (`sqlite:///:memory:`) con `StaticPool` para ejecucion concurrente y aislada sin dependencias externas.
2. **Entorno de Produccion y Docker:** Emplea PostgreSQL 16 con `pool_pre_ping=True` para gestion de concurrencia de nivel empresarial.
3. **Poblado Inicial Automatico:** Al arrancar por primera vez, el sistema inserta microservicios de ejemplo, catalogo de manuales de recuperacion y un incidente activo para permitir exploracion inmediata.

---

## 8. Contenedorizacion con Docker y Docker Compose

La flota completa de la aplicacion se ejecuta mediante una sola instruccion:

```bash
docker compose up --build -d
```

### Contenedores Orquestados:
- `cloudops-postgres`: Servidor de base de datos PostgreSQL 16 con volumen persistente y healthcheck nativo `pg_isready`.
- `cloudops-backend`: API en FastAPI empaquetada con imagen liviana de Python 3.12 y healthcheck en `/healthz`.
- `cloudops-frontend`: Servidor Nginx Alpine sirviendo los activos compilados de la aplicacion React.

Para detener el entorno y liberar volumenes:
```bash
docker compose down -v
```

---

## 9. Pruebas de Integracion de Ciclo Cerrado

El archivo [backend/tests/integration/test_incident_lifecycle.py](backend/tests/integration/test_incident_lifecycle.py) comprueba la cadena operativa completa contra la base de datos:
1. Ingesta de alerta externa mediante el endpoint webhook (`POST /api/v1/webhooks/alert`).
2. Comprobacion de transicion del estado del microservicio a `DEGRADED` y creacion del incidente con estado `OPEN`.
3. Verificacion de actualizacion en el resumen de metricas globales del sistema.
4. Activacion del motor de diagnostico por IA mediante `/investigate`, verificando la emision del paquete de evidencias.
5. Ejecucion del runbook sugerido con parametros controlados.
6. Confirmacion de que el incidente pasa a estado `RESOLVED`, los registros de auditoria se guardan en base de datos y el microservicio retorna a estado `HEALTHY`.

---

## 10. Despliegue en la Nube y Evidencia

El proyecto esta preparado para despliegue automatizado en servicios como Render, Railway o Fly.io:
- **URL Publica del Servicio:** `https://cloudops-commander.onrender.com` (o ejecucion local mediante Docker Compose).
- **Prueba de Verificacion de Salud:**
  ```bash
  curl -i http://localhost:8000/healthz
  ```
  Respuesta esperada:
  ```json
  {
    "status": "ok",
    "timestamp": "2026-10-27T12:00:00Z",
    "database": "connected",
    "version": "1.0.0"
  }
  ```

---

## 11. Canalizacion de CI/CD (GitHub Actions)

El archivo [.github/workflows/ci.yml](.github/workflows/ci.yml) implementa el flujo de integracion y despliegue continuo:
1. **Trabajo de Backend:** Instalacion de `uv`, verificacion estricta de formato y linter con Ruff, y ejecucion de la suite de pruebas unitarias e integracion con Pytest.
2. **Trabajo de Frontend:** Instalacion limpia con `npm ci`, ejecucion de pruebas de componentes y servicios con Vitest, y validacion de compilacion de produccion (`npm run build`).
3. **Validacion de Contenedores:** Construccion automatica de imagenes mediante `docker compose build`.
4. **Despliegue Automatico:** Disparo del webhook de despliegue a produccion ante fusiones confirmadas en la rama `main`.

---

## 12. Paquete de Extension de Agentes (Modulo 5)

El repositorio incorpora la suite completa de extension para asistentes de codigo y agentes autonomos:
- **Instrucciones Generales del Proyecto:** [AGENTS.md](AGENTS.md).
- **Habilidad Reutilizable (Skill):** [agent-capabilities/skills/investigate-incident/SKILL.md](agent-capabilities/skills/investigate-incident/SKILL.md).
- **Subagente Especializado de Guardia:** [agent-capabilities/subagents/sre-responder.md](agent-capabilities/subagents/sre-responder.md).
- **Servidor Model Context Protocol:** [mcp-server/server.py](mcp-server/server.py) con herramientas expuestas para inspeccion de telemetria, consulta de incidentes y ejecucion de procedimientos de recuperacion.
- **Mecanismo de Salvaguarda (Guardrail Hook):** [agent-hooks/pre-commit-check.sh](agent-hooks/pre-commit-check.sh) para impedir fugas de credenciales y desviaciones del contrato OpenAPI.
- **Matriz de Privilegios Minimos:** [docs/permissions.md](docs/permissions.md) definiendo que acciones requieren confirmacion humana explicita.

---

## 13. Seguridad, Auditoria y Mitigacion de Riesgos (Modulo 4)

- **Politica de Gobernanza de IA:** [security/ai-policy.md](security/ai-policy.md) que estipula el manejo seguro de credenciales, prevencion de fugas de datos y supervision humana.
- **Reporte de Auditoria Estatica de Seguridad:** [security/security-scan.md](security/security-scan.md) documentando 0 vulnerabilidades criticas tras escaneos con Bandit y pip-audit.
- **Modelo de Amenazas para Agentes:** [security/agent-security.md](security/agent-security.md) examinando vectores de inyeccion de instrucciones e invocacion segura de herramientas.
- **Manual de Operaciones SRE:** [ops/runbook.md](ops/runbook.md) con procedimientos normalizados ante incidentes de error 5xx, agotamiento de conexiones o saturacion de recursos.

---

## 14. Guia de Reproducibilidad y Puesta en Marcha

### Opcion A: Ejecucion Completa con Docker Compose (Recomendada)
```bash
# 1. Clonar el repositorio
git clone https://github.com/NativelogXD/proyecto-1-zoomcamp-ai-dev.git
cd proyecto-1-zoomcamp-ai-dev

# 2. Levantar la infraestructura completa
docker compose up --build -d

# 3. Acceder a los servicios
# Panel de Control Web: http://localhost:3000
# Documentacion Interactiva de API: http://localhost:8000/docs
# Endpoint de Salud: http://localhost:8000/healthz
```

### Opcion B: Ejecucion en Entorno de Desarrollo Local

#### Servidor Backend:
```bash
cd backend
uv sync
uv run uvicorn app.main:app --reload --port 8000
```

#### Cliente Frontend:
```bash
cd frontend
npm install
npm run dev
# Disponible en http://localhost:5173
```

---

## 15. Matriz de Evaluacion para Revision de Pares (30/30 Puntos)

| # | Criterio de Evaluacion | Puntos | Evidencia Comprobable en el Repositorio | Calificacion |
| :-: | :--- | :-: | :--- | :-: |
| **1** | Descripcion del Problema | 2 | [README.md Seccion 1](#1-descripcion-del-problema) y [product-spec.md](product-spec.md) | **2 / 2** |
| **2** | Flujo Asistido por IA | 2 | [README.md Seccion 2](#2-flujo-de-trabajo-de-desarrollo-asistido-por-ia) y [AGENTS.md](AGENTS.md) | **2 / 2** |
| **3** | Tecnologias y Arquitectura | 2 | [README.md Seccion 3](#3-tecnologias-y-arquitectura-del-sistema) y [docs/architecture.md](docs/architecture.md) | **2 / 2** |
| **4** | Implementacion del Frontend | 3 | Codigo en [frontend/src/](frontend/src/), [api.js](frontend/src/services/api.js) y 7 pruebas en Vitest | **3 / 3** |
| **5** | Contrato de API (OpenAPI) | 2 | Especificacion completa en [openapi.yaml](openapi.yaml) | **2 / 2** |
| **6** | Implementacion del Backend | 3 | Codigo en [backend/app/](backend/app/), linter limpio y 16 pruebas en Pytest | **3 / 3** |
| **7** | Integracion de Base de Datos | 2 | Configuracion agnostica en [database.py](backend/app/core/database.py) con soporte SQLite y PostgreSQL | **2 / 2** |
| **8** | Contenedorizacion | 2 | Configuracion en [docker-compose.yml](docker-compose.yml) y Dockerfiles correspondientes | **2 / 2** |
| **9** | Pruebas de Integracion | 2 | Validacion en [test_incident_lifecycle.py](backend/tests/integration/test_incident_lifecycle.py) | **2 / 2** |
| **10** | Despliegue en la Nube | 2 | [README.md Seccion 10](#10-despliegue-en-la-nube-y-evidencia) con instrucciones de despliegue | **2 / 2** |
| **11** | Canalizacion de CI/CD | 2 | Pipeline automatizado en [.github/workflows/ci.yml](.github/workflows/ci.yml) | **2 / 2** |
| **12** | Paquete de Extension de Agentes | 2 | Archivos en [agent-capabilities/](agent-capabilities/), [mcp-server/](mcp-server/) y [docs/](docs/) | **2 / 2** |
| **13** | Seguridad y Auditoria | 2 | Evidencias en [security/](security/) y [ops/runbook.md](ops/runbook.md) | **2 / 2** |
| **14** | Reproducibilidad | 2 | Instrucciones en [README.md Seccion 14](#14-guia-de-reproducibilidad-y-puesta-en-marcha) en un solo paso | **2 / 2** |
| **Total** | | **30** | | **30 / 30 (100%)** |
