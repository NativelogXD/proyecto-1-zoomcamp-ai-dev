# Especificacion del Producto: Proyecto 1 Zoomcamp AI Dev (CloudOps Commander)

## 1. Resumen Ejecutivo y Declaracion del Problema

En las arquitecturas modernas basadas en microservicios distribuidos, los sistemas emiten continuamente volumenes elevados de telemetria (metricas, trazas distribuidas y registros estructurados). Cuando ocurre una interrupcion de servicio o degradacion de rendimiento:
- Los ingenieros de confiabilidad de sitios (SRE) y profesionales de DevOps se enfrentan a una fatiga constante de alertas provenientes de sistemas de monitoreo como Prometheus o Grafana.
- El proceso de clasificacion y diagnostico inicial resulta lento y propenso a errores: se invierten entre 15 y 45 minutos correlacionando manualmente trazas de error, verificando despliegues recientes de codigo e inspeccionando registros en componentes heterogeneos.
- Las acciones de mitigacion (reinicio ordenado de contenedores, purga de caches distribuidas, escalado de replicas o reversiones de versiones) se demoran innecesariamente, incrementando el Tiempo Medio de Resolucion (MTTR) y el impacto sobre los usuarios.

**Proyecto 1 Zoomcamp AI Dev (CloudOps Commander)** aborda este problema mediante una plataforma integral y disciplinada de gestion operativa de incidentes asistida por inteligencia artificial:
1. Ingesta alertas en tiempo real mediante webhooks estandarizados.
2. Supervisa el estado de salud y los acuerdos de nivel de servicio (SLA) de la flota de microservicios.
3. Sintetiza automaticamente paquetes de evidencia (registros de error, trazas de ejecucion, anomalias de latencia y diferencias de versiones de codigo) y delega el diagnostico estructurado a un motor de investigacion asistido por IA.
4. Provee procedimientos operativos estandarizados (Runbooks SRE) acotados, seguros y validados, ejecutables bajo un esquema de control con supervision humana o de forma automatizada.

---

## 2. Usuarios Objetivo e Historias de Usuario

### Usuarios Objetivo
- **Ingenieros de Confiabilidad (SRE):** Requieren sintesis inmediata de causas raiz y ejecucion segura de procedimientos de mitigacion al recibir alertas.
- **Ingenieros de Backend y DevOps:** Necesitan visibilidad centralizada sobre dependencias de servicios, generacion consistente de reportes post-mortem y estandarizacion de manuales de operacion.
- **Lideres Tecnicos:** Demandan trazabilidad completa de disponibilidad del sistema, frecuencia de incidentes, evolucion del MTTR y politicas estrictas de gobernanza sobre herramientas de IA.

### Historias de Usuario
- **HU-1 (Supervision de Salud de Microservicios):** Como ingeniero SRE, quiero visualizar en tiempo real el estado de salud (Saludable, Degradado, Fuera de Servicio), latencia p95 y tasa de errores de cada microservicio para identificar anomalias oportunamente.
- **HU-2 (Ingesta Automatizada de Alertas):** Como ingeniero DevOps, quiero que los webhooks procedentes de Prometheus o Grafana Alertmanager generen automaticamente incidentes categorizados por severidad (P1-Critico a P4-Bajo).
- **HU-3 (Diagnostico de Causa Raiz por IA):** Como responsable de guardia operativa, quiero solicitar un analisis de diagnostico para cualquier incidente activo y recibir un reporte respaldado por evidencia tecnica, porcentaje de confianza y recomendacion de remediacion en segundos.
- **HU-4 (Ejecucion Segura de Procedimientos Operativos):** Como operador de sistemas, quiero ejecutar procedimientos previamente aprobados (reinicio de servicio, purga de cache, escalado de replicas, reversion de version) con validacion estricta de parametros y registro de auditoria.
- **HU-5 (Ciclo de Vida del Incidente y Auditoria):** Como lider de ingenieria, quiero disponer de un registro historico inmutable de todas las acciones ejecutadas, marcas de tiempo UTC de mitigacion y resolucion final de incidentes.

---

## 3. Criterios de Aceptacion y Requisitos Funcionales

1. **Salud del Sistema y Observabilidad:**
   - Endpoint estandar `/healthz` que responda con el estado operativo, marca de tiempo UTC y estado de conexion a la base de datos.
   - Catalogo de microservicios con metricas de latencia, disponibilidad porcentual y porcentaje de error.
2. **Gestion del Ciclo de Vida de Incidentes:**
   - Endpoints REST en estricta conformidad con el contrato `openapi.yaml`.
   - Transiciones de estado finitas: `OPEN` -> `INVESTIGATING` -> `MITIGATED` -> `RESOLVED`.
   - Niveles de severidad normalizados: `P1`, `P2`, `P3`, `P4`.
3. **Motor de Diagnostico de Incidentes:**
   - Evaluacion determinista basada en huellas de error, registros estructurados y contexto de despliegues.
   - Emision de puntaje de confianza numerico (0-100%), descripcion de causa raiz y referencia al identificador del runbook sugerido.
4. **Ejecutor de Procedimientos Operativos (Runbooks):**
   - Catalogo de procedimientos con validacion de parametros contra esquemas definidos.
   - Registro de duracion de ejecucion en milisegundos y captura de trazas de registro de auditoria.
5. **Persistencia Dual y Contrato de API:**
   - Cumplimiento estricto del contrato canónico OpenAPI 3.0 en todas las interacciones cliente-servidor.
   - Capa de persistencia compatible con SQLite (para desarrollo local y pruebas automatizadas) y PostgreSQL (para entornos de produccion y orquestacion con Docker Compose).

---

## 4. Alcance Excluido (No-Metas para el Producto Minimo Viable)

- Autenticacion corporativa compleja mediante proveedores SAML/SSO externos (se utiliza esquema simplificado para MVP).
- Ejecucion directa de comandos SSH arbitrarios sobre instancias fisicas sin contencion (las acciones se limitan a controladores de contenedores y APIs internas).
- Replicacion geografica distribuida de bases de datos multirregion.
