# Servidor Model Context Protocol (MCP) — CloudOps Commander

Este servidor MCP expone herramientas operativas seguras a asistentes y agentes de codigo (Claude Code, Cursor, Antigravity, OpenCode).

## Herramientas Expuestas

| Nombre de la Herramienta | Descripcion Funcional | Nivel de Privilegio |
| :--- | :--- | :--- |
| `list_active_incidents` | Consulta los incidentes abiertos o en estado de investigacion. | Solo Lectura |
| `get_service_telemetry` | Obtiene disponibilidad, tasa de error y latencia p95 de un servicio. | Solo Lectura |
| `trigger_ai_investigation` | Correlaciona registros y genera un paquete de evidencias. | Analisis / Diagnostico |
| `execute_remediation_runbook` | Ejecuta un procedimiento operativo preaprobado y validado. | Ejecucion (Requiere autorizacion) |

## Configuracion del Cliente

Agregar la siguiente seccion en la configuracion de servidores MCP de su entorno:

```json
{
  "mcpServers": {
    "cloudops-commander": {
      "command": "python",
      "args": ["c:/Users/xiao/Documents/cursos/datatalcks/ai zoom/proyecto-1-zoomcamp-ai-dev/mcp-server/server.py"],
      "env": {
        "CLOUDOPS_API_URL": "http://localhost:8000"
      }
    }
  }
}
```
