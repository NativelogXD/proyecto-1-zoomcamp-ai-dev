# Documentacion del Paquete de Extension de Agentes (Modulo 5)

## 1. Descripcion General

El **Paquete de Extension de Agentes** de este proyecto permite que asistentes de codigo y agentes autonomos colaboren dentro del ciclo operativo y de desarrollo de software de forma controlada y disciplinada.

En lugar de delegar permisos irrestrictos o utilizar instrucciones aisladas, esta arquitectura provee:
1. **Instrucciones de Contexto Duradero:** Definidas en [AGENTS.md](../AGENTS.md) con especificaciones de arquitectura, directrices de diseno y comandos de verificacion.
2. **Procedimiento Operativo Reutilizable (Skill):** En [agent-capabilities/skills/investigate-incident/SKILL.md](../agent-capabilities/skills/investigate-incident/SKILL.md), estructurando el paso a paso del triaje de incidentes.
3. **Subagente Especializado:** Definido en [agent-capabilities/subagents/sre-responder.md](../agent-capabilities/subagents/sre-responder.md), acotando la responsabilidad a tareas operativas de guardia.
4. **Servidor Model Context Protocol (MCP):** Implementado en [mcp-server/server.py](../mcp-server/server.py), proveyendo cuatro herramientas especializadas accesibles via protocolo estandar.
5. **Mecanismo de Salvaguarda (Guardrail Hook):** Provisto en [agent-hooks/pre-commit-check.sh](../agent-hooks/pre-commit-check.sh), impidiendo fugas involuntarias de credenciales y desalineaciones de esquema.
6. **Matriz de Privilegios Minimos:** Especificada en [docs/permissions.md](permissions.md), delimitando que operaciones requieren autorizacion humana obligatoria.

---

## 2. Guion de Demostracion (Flujo de Ejecucion Paso a Paso)

```mermaid
sequenceDiagram
    autonumber
    actor Desarrollador as Evaluador / Ingeniero
    participant Agente as Agente de IA
    participant MCP as Servidor MCP
    participant API as API de CloudOps
    participant Gancho as Gancho de Salvaguarda

    Desarrollador->>Agente: "Una alerta se disparo en srv-orders. Diagnostica y sugiere mitigacion."
    Agente->>Agente: Lee AGENTS.md y activa la habilidad investigate-incident
    Agente->>MCP: Invoca list_active_incidents()
    MCP->>API: GET /api/v1/incidents
    API-->>MCP: Retorna incidente activo inc-101
    Agente->>MCP: Invoca trigger_ai_investigation("inc-101")
    MCP->>API: POST /api/v1/incidents/inc-101/investigate
    API-->>MCP: Retorna diagnostico y runbook recomendado rb-restart-service
    Agente->>Desarrollador: "Causa identificada: bloqueo en base de datos. Se sugiere ejecutar rb-restart-service. Desea proceder?"
    Desarrollador->>Agente: "Autorizado. Proceder."
    Agente->>MCP: Invoca execute_remediation_runbook("rb-restart-service", "inc-101")
    MCP->>API: POST /api/v1/runbooks/rb-restart-service/execute
    API-->>MCP: Ejecucion completada exitosamente
    Agente->>Gancho: Ejecuta verificacion de pre-commit antes de registrar cambios
    Gancho-->>Agente: Verificacion aprobada (0 fugas de secretos, pruebas superadas)
```

1. **Paso 1:** El agente lee `AGENTS.md` para asimilar la estructura y lineamientos del repositorio.
2. **Paso 2:** El agente carga la habilidad `investigate-incident`.
3. **Paso 3:** El agente consulta las herramientas del servidor MCP para obtener el inventario de incidentes y la telemetria actual.
4. **Paso 4:** El agente activa el analisis de causas raiz mediante el endpoint de diagnostico.
5. **Paso 5:** El agente solicita autorizacion humana antes de despachar acciones de recuperacion con impacto sobre el servicio.
6. **Paso 6:** El mecanismo de salvaguarda valida que no se introduzcan regresiones de seguridad ni credenciales expuestas.
