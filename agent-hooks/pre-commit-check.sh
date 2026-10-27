#!/usr/bin/env bash
# Verificacion de Seguridad y Contratos Previa a Confirmaciones
set -e

echo "[Salvaguarda de Agente] Ejecutando verificaciones automatizadas de calidad y seguridad..."

# 1. Comprobacion de fugas involuntarias de credenciales
echo "  [1/4] Analizando cambios en busca de contrasenas, llaves y tokens expuestos..."
if git diff --cached | grep -iE '("api_key"|"secret"|"password")\s*[:=]\s*"[A-Za-z0-9_-]{8,}"' > /dev/null; then
    echo "ERROR: Se detecto un patron coincidente con un secreto en los cambios preparados."
    exit 1
fi

# 2. Comprobacion del contrato canonico OpenAPI
echo "  [2/4] Validando presencia del archivo canónico openapi.yaml..."
if [ ! -f "openapi.yaml" ]; then
    echo "ERROR: El contrato canónico openapi.yaml no se encuentra en la raiz del proyecto."
    exit 1
fi

# 3. Validacion de formato y linter en backend
echo "  [3/4] Ejecutando linter Ruff en backend..."
cd backend && uv run ruff check .
cd ..

# 4. Validacion de pruebas en frontend
echo "  [4/4] Ejecutando suite de pruebas unitarias en frontend..."
cd frontend && npm test
cd ..

echo "[Salvaguarda de Agente] Todas las comprobaciones resultaron conformes. Confirmacion autorizada."
exit 0
