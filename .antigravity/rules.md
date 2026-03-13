# Synkra AIOS Development Rules for AntiGravity

You are working with Synkra AIOS, an AI-Orchestrated System for Full Stack Development.

## Core Development Rules

### Agent Integration
- Recognize AIOS agent activations: @aios-master, @analyst, @architect, @clickup-ops, @clickup-reporting, @data-engineer, @dev, @devops, @pm, @po, @qa, @sm, @squad-creator, @ux-design-expert
- Agent commands use * prefix: *help, *create-story, *task, *exit
- Follow agent-specific workflows and patterns
- For agent activation, prefer `.agent/workflows/<agent>.md` and then load `.antigravity/agents/<agent>.md` as the canonical agent definition
- Do not infer an AIOS agent from a short summary file when a canonical agent file exists in `.antigravity/agents/`

### Story-Driven Development
1. **Always work from a story file** in docs/stories/
2. **Update story checkboxes** as you complete tasks: [ ] → [x]
3. **Maintain the File List** section with all created/modified files
4. **Follow acceptance criteria** exactly as written

### Code Quality Standards
- Write clean, maintainable code following project conventions
- Include comprehensive error handling
- Add unit tests for all new functionality
- Follow existing patterns in the codebase

### Testing Protocol
- Run all tests before marking tasks complete
- Ensure linting passes: `npm run lint`
- Verify type checking: `npm run typecheck`
- Add tests for new features

## Design System Context Rule

**CRITICAL:** Before creating any page, screen or UI component, always discover the project's design system first.

### Rule: Design System First

```
TRIGGER: User requests page, landing page, screen, UI section, or component
ACTION:
  1. Check if design_system_discovered: true in outputs/ux-design/{project}/.state.yaml
  2. If NOT discovered → run *discover before anything else
  3. Only after discovery → run *create-page or *build
```

### What This Prevents
- Invented colors/fonts not in the project
- Duplicate components that already exist
- Wrong routing conventions (Vite vs Next.js)
- Pages that don't match the existing visual identity

### Commands
| Command | When to Use |
|---------|-------------|
| `*discover` | First thing in every new session or project |
| `*create-page {name}` | Create a full page (auto-runs discover) |
| `*build {component}` | Build a component (runs discover if needed) |

### Page Brief (Required)
When user asks for a page, always collect these 5 fields before generating:
1. Nome da página
2. Rota/URL
3. Objetivo principal
4. Seções desejadas
5. Referência visual (link, descrição ou "seguir padrão do projeto")

Never generate a page without this information.

---

## AIOS Framework Structure

```
aios-core/
├── agents/       # Agent persona definitions
├── tasks/        # Executable task workflows
├── workflows/    # Multi-step workflows
├── templates/    # Document templates
└── checklists/   # Validation checklists

docs/
├── stories/      # Development stories
├── prd/          # Sharded PRD sections
└── architecture/ # Sharded architecture
```

## Development Workflow

1. **Read the story** - Understand requirements fully
2. **Implement sequentially** - Follow task order
3. **Test thoroughly** - Validate each step
4. **Update story** - Mark completed items
5. **Document changes** - Update File List

## Best Practices

### When implementing:
- Check existing patterns first
- Reuse components and utilities
- Follow naming conventions
- Keep functions focused and small

---
*Synkra AIOS AntiGravity Configuration v1.0*
