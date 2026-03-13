# Deploy

> Task ID: deploy
> Agent: Uma (UX-Design-Expert) | Gage (DevOps)
> Version: 1.0.0

## Purpose

Deploy the current project to its configured hosting platform.
Reads deploy config from `project-manifest.yaml` or `.state.yaml`.
Runs build validation before deploying.

---

## PRE-CONDITION

Check `.state.yaml` for `deploy.platform`. If null, ask:

```
🚀 DEPLOY — Configuração necessária:

1. Plataforma: [cloudflare-pages | vercel | netlify | outro]
2. Domínio/projeto na plataforma: [ex: aiosbks.pages.dev, alpha-lp]
3. Comando de build: [padrão: npm run build]
4. Diretório de output: [padrão: dist]
```

---

## Execution

### STEP 1 — Load Deploy Config

Read from `project-manifest.yaml`:
```yaml
deploy:
  platform: cloudflare-pages
  domain: "{domain}"
  build_command: npm run build
  output_dir: dist
```

If manifest not found, use `.state.yaml` deploy section.

---

### STEP 2 — Pre-Deploy Validation

Run these checks before deploying:

```
[ ] Build command exists in package.json
[ ] No TypeScript errors (if tsx project)
[ ] No broken imports (check for missing files referenced in pages created this session)
[ ] Environment variables documented in .env.example
[ ] .gitignore includes: .state.yaml, node_modules, dist
```

If any check fails: **block deploy, report exact issue**.

---

### STEP 3 — Build

```bash
npm run build
```

On build failure:
- Show the error
- Suggest fix (missing import, wrong path, etc.)
- Do NOT proceed to deploy

---

### STEP 4 — Deploy by Platform

#### Cloudflare Pages
```bash
# Via Wrangler CLI
npx wrangler pages deploy {output_dir} --project-name={project-name}

# OR via git push (if repo is connected)
git push origin main
# Then: monitor at dash.cloudflare.com
```

#### Vercel
```bash
npx vercel --prod
# Confirm project name and domain when prompted
```

#### Netlify
```bash
npx netlify deploy --prod --dir={output_dir}
```

#### Manual / Other
```
📦 Build gerado em: ./{output_dir}/
Upload manual necessário para: {platform}
```

---

### STEP 5 — Post-Deploy Report

```
╔══════════════════════════════════════════════╗
║  DEPLOY CONCLUÍDO                            ║
╠══════════════════════════════════════════════╣
║ Projeto .......... {project.name}            ║
║ Plataforma ....... {deploy.platform}         ║
║ URL .............. {deploy.domain}           ║
║ Build ............ ✅ sucesso                ║
║ Deploy ........... ✅ publicado              ║
╠══════════════════════════════════════════════╣
║ PRÓXIMOS PASSOS                              ║
║  • Testar URL em dispositivo mobile          ║
║  • Verificar meta tags (og:image, title)     ║
║  • Confirmar analytics/pixel carregando      ║
╚══════════════════════════════════════════════╝
```

---

## Platform Notes

| Platform | Auth required | CLI tool |
|----------|--------------|----------|
| Cloudflare Pages | `wrangler login` | `npx wrangler` |
| Vercel | `vercel login` | `npx vercel` |
| Netlify | `netlify login` | `npx netlify` |

If not authenticated, show auth command before proceeding.

---

## Git Push Before Deploy

If platform is git-connected (Cloudflare Pages auto-deploy on push):

```
Este projeto usa deploy automático via git push.
Delegar push para @devops:

  @devops *push
```

**Uma (UX) does not git push. Delegate to @devops.**
