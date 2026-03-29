#!/bin/bash
# Batch create all expert clones
# Usage: bash packages/clones/cli/batch-create.sh

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
CLI="$ROOT/packages/clones/cli/index.cjs"

EXPERTS=(
  "Charlie Munger"
  "Chris Do"
  "Depesh Mandalia"
  "Eli Goldratt"
  "Eugene Schwartz"
  "Kasim Aslam"
  "Marty Neumeier"
  "Nassim Taleb"
  "Robert McKee"
  "Russell Brunson"
  "Stefan Georgi"
  "Tallis Gomes"
  "Thiago Finch"
  "Todd Brown"
  "Tom Breeze"
)

TOTAL=${#EXPERTS[@]}
DONE=0
FAILED=0

echo ""
echo "=========================================="
echo " BATCH CREATE — $TOTAL clones"
echo "=========================================="
echo ""

for NAME in "${EXPERTS[@]}"; do
  echo "[$((DONE+1))/$TOTAL] Criando: $NAME"
  echo "------------------------------------------"

  if node "$CLI" create "$NAME" 2>&1 | grep -E "(Resumo|Erro|falha)"; then
    DONE=$((DONE+1))
    echo "✅ $NAME — OK"
  else
    FAILED=$((FAILED+1))
    echo "❌ $NAME — falhou"
  fi

  echo ""
  # Small delay to avoid rate limiting
  sleep 2
done

echo "=========================================="
echo " CONCLUÍDO: $DONE OK | $FAILED falhas"
echo "=========================================="
