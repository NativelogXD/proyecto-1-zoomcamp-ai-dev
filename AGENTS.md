# AGENTS.md — Instrucciones del Proyecto para Asistentes y Agentes de IA

Contexto duradero, convenciones arquitectonicas, comandos estandarizados y limites de seguridad para asistentes de programacion y agentes autonomos.

---

## 1. Identidad y Proposito del Proyecto

**Proyecto 1 Zoomcamp AI Dev (CloudOps Commander)** es una plataforma full-stack de ingenieria operativa y respuesta automatizada a incidentes desarrollada en el marco del curso **AI Dev Tools Zoomcamp 2026** de DataTalks.Club.
- **Objetivo Central:** Conectar alertas de observabilidad con diagnostico estructurado mediante IA y ejecucion segura de procedimientos de recuperacion (Runbooks).
- **Desarrollo Guiado por Contrato:** Toda definicion de endpoints y esquemas de datos debe derivarse de forma estricta del archivo `openapi.yaml`.

---

## 2. Convenciones Arquitectonicas

```text
proyecto-1-zoomcamp-ai-dev/
├── product-spec.md                # Especificacion funcional y criterios de aceptacion
├── AGENTS.md                      # Instrucciones de contexto y normas para agentes
├── openapi.yaml                   # Fuente unica de verdad para contratos de API
├── docker-compose.yml             # Orquestacion de contenedores (Frontend, Backend, PostgreSQL)
├── frontend/                      # Cliente SPA (React, Vite, cliente API centralizado)
├── backend/                       # API REST (FastAPI, Python 3.12, uv)
│   ├── app/
│   │   ├── api/v1/                # Controladores de rutas en conformidad con OpenAPI
│   │   ├── core/                  # Configuracion y gestion de sesiones de base de datos
│   │   ├── models/                # Entidades SQLAlchemy
│   │   ├── schemas/               # Esquemas Pydantic V2
│   │   └── services/              # Logica de negocio (motor de diagnostico, runbooks, semillas)
│   └── tests/
│       ├── unit/                  # Pruebas unitarias aisladas en memoria
│       └── integration/           # Pruebas de integracion del ciclo de vida con base de datos
├── agent-capabilities/            # Habilidades reutilizables y definicion de subagentes (Modulo 5)
├── agent-hooks/                   # Mecanismos de control previo a confirmaciones (git hooks)
├── mcp-server/                    # Servidor Model Context Protocol (FastMCP) para herramientas de agente
├── security/                      # Politicas de IA, auditorias estaticas y analisis de amenazas
└── ops/                           # Manuales de procedimientos operativos y guias de ejecucion
```

### Reglas de Ingenieria
1. **Invarianza del Contrato de API:** Ningun endpoint ni modelo debe modificarse sin actualizar previamente `openapi.yaml`.
2. **Arquitectura de Base de Datos Dual:** La capa de persistencia debe admitir tanto SQLite (`sqlite:///./data/cloudops.db` o memoria) como PostgreSQL (`postgresql://...`) sin dependencias exclusivas de un motor especifico.
3. **Comunicacion Centralizada en Frontend:** Todas las peticiones HTTP del frontend deben ejecutarse a traves del servicio `frontend/src/services/api.js`. No se permiten llamadas `fetch()` dispersas en componentes individuales.
4. **Motor de Diagnostico Determinista:** El motor de evaluacion en `backend/app/services/ai_investigator.py` debe generar paquetes de evidencia estructurados, puntajes de confianza numericos y recomendaciones claras.
5. **Separacion Rigurosa de Pruebas:** Las pruebas unitarias en `backend/tests/unit/` no deben depender de la red ni de bases de datos externas. Las pruebas de integracion en `backend/tests/integration/` verifican flujos completos de mutacion y persistencia.

---

## 3. Comandos Estandarizados de Desarrollo

### Backend (Python y uv)
```bash
# Cambiar al directorio del backend
cd backend

# Sincronizar dependencias
uv sync

# Iniciar servidor de desarrollo
uv run uvicorn app.main:app --reload --port 8000

# Ejecutar pruebas unitarias
uv run pytest tests/unit -v

# Ejecutar pruebas de integracion
uv run pytest tests/integration -v

# Validar estilo y linter con Ruff
uv run ruff check .
```

### Frontend (React y Vite)
```bash
# Cambiar al directorio del frontend
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Ejecutar pruebas unitarias y de componentes
npm test

# Compilar paquete de produccion
npm run build
```

### Orquestacion con Docker Compose
```bash
# Construir y levantar la flota completa (Backend, Frontend, PostgreSQL)
docker compose up --build -d

# Validar salud del sistema
curl http://localhost:8000/healthz

# Consultar registros de ejecucion
docker compose logs -f

# Detener y remover volumenes
docker compose down -v
```

---

## 4. Seguridad y Mecanismos de Salvaguarda

- **Manejo de Credenciales:** Queda estrictamente prohibido incluir tokens, secretos o contraseñas en archivos de codigo o control de versiones. Todas las credenciales se suministran mediante variables de entorno documentadas en `.env.example`.
- **Validacion de Procedimientos Operativos:** Los Runbooks deben validar los parametros recibidos contra esquemas estrictos antes de alterar cualquier componente.
- **Limites de Herramientas de IA:** El agente de investigacion opera en modo de lectura y analisis. Toda accion con impacto en disponibilidad requiere confirmacion explicita del operador.
