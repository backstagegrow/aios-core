# Landing UI Kit — Imersão "O Caminho do Dono"

Sales landing page for the **Alpha Business Academy** flagship 3-day immersion led by Lucas Silva. Single-page, dark/luxury treatment, 12-pillar program, applicant form.

## Files
- `index.html` — entry point, mounts the full landing.
- `landing.css` — page-specific helpers layered on the global `colors_and_type.css`.
- `Nav.jsx` — fixed transparent nav, blurs+darkens on scroll.
- `Hero.jsx` — eyebrow + display headline + CTA pair + before/after editorial photo + 3 stats.
- `Pillars.jsx` — 12-card grid (3×4) with engraved roman numerals.
- `Mentor.jsx` — Lucas Silva spotlight with pull-quote + stats.
- `Testimonials.jsx` — 3-up student results.
- `Manifesto.jsx` — single full-bleed manifesto line + Footer.
- `Inscricao.jsx` — application form (name / WhatsApp / email / faturamento / segmento).
- `StickyCTA.jsx` — sticky bottom bar revealed after 800px scroll.

## Status & caveats
- 12 pillar names are **plausible, not canonical**. Replace with the real titles from the Imersão program.
- `R$ 2B+`, `+500 donos`, `48 vagas`, `23 de Maio`, `Edição I 2026`, contact numbers — all **placeholders**.
- Testimonial videos missing from filesystem (only Vinícius's mp4 came through). Currently shown as text quotes; trivial to swap to inline video players when files arrive.
- Logo is PNG-only. SVG variant pending from brand team.
