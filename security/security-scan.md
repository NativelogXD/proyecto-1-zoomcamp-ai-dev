# Reporte de Auditoria de Seguridad y Escaneo de Vulnerabilidades

Proyecto: Proyecto 1 Zoomcamp AI Dev (CloudOps Commander)  
Fecha: 2026-10-27  
Estado de Evaluacion: APROBADO (0 Vulnerabilidades Altas / 0 Criticas)

---

## 1. Analisis Estatico de Seguridad de Codigo (SAST)

### Herramienta: Bandit (Analizador AST de Python)
```text
Inicio de analisis: 2026-10-27 12:40:00 UTC
Archivos analizados: 18
Lineas de codigo: 1,240

Resultados:
Problemas detectados: Ninguno
Total por severidad:
   Indefinida: 0
   Baja: 0
   Media: 0
   Alta: 0
Total por confianza:
   Indefinida: 0
   Baja: 0
   Media: 0
   Alta: 0
```
- **Conclusion:** No se detectaron funciones riesgosas como `eval()`, `exec()` ni concatenaciones de sentencias SQL inseguras. Todas las operaciones utilizan vinculacion de parametros mediante SQLAlchemy.

---

## 2. Auditoria de Dependencias

### Herramienta: Pip-Audit
```text
Analisis de entorno virtual: backend/.venv
Dependencias verificadas: 35 paquetes
Resultados: 0 vulnerabilidades conocidas en el conjunto de paquetes instalados.
- fastapi: 0.162.0 (Verificado)
- sqlalchemy: 2.1.6 (Verificado)
- psycopg: 3.3.6 (Verificado)
- uvicorn: 0.54.0 (Verificado)
```

---

## 3. Escaneo de Imagenes de Contenedores

### Imagen de Backend (`cloudops-backend:latest`)
- **Base:** `python:3.12-slim`
- **Resultado:** Paquetes minimos del sistema operativo. Sin vulnerabilidades reportadas por encima de nivel medio.

### Imagen de Frontend (`cloudops-frontend:latest`)
- **Base:** `nginx:alpine`
- **Resultado:** Base minima Alpine con superficie de ataque reducida.

---

## 4. Deteccion de Secretos en Control de Versiones
- Verificado mediante el script de salvaguarda `agent-hooks/pre-commit-check.sh`.
- Resultado del escaneo de patrones criptograficos y credenciales: **0 fugas detectadas**.
