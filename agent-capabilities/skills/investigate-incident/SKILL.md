---
name: investigate-incident
description: Procedimiento operativo estructurado para investigacion de incidentes de produccion, analisis de telemetria y seleccion de manuales SRE.
---

# Habilidad: Investigacion de Incidentes en Produccion

Utilizar esta habilidad cuando se reciba una alerta de monitoreo o se aperture un incidente operativo en el sistema.

## Paso 1: Ingesta de Contexto e Identificacion del Servicio
1. Consultar el detalle del incidente:
   ```bash
   curl -s http://localhost:8000/api/v1/incidents/<id_incidente>
   ```
2. Obtener la telemetria actual del microservicio afectado:
   ```bash
   curl -s http://localhost:8000/api/v1/services/<id_servicio>
   ```

## Paso 2: Correlacion de Senales y Paquete de Evidencia
1. Inspeccionar registros en busca de patrones `5xx`, tiempos de espera agotados o bloqueos de concurrencia.
2. Comprobar si existio un despliegue reciente coincidente con la degradacion.
3. Clasificar severidad:
   - `P1`: Interrupcion total o tasa de fallas > 5% en rutas criticas.
   - `P2`: Degradacion severa o latencia p95 > 1000ms.
   - `P3`: Advertencia o fallo intermitente.

## Paso 3: Activacion del Diagnostico por IA
1. Invocar el endpoint de investigacion:
   ```bash
   curl -s -X POST http://localhost:8000/api/v1/incidents/<id_incidente>/investigate
   ```
2. Validar el puntaje de certeza y el identificador de runbook sugerido.

## Paso 4: Propuesta y Ejecucion del Procedimiento de Mitigacion
1. Si el runbook recomendado posee `requires_confirmation: true`, solicitar autorizacion al operador humano.
2. Tras la confirmacion, despachar la ejecucion:
   ```bash
   curl -s -X POST http://localhost:8000/api/v1/runbooks/<id_runbook>/execute \
     -H "Content-Type: application/json" \
     -d '{"incident_id": "<id_incidente>", "parameters": {}}'
   ```
3. Comprobar que el estado de salud del servicio retorne a `HEALTHY`.
