# Design System Template (Sales Page Professional)

## 1. Tokens
### Colors
- --color-primary:
- --color-primary-contrast:
- --color-secondary:
- --color-accent:
- --color-bg:
- --color-surface:
- --color-text:
- --color-muted:
- --color-success:
- --color-danger:

### Typography
- --font-family-heading:
- --font-family-body: "Poppins", sans-serif
- --font-size-h1:
- --font-size-h2:
- --font-size-h3:
- --font-size-body:
- --font-size-small:
- --line-height-heading:
- --line-height-body:

### Spacing and Shape
- --space-1 .. --space-8:
- --radius-sm:
- --radius-md:
- --radius-lg:
- --shadow-sm:
- --shadow-md:

### Breakpoints
- --bp-sm:
- --bp-md:
- --bp-lg:

### Motion Tokens
- --motion-fast:
- --motion-base:
- --motion-slow:
- --ease-standard:
- --ease-emphasis:

## 2. Components
- Button (primary, secondary, ghost)
- Input / Select / Textarea
- Form block
- Section container
- Proof/Testimonial card
- FAQ item
- CTA banner
- Gallery/Carousel (required, even with placeholders)

For each component, define:
- Variants
- States (default, hover, focus, disabled, error)
- Spacing
- Accessibility notes

## 3. Conversion Rules
- Hero must keep one primary CTA above the fold.
- Every long section must end with a contextual CTA.
- Proof blocks must be visible before pricing/offer decision point.
- Mobile CTA tap area minimum 44px.
- CTA buttons should include premium interaction states (gradient shift or pulse micro-animation).
- Carousel should support navigation and smooth transitions.

## 4. Accessibility Baseline
- Contrast: WCAG AA minimum
- Visible focus style for keyboard navigation
- Form errors with explicit text + visual state
- Semantic heading order

## 5. Motion Baseline
- Entrance motion for hero and first CTA
- Scroll reveal for major sections (subtle stagger)
- Hover/focus transitions under 250ms for controls
- Respect reduced-motion preferences where possible
