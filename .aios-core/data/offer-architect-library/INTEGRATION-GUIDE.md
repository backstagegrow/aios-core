# Integration Guide — Offer Architect Library

## Overview

A biblioteca de Offer Architect foi criada em 14/03/2026 para centralizar recursos estratégicos de construção de ofertas. Este guia orienta como usar os recursos com AIOS.

**Localização:** `.aios-core/data/offer-architect-library/`
**Tamanho:** ~12MB (18 arquivos)
**Tipos:** Templates, Models, Checklists, Briefings, Contracts

---

## Quick Start

### Para o @offer-architect:
1. Leia `README.md` para visão geral
2. Use a seção "Como Usar com @offer-architect" para workflow
3. Referencie arquivos específicos conforme a fase do projeto

### Para quem trabalha com ofertas:
1. Consulte o checklist para validação
2. Use briefing templates para discovery
3. Use contratos padrão para documentação
4. Copie estruturas D6D e Ficha Técnica para suas ofertas

### Para IA/Agentes:
Os arquivos podem ser processados com:
- `@notebooklm` — extrair insights estruturados
- `claude-api` — usar para RAG (Retrieval-Augmented Generation)
- Checklists — usar com `checklist-runner` skill
- Briefings — usar como templates para discovery

---

## File Reference

### Recommended Reading Order

**Ideação:**
1. EBOOK 30 IDEIAS (inspiração)
2. Oferta - Ângulos de Promessas (messaging)
3. Checklist da Oferta (validação)

**Execução:**
1. Estrutura da página - D6D (blueprint)
2. 50 MODELOS DE COPY (messaging)
3. 300 headlines (opções)
4. Modelo - Ficha Técnica (documentação)

**Operação:**
1. Briefing apropriado (discovery)
2. Contrato apropriado (formalização)

---

## Integration Points

### With @offer-architect Agent
```
@offer-architect deve ter acesso direto aos arquivos:
- Templates para geração de copy
- Models para estrutura de ofertas
- Checklists para validação
- Briefings para discovery com clientes
```

### With Story Development
```
Feature Story: "Criar Oferta de [Produto]"
├─ Use Briefing para requirements gathering
├─ Use Models para estrutura
├─ Use Templates para copy/messaging
├─ Use Checklist para acceptance criteria
└─ Use Contract para documentação final
```

### With Notifications/Alerts
```
Quando oferta é criada:
→ Notificar para revisar contra Checklist da Oferta
→ Validar contra D6D structure
→ Revisar copy contra 50 modelos
```

### With Design System
```
Elemento "Offer Card" ou "Offer Page":
├─ Use D6D para estrutura
├─ Use Oferta - Ângulos para copy options
└─ Use briefing de branding para consistência visual
```

---

## Processing with NotebookLM

Para extrair insights estruturados de arquivos PDF/DOCX:

```bash
# Processar um arquivo
@notebooklm create-notebook --name "Copy Models Analysis" \
  --sources ".aios-core/data/offer-architect-library/templates/50 MODELOS DE COPY.pdf"

# Gerar artifacts
@notebooklm generate-artifact --type "study-guide" --target "Copy Writing Framework"
@notebooklm generate-artifact --type "briefing" --target "Offer Structure Blueprint"
```

**Benefícios:**
- Extração automática de padrões
- Síntese de conceitos-chave
- Criação de study guides
- Geração de briefings estruturados

---

## Using with Claude API (RAG)

Para usar arquivos como contexto em aplicações:

```javascript
import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";

const client = new Anthropic();

// Ler arquivo como contexto
const offerChecklist = fs.readFileSync(
  ".aios-core/data/offer-architect-library/checklists/Checklist da Oferta Irresistível.pdf",
  "utf-8"
);

const message = await client.messages.create({
  model: "claude-opus-4-6",
  max_tokens: 2048,
  system: `You are an Offer Architect. Use this checklist as reference:
${offerChecklist}

When validating offers, ensure all items from the checklist are covered.`,
  messages: [
    {
      role: "user",
      content: "Validate this offer against the checklist...",
    },
  ],
});
```

---

## Workflow Patterns

### Pattern 1: Offer Ideation
```
1. User provides problem/market
2. @offer-architect queries EBOOK 30 IDEIAS
3. Generate 5 offer concepts
4. Validate each against Checklist
5. Present top 3 with rationale
```

### Pattern 2: Copy Generation
```
1. User provides offer premise
2. Use 50 MODELOS DE COPY as reference
3. Generate 10 copy variations
4. Use 300 headlines for headline options
5. Validate messaging against Ângulos de Promessas
6. Present best 3 options
```

### Pattern 3: Structure & Docs
```
1. Offer concept approved
2. Apply D6D structure
3. Fill Modelo - Ficha Técnica
4. Generate briefing for design/dev teams
5. Create contract from templates
6. Validate complete package
```

### Pattern 4: Client Onboarding
```
1. New offer project starts
2. Send appropriate briefing (site/events/ads/social/branding)
3. Collect information
4. Create offer documentation
5. Present contract for signature
6. Proceed to implementation
```

---

## Maintenance

### Adding New Resources
```
1. Place file in appropriate subfolder (templates/models/etc)
2. Update README.md with file description
3. Update statistics table
4. Commit with: "feat: add [filename] to offer-architect-library"
5. Tag in Release Notes
```

### Removing Obsolete Resources
```
1. Move to /archive folder
2. Update README.md to remove reference
3. Update statistics table
4. Commit with: "chore: archive [filename] in offer-architect-library"
```

### Version Control
```
- Track in git (`.aios-core/data/offer-architect-library/`)
- Large files tracked with git-lfs if > 100MB
- Archive old versions but don't delete
- Always maintain README and INTEGRATION-GUIDE
```

---

## Performance Considerations

**File Sizes:**
- EBOOK 30 IDEIAS: 8.0MB (largest, reference for ideation)
- Estrutura D6D: 643KB (medium, reference for structure)
- 50 MODELOS: 739KB (medium, reference for copy)
- Others: < 300KB each

**Loading:**
- Keep library accessible but not in session context by default
- Load specific files on-demand when working on offer projects
- Use `notebooklm` to create abstracts for faster reference
- Cache frequently used files in agent memory

---

## Troubleshooting

### "File not found"
```
Ensure file is in correct subfolder:
✓ .aios-core/data/offer-architect-library/{templates|models|checklists|briefings|contracts}/
```

### "Can't open DOCX/PDF"
```
Use:
- LibreOffice / Microsoft Word for DOCX
- Adobe Reader / Browser for PDF
- Or @notebooklm to extract content
```

### "Too large to process"
```
For 8MB EBOOK file:
- Use @notebooklm to extract summary
- Use claude-api with file chunks
- Extract specific section PDFs manually
```

---

## Success Metrics

✅ **Goals of this integration:**
- Reduce time to create offers from scratch
- Improve consistency of messaging across offers
- Provide templates and checklists for quality gates
- Centralize offer resources for reuse
- Enable agents to reference proven patterns

**Measuring success:**
- Offers created per sprint (should ↑)
- Time per offer (should ↓)
- Checklist compliance rate (should → 100%)
- Customer feedback on clarity/messaging (should ↑)

---

## Contact & Support

**Maintained by:** @offer-architect squad
**Library created:** 14/03/2026
**Last updated:** See commit history
**Questions:** Reference README.md or INTEGRATION-GUIDE.md

---

**Next steps:**
1. ✅ Library created and integrated
2. ⏳ @offer-architect reviews and extends
3. ⏳ First offer projects use library resources
4. ⏳ Feedback loop for improvements
