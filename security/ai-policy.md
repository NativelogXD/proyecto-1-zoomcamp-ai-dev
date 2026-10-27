# Politica de Gobernanza y Uso Seguro de Herramientas de Inteligencia Artificial

Proyecto: Proyecto 1 Zoomcamp AI Dev (CloudOps Commander)  
Fecha de Entrada en Vigor: 2026-10-27  
Ambito: Ingenieros de desarrollo, asistentes de programacion (Antigravity, Claude Code, Cursor, Copilot) y subagentes autonomos.

---

## 1. Uso Aceptable de Asistentes de IA

1. **Desarrollo Asistido con Revision Obligatoria:**
   - Las herramientas de IA pueden generar propuestas de codigo, casos de prueba, documentacion y scripts de operacion.
   - Cada linea de codigo generada debe ser revisada y validada por un ingeniero antes de incorporarse a la rama principal (`main`).
2. **Delimitacion Estricta del Contexto:**
   - Unicamente deben proveerse al contexto de los asistentes los archivos estrictamente requeridos para la tarea (`AGENTS.md`, `openapi.yaml` y modulos especificos).
   - Queda terminantemente prohibido indexar bases de datos productivas o llaves criptograficas en el contexto de modelos externos.

---

## 2. Proteccion de Credenciales y Secretos

- **Prohibicion de Ingestion de Secretos:** Llaves de API, contraseñas de bases de datos, llaves privadas SSH y credenciales de proveedores cloud nunca deben incluirse en prompts, archivos de contexto o confirmaciones de control de versiones.
- **Inyeccion Segura:** Todo secreto debe inyectarse exclusivamente mediante variables de entorno en tiempo de ejecucion o gestores de secretos dedicados, nunca alojarse en el codigo fuente.

---

## 3. Limites para Agentes Autonomos

1. **Aislamiento de Operaciones de Escritura:** Los subagentes autonomos tienen permiso de lectura y analisis de telemetria. Cualquier accion con impacto sobre el estado del sistema requiere confirmacion explicita del operador humano.
2. **Diagnosticos Deterministas:** Las evaluaciones de diagnostico deben sustentarse en paquetes de evidencia tecnica comprobables (trazas, codigos de error, confirmaciones) y no en suposiciones libres.
3. **Pistas de Auditoria:** Toda operacion ejecutada debe generar registros estructurados para auditorias posteriores y cumplimiento normativo.
