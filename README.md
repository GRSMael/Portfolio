# Portfolio — Maël Grosa

Site vitrine freelance de Maël Grosa, concepteur web à Marseille : création de sites internet sur-mesure et accompagnement en marketing digital (SEO local, Google Ads, Social Ads).

**Site en ligne :** https://portfolio-kohl-eight-63.vercel.app

## Stack technique

- HTML statique
- Tailwind CSS
- JavaScript vanilla
- Déployé sur Vercel

Le build minifie CSS et JS (lightningcss, terser) et optimise les images (sharp).

## Pages principales

- `index.html` — accueil
- `about.html` — présentation
- `tarifs.html` / `prix-site-vitrine.html` — offres et tarifs
- `devis.html` — demande de devis
- `blog.html` — articles
- `mentions-legales.html` — mentions légales
- Pages SEO : `creation-site-internet-marseille.html`, `creation-web.html`, `seo-local-marseille.html`, `marketing-digital.html`, `freelance-ou-agence.html`, `informatique.html`

## Développement local

Prérequis : Node.js >= 20 (pnpm recommandé).

```bash
# Serveur de développement local (port 3000)
pnpm run dev

# Build de production (CSS/JS minifiés + images optimisées)
pnpm run build
```
