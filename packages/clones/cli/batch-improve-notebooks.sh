#!/bin/bash
# Batch improve all experts with their local notebooks and DNA files
# Usage: bash packages/clones/cli/batch-improve-notebooks.sh

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
CLI="$ROOT/packages/clones/cli/index.cjs"
EXPERTS_DIR="$ROOT/experts"

declare -A EXPERT_NAMES=(
  ["alex_hormozi"]="Alex Hormozi"
  ["charlie_munger"]="Charlie Munger"
  ["chris_do"]="Chris Do"
  ["depesh_mandalia"]="Depesh Mandalia"
  ["eli_goldratt"]="Eli Goldratt"
  ["eugene_schwartz"]="Eugene Schwartz"
  ["kasim_aslam"]="Kasim Aslam"
  ["marty_neumeier"]="Marty Neumeier"
  ["nassim_taleb"]="Nassim Taleb"
  ["robert_mckee"]="Robert McKee"
  ["russell_brunson"]="Russell Brunson"
  ["stefan_georgi"]="Stefan Georgi"
  ["tallis_gomes"]="Tallis Gomes"
  ["thiago_finch"]="Thiago Finch"
  ["todd_brown"]="Todd Brown"
  ["tom_breeze"]="Tom Breeze"
)

TOTAL_FILES=0
DONE=0
FAILED=0

# Count total files first
for SLUG in "${!EXPERT_NAMES[@]}"; do
  DIR="$EXPERTS_DIR/$SLUG"
  count=$(find "$DIR/notebooks" "$DIR/dna" -name "*.md" 2>/dev/null | wc -l)
  TOTAL_FILES=$((TOTAL_FILES + count))
done

echo ""
echo "=============================================="
echo " BATCH IMPROVE — $TOTAL_FILES arquivos / ${#EXPERT_NAMES[@]} experts"
echo "=============================================="
echo ""

for SLUG in "${!EXPERT_NAMES[@]}"; do
  NAME="${EXPERT_NAMES[$SLUG]}"
  DIR="$EXPERTS_DIR/$SLUG"

  # Collect all .md files from notebooks/ and dna/
  FILES=$(find "$DIR/notebooks" "$DIR/dna" -name "*.md" 2>/dev/null | sort)

  if [ -z "$FILES" ]; then
    echo "⚠️  $NAME — sem arquivos, pulando"
    continue
  fi

  FILE_COUNT=$(echo "$FILES" | wc -l)
  echo "--- $NAME ($FILE_COUNT arquivos) ---"

  while IFS= read -r FILE; do
    FILENAME=$(basename "$FILE")
    echo "  → $FILENAME"

    if node "$CLI" improve "$NAME" --source="$FILE" 2>&1 | grep -E "(Resumo|Chunks|Skills|Erro)" | head -5; then
      DONE=$((DONE+1))
    else
      FAILED=$((FAILED+1))
      echo "  ❌ falhou: $FILENAME"
    fi

    sleep 1
  done <<< "$FILES"

  echo ""
done

echo "=============================================="
echo " CONCLUÍDO: $DONE OK | $FAILED falhas"
echo "=============================================="
