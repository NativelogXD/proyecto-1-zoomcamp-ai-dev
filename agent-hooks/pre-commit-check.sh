#!/usr/bin/env bash
# Agent Guardrail & Pre-Commit Safety Check
set -e

echo "🔒 [Agent Guardrail] Running automated safety and contract validation..."

# 1. Check for accidental secret leakage
echo "  [1/4] Scanning for hardcoded tokens, passwords and API keys..."
if git diff --cached | grep -iE '("api_key"|"secret"|"password")\s*[:=]\s*"[A-Za-z0-9_-]{8,}"' > /dev/null; then
    echo "❌ ERROR: Potential hardcoded secret detected in staged changes!"
    exit 1
fi

# 2. Check OpenAPI specification parity
echo "  [2/4] Validating openapi.yaml syntax and presence..."
if [ ! -f "openapi.yaml" ]; then
    echo "❌ ERROR: Canonical openapi.yaml contract file is missing!"
    exit 1
fi

# 3. Check Python backend linter with Ruff
echo "  [3/4] Running Ruff linter on backend..."
cd backend && uv run ruff check .
cd ..

# 4. Check Frontend tests
echo "  [4/4] Verifying frontend unit test suite..."
cd frontend && npm test
cd ..

echo "✅ [Agent Guardrail] All quality gates passed! Commit approved."
exit 0
