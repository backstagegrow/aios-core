---

## Execution Modes

**Choose your execution mode:**

### 1. YOLO Mode - Fast, Autonomous (0-1 prompts)
- Autonomous decision making with logging
- Minimal user interaction
- **Best for:** Simple, deterministic tasks

### 2. Interactive Mode - Balanced, Educational (5-10 prompts) **[DEFAULT]**
- Explicit decision checkpoints
- Educational explanations
- **Best for:** Learning, complex decisions

### 3. Pre-Flight Planning - Comprehensive Upfront Planning
- Task analysis phase (identify all ambiguities)
- Zero ambiguity execution
- **Best for:** Ambiguous requirements, critical work

**Parameter:** `mode` (optional, default: `interactive`)

---

## Task Definition (AIOS Task Format V1.0)

```yaml
task: generateAiFrontendPrompt()
responsável: Uma (Empathizer)
responsavel_type: Agente
atomic_layer: Template

**Entrada:**
- campo: name
  tipo: string
  origem: User Input
  obrigatório: true
  validação: Must be non-empty, lowercase, kebab-case

- campo: options
  tipo: object
  origem: User Input
  obrigatório: false
  validação: Valid JSON object with allowed keys

- campo: force
  tipo: boolean
  origem: User Input
  obrigatório: false
  validação: Default: false

**Saída:**
- campo: created_file
  tipo: string
  destino: File system
  persistido: true

- campo: validation_report
  tipo: object
  destino: Memory
  persistido: false

- campo: success
  tipo: boolean
  destino: Return value
  persistido: false
```

---

## Pre-Conditions

**Purpose:** Validate prerequisites BEFORE task execution (blocking)

**Checklist:**

```yaml
pre-conditions:
  - [ ] Target does not already exist; required inputs provided; permissions granted
    tipo: pre-condition
    blocker: true
    validação: |
      Check target does not already exist; required inputs provided; permissions granted
    error_message: "Pre-condition failed: Target does not already exist; required inputs provided; permissions granted"
```

---

## Post-Conditions

**Purpose:** Validate execution success AFTER task completes

**Checklist:**

```yaml
post-conditions:
  - [ ] Resource created successfully; validation passed; no errors logged
    tipo: post-condition
    blocker: true
    validação: |
      Verify resource created successfully; validation passed; no errors logged
    error_message: "Post-condition failed: Resource created successfully; validation passed; no errors logged"
```

---

## Acceptance Criteria

**Purpose:** Definitive pass/fail criteria for task completion

**Checklist:**

```yaml
acceptance-criteria:
  - [ ] Resource exists and is valid; no duplicate resources created
    tipo: acceptance-criterion
    blocker: true
    validação: |
      Assert resource exists and is valid; no duplicate resources created
    error_message: "Acceptance criterion not met: Resource exists and is valid; no duplicate resources created"
```

---

## Tools

**External/shared resources used by this task:**

- **Tool:** component-generator
  - **Purpose:** Generate new components from templates
  - **Source:** .aios-core/scripts/component-generator.js

- **Tool:** file-system
  - **Purpose:** File creation and validation
  - **Source:** Node.js fs module

---

## Scripts

**Agent-specific code for this task:**

- **Script:** create-component.js
  - **Purpose:** Component creation workflow
  - **Language:** JavaScript
  - **Location:** .aios-core/scripts/create-component.js

---

## Error Handling

**Strategy:** retry

**Common Errors:**

1. **Error:** Resource Already Exists
   - **Cause:** Target file/resource already exists in system
   - **Resolution:** Use force flag or choose different name
   - **Recovery:** Prompt user for alternative name or force overwrite

2. **Error:** Invalid Input
   - **Cause:** Input name contains invalid characters or format
   - **Resolution:** Validate input against naming rules (kebab-case, lowercase, no special chars)
   - **Recovery:** Sanitize input or reject with clear error message

3. **Error:** Permission Denied
   - **Cause:** Insufficient permissions to create resource
   - **Resolution:** Check file system permissions, run with elevated privileges if needed
   - **Recovery:** Log error, notify user, suggest permission fix

---

## Performance

**Expected Metrics:**

```yaml
duration_expected: 3-8 min (estimated)
cost_estimated: $0.002-0.005
token_usage: ~1,500-5,000 tokens
```

**Optimization Notes:**
- Cache template compilation; minimize data transformations; lazy load resources

---

## Metadata

```yaml
story: N/A
version: 1.0.0
dependencies:
  - N/A
tags:
  - automation
  - workflow
updated_at: 2025-11-17
```

---

# No checklists needed - this task generates prompts, validation is built into prompt generation methodology
tools:
  - github-cli
  - context7
---

# Create AI Frontend Prompt Task

## Purpose

To generate a masterful, comprehensive, and optimized prompt that can be used with any AI-driven frontend development tool (e.g., Vercel v0, Lovable.ai, or similar) to scaffold or generate significant portions of a frontend application.

## Inputs

- Completed UI/UX Specification (`front-end-spec.md`)
- Completed Frontend Architecture Document (`front-end-architecture`) or a full stack combined architecture such as `architecture.md`
- Main System Architecture Document (`architecture` - for API contracts and tech stack to give further context)

## Key Activities & Instructions

### 1. Core Prompting Principles

Before generating the prompt, you must understand these core principles for interacting with a generative AI for code.

- **Be Explicit and Detailed**: The AI cannot read your mind. Provide as much detail and context as possible. Vague requests lead to generic or incorrect outputs.
- **Iterate, Don't Expect Perfection**: Generating an entire complex application in one go is rare. The most effective method is to prompt for one component or one section at a time, then build upon the results.
- **Provide Context First**: Always start by providing the AI with the necessary context, such as the tech stack, existing code snippets, and overall project goals.
- **Mobile-First Approach**: Frame all UI generation requests with a mobile-first design mindset. Describe the mobile layout first, then provide separate instructions for how it should adapt for tablet and desktop.

### 2. The Structured Prompting Framework

To ensure the highest quality output, you MUST structure every prompt using the following four-part framework.

1. **High-Level Goal**: Start with a clear, concise summary of the overall objective. This orients the AI on the primary task.
   - _Example: "Create a responsive user registration form with client-side validation and API integration."_
2. **Detailed, Step-by-Step Instructions**: Provide a granular, numbered list of actions the AI should take. Break down complex tasks into smaller, sequential steps. This is the most critical part of the prompt.
   - _Example: "1. Create a new file named `RegistrationForm.js`. 2. Use React hooks for state management. 3. Add styled input fields for 'Name', 'Email', and 'Password'. 4. For the email field, ensure it is a valid email format. 5. On submission, call the API endpoint defined below."_
3. **Code Examples, Data Structures & Constraints**: Include any relevant snippets of existing code, data structures, or API contracts. This gives the AI concrete examples to work with. Crucially, you must also state what _not_ to do.
   - _Example: "Use this API endpoint: `POST /api/register`. The expected JSON payload is `{ "name": "string", "email": "string", "password": "string" }`. Do NOT include a 'confirm password' field. Use Tailwind CSS for all styling."_
4. **Define a Strict Scope**: Explicitly define the boundaries of the task. Tell the AI which files it can modify and, more importantly, which files to leave untouched to prevent unintended changes across the codebase.
   - _Example: "You should only create the `RegistrationForm.js` component and add it to the `pages/register.js` file. Do NOT alter the `Navbar.js` component or any other existing page or component."_

### 3. Assembling the Master Prompt

You will now synthesize the inputs and the above principles into a final, comprehensive prompt.

1. **Gather Foundational Context (The "Onlyness")**:
   - Start the prompt describing the project purpose via the "Onlyness Statement" (Marty Neumeier). What makes this unique? The design must revolve around this uniqueness, not a generic template.
   - Define the full tech stack (e.g., Next.js, TypeScript, Tailwind CSS) and the primary UI component library.
2. **Describe the Visuals (Chris Do's Visual Engineering laws)**:
   - **Reference Mirroring:** If the user provides a specific URL or image as a layout reference, the AI MUST strictly mirror the structural skeleton and layout of that reference (especially for "out-of-the-box" specific pages) while injecting the brand's aesthetic constraints.
   - **User Asset Mapping (No Hallucinated Images):** DO NOT ask the AI generator to use Unsplash or generic placeholder data. The user will provide local photos. The prompt MUST instruct the AI to build exact bounding boxes/frames (using `img src="/placeholder-local.jpg"`) and explicitly plan *where* these user assets will fit perfectly into the visual hierarchy (e.g., Hero, Carousel, Bento Grid).
   - **MANDATORY AESTHETIC DIRECTIVES (Unless explicitly disabled by user):**
     - **Aesthetic:** High-End, Cinematic, Premium. Must perfectly match the Brand's defined Theme (Dark Mode or Light Mode). If Light Mode, aim for pristine minimal "Apple-like" aesthetics; if Dark Mode, aim for cinematic depth.
     - **Negative Space:** Demand massive padding/margins (e.g., `py-24`, `py-32` in Tailwind) to create luxury and focus. Zero clutter. The void is the focus.
     - **Typography:** Extreme contrast. Oversized, heavy headlines mixed with clean, readable body text. Maximum 2 font families. "Type is thinking made visible".
     - **Textures & Depth:** Force the use of advanced Layering (soft shadows in Light Mode, sub-pixel borders and Glassmorphism in Dark Mode). No generic flat designs.
     - **The Swiss Grid:** Demand perfect mathematical alignment (12 column grid strictly followed).
3. **Build the Prompt using the Structured Framework**:
   - Follow the four-part framework from Section 2 to build out the core request.
   - EXPLICITLY forbid the AI generator (v0, Lovable, etc.) from hallucinating generic placeholder components. Force it to focus on layout tension, typographical presentation, and mitigating client risk through perceived high value.
   - **DYNAMIC COPY-TO-UI MAPPING:** You MUST dynamically map EVERY section provided by the `@copy_chief` into a corresponding High-End Visual Archetype. Do NOT hardcode the number of sections; instead, adapt the UI exactly to the copy's length and intent using these strict aesthetic rules:
     - **Hero / Hooks:** Full screen height (100vh), extreme contrast. The *Onlyness Statement* lives here.
     - **Agitation / Problem:** Asymmetric layouts, harsh typography, visual representation of pain. Break the standard grid to create visual tension.
     - **Mechanism / Process:** Glowing bento grids, high-end data visualization, or strict 3-column architectural sequences.
     - **Comparisons (The Gap):** Side-by-side or alternating dual-layout (Status Quo vs. The New Premium World).
     - **Social Proof / Clients:** Minimalist testimonial cards or brand logos in grayscale with low opacity. Zero clutter. Focus on whitespace.
     - **Forms & Lead Capture:** High-end floating glassmorphism cards. Inputs MUST have generous padding (`p-4` or `p-5`), subtle sub-pixel borders, and glowing `ring` focus states. Avoid cheap-looking default inputs. Use micro-interactions (e.g., floating labels, sleek submit buttons).
     - **Offers / Pricing / Final CTA:** High-urgency, extreme value presentation. Use a contrasting background color (e.g., a deep brand metallic or neon accent) to aggressively isolate this section from the rest of the dark page.
     - **FAQ / Accordions:** Minimalist thin borders, expand/collapse with smooth transitions and high typographical contrast for questions.
   - **MOTION PHYSICS & MICRO-INTERACTIONS:** Force the AI generator to include scroll-triggered animations (fade-up, slide-in) and hover states (e.g., Framer Motion or Tailwind `animate-in` with intersection observers). Nothing should "instantly snap" on scroll; the page must feel alive and high-end.
   - **MOBILE ANTI-STACKING:** Prohibit lazy `flex-col` stacking on mobile. Decorative components must disappear on small screens. Overflowing grids (e.g., 4 testimonials or a multi-box mechanism) MUST become horizontal swipe carousels on mobile to avoid 10-mile vertical scrolls while maintaining the CTA static and visible.
4. **Present and Refine**:
   - Output the complete, generated prompt in a clear, copy-pasteable format (e.g., a large code block).
   - Explain the structure of the prompt and why certain information was included, referencing the Visual Engineering principles.
   - <important_note>Conclude by reminding the user that all AI-generated code will require careful human review, testing, and refinement to be considered production-ready.</important_note>
 