# Gobernanza de Permisos y Principio de Menor Privilegio

Este documento fija los limites de seguridad, la matriz de autorizaciones y los requerimientos de supervision humana para agentes y asistentes de programacion en este proyecto.

---

## 1. Matriz de Acceso por Nivel de Privilegio

| Componente o Accion | Ambito | Nivel de Acceso | Confirmacion Requerida |
| :--- | :--- | :--- | :--- |
| **Consulta de Salud y Telemetria** | `/healthz`, `/api/v1/services` | Solo Lectura | No |
| **Listado y Detalle de Incidentes** | `/api/v1/incidents` | Solo Lectura | No |
| **Ejecucion de Diagnostico por IA** | `/api/v1/incidents/{id}/investigate` | Analisis / Lectura | No |
| **Reinicio de Contenedor de Servicio** | `rb-restart-service` | Ejecucion | **Si (Operador SRE)** |
| **Purga de Cache Distribuida (Redis)** | `rb-flush-cache` | Ejecucion | **Si (Operador SRE)** |
| **Escalado Horizontal de Replicas** | `rb-scale-replicas` | Ejecucion | No (Parametro acotado a maximo 5) |
| **Reversion de Version de Despliegue** | `rb-rollback-deployment` | Ejecucion | **Si (Aprobacion de Ingeniero Senior)** |
| **Alteracion Directa de Base de Datos** | Comandos SQL sin sanitizar | **Bloqueado** | No permitido bajo ninguna circunstancia |
| **Acceso a Shell del Servidor Host** | Comandos `ssh` o `bash` en el host | **Bloqueado** | No permitido |

---

## 2. Aplicacion de Mecanismos de Salvaguarda

1. **Lista Blanca de Parametros:** Todos los procedimientos operativos validan los datos de entrada contra esquemas JSON predefinidos. Se rechaza cualquier cadena arbitraria de comandos en la capa de API.
2. **Registro Inmutable de Auditoria:** Cada ejecucion almacena un registro en la tabla `runbook_execution_logs`, registrando el identificador de operacion, identificador del incidente, duracion de ejecucion y marca temporal UTC.
3. **Escaneo de Secretos en Confirmaciones:** Todo parche producido por un agente debe superar la verificacion de `agent-hooks/pre-commit-check.sh` antes de ser admitido en el repositorio.
