# Modelo de Amenazas de Agentes e Integracion Segura de Herramientas MCP

Este documento analiza los vectores de riesgo asociados a herramientas de desarrollo asistidas por IA, subagentes autonomos y servidores Model Context Protocol (MCP).

---

## 1. Modelado de Amenazas (Analisis STRIDE)

| Categoria de Amenaza | Vector Potencial | Mitigacion en CloudOps Commander |
| :--- | :--- | :--- |
| **Suplantacion (Spoofing)** | Peticiones fraudulentas fingiendo ser un respondedor de incidentes. | Validacion de firmas de encabezado en endpoints de webhook; transporte local seguro en herramientas MCP. |
| **Manipulacion (Tampering)** | Respuestas alucinadas generando parametros destructivos. | Los runbooks rechazan comandos de shell arbitrarios. Unicamente se aceptan parametros predefinidos y validados. |
| **Repudio (Repudiation)** | Acciones operativas ejecutadas sin posibilidad de trazabilidad. | Cada operacion genera una entrada inmutable en `runbook_execution_logs` con contexto de invocador y marca de tiempo UTC. |
| **Fuga de Informacion** | Agentes exponiendo credenciales de base de datos en registros. | El script `pre-commit-check.sh` previene la confirmacion de secretos. Las contraseñas residen unicamente en variables de entorno. |
| **Denegacion de Servicio** | Invocacion descontrolada de reinicios en bucle infinito. | Limites de frecuencia (rate-limiting) en endpoints de diagnostico y ejecucion. |
| **Elevacion de Privilegios** | Subagentes intentando eliminar esquemas o tablas. | La cuenta de base de datos en produccion restringe operaciones DDL en tiempo de ejecucion. |

---

## 2. Capas de Defensa en Profundidad

1. **Capa 1: Delimitacion de Contexto (AGENTS.md y SKILL.md):** El agente actua bajo limites estrictamente definidos.
2. **Capa 2: Validacion de Esquema (OpenAPI y Pydantic):** Cada parametro se valida de forma estricta antes de ingresar a la logica de negocio.
3. **Capa 3: Herramientas MCP Acotadas:** Las herramientas unicamente exponen acciones de alto nivel orientadas a incidentes, sin proveer acceso a la shell del sistema operativo.
4. **Capa 4: Supervision Humana Obligatoria:** Los manuales que alteran la disponibilidad del servicio requieren autorizacion explicita previa a su ejecucion.
