# CloudOps Commander MCP Server

This MCP server equips AI coding agents (Claude Code, Cursor, Antigravity, OpenCode) with scoped operational tools to monitor, investigate, and remediate incidents in CloudOps Commander.

## Exposed Tools

| Tool Name | Description | Permissions |
| :--- | :--- | :--- |
| `list_active_incidents` | Retrieves open and investigating incidents. | Read-Only |
| `get_service_telemetry` | Inspects uptime, error rates, and p95 latency for a microservice. | Read-Only |
| `trigger_ai_investigation` | Synthesizes logs and generates an evidence packet. | Read / Analyze |
| `execute_remediation_runbook` | Applies an atomic, pre-validated operational runbook. | Execute (Requires confirmation) |

## Configuration

Add the following to your MCP client configuration (e.g. `claude_desktop_config.json` or Antigravity MCP settings):

```json
{
  "mcpServers": {
    "cloudops-commander": {
      "command": "python",
      "args": ["c:/Users/xiao/Documents/cursos/datatalcks/ai zoom/cloudops-commander/mcp-server/server.py"],
      "env": {
        "CLOUDOPS_API_URL": "http://localhost:8000"
      }
    }
  }
}
```
