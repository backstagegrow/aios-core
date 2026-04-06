# Design System: AIOS Agent Briefing Center

## 1. Visual Theme & Atmosphere
A "Cinematic Cockpit" interface. The mood is high-agency, technical, and executive. It features heavy use of **Dark Glassmorphism** (frosted surfaces with sharp 1px borders) over a charcoal void. Layouts are **Offset Asymmetric**, prioritizing information hierarchy over grid symmetry. The atmosphere feels like a high-end mission control center — precise, efficient, and sophisticated.

## 2. Color Palette & Roles
- **Obsidian Deep** (#0A0A0A) — Primary viewport background
- **Zinc Surface** (#151515) — Base level cards and containers
- **Backgrow Lime** (#84CC16) — Singular accent for primary CTAs, active status indicators, and focus rings. (Max 80% saturation)
- **Titanium White** (#FFFFFF) — Primary executive text
- **Muted Zinc** (#A1A1AA) — Secondary labels, metadata, and placeholder text
- **Glass Border** (rgba(255, 255, 255, 0.08)) — 1px structural separators and card outlines
- **Lime Glow** (rgba(132, 204, 22, 0.15)) — Subtle surface illumination for active agents

## 3. Typography Rules
- **Display:** **Satoshi** — Track-tight, bold weight for section heads. Executive presence without being loud.
- **Body:** **Geist** — Precise leading, optimized for scanning agent logs and briefing details.
- **Mono:** **JetBrains Mono** — For token counts, IDs, and raw agent thought streams. Mandatory for all numerical data.
- **Banned:** Inter, Comic Sans, generic system fonts, and any serif face.

## 4. Component Stylings
- **Buttons:** Sharp corners (8px). Solid Backgrow Lime for primary actions with black text. Ghost style with 1px Glass Border for secondary. Tactile -1px vertical translate on press.
- **Cards:** Flat appearance with elevation communicated via 1px Glass Border. Inner padding is generous (2rem). No drop shadows, only inner glows for active states.
- **Agent Avatars:** Hexagonal or square with soft corners (20px). Sharp contrast borders.
- **Briefing Inputs:** Monospace text. Labels positioned strictly top-left. Whisper-thin focus rings in Lime.
- **Status Indicators:** Pulsing micro-motion infills for "Running" agents. Static Zinc for "Idle".

## 5. Layout Principles
Grid-first hierarchy using a 12-column Swiss System. Large headers are left-aligned with asymmetric whitespace to the right. Content sections use a **Zig-Zag** flow. Desktop layouts feature a fixed side-panel for "Active Squad Stats". Mobile view collapses to a single continuous stream with 44px minimum tap targets.

## 6. Motion & Interaction
Spring physics for all transitions (`stiffness: 100, damping: 20`). Perpetual micro-shimmer on Agent Capability cards. Orchestrated cascade reveals for log entries (100ms stagger). Animations must use hardware-accelerated `transform` and `opacity` only.

## 7. Anti-Patterns (Banned)
- **NO** emojis.
- **NO** "Inter" font.
- **NO** Pure Black (#000000).
- **NO** Rounded pill-shaped buttons (except for specific status chips).
- **NO** standard AI clichés: "Elevate your workflow", "Seamless integration".
- **NO** 3-column equal cards. Use 2+1 or 1+3 asymmetric splits.
- **NO** invented data: Use `[agent_output]` or `[squad_latency]` labels if real data is missing.
