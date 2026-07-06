# Hipnose Resolve — Site Premium 2026

Site público em **Astro** (estático). Ver `AUDIT_HIPNOSE.md` para decisões técnicas e divisão site ↔ BRANCT CRM.

## Apresentar / desenvolver

```
npm install        # primeira vez
npm run dev        # abre em http://localhost:4321
```

Para apresentação sem dev toolbar (recomendado com cliente):

```
npm run build
npm run preview    # http://localhost:4321 — versão limpa de produção
```

## Estado (02/07/2026 — site completo para 1ª apresentação à cliente · 31 páginas)

- ✅ Design system "Clínica Premium Editorial 2026" (`src/styles/global.css` — tokens documentados)
- ✅ Home completa (hero que respira, 14 áreas, consultas, equipa, programas, testemunhos, FAQ)
- ✅ **Áreas de Intervenção**: hub + 14 páginas individuais (SEO local) com cross-sell consulta/programa
- ✅ **Consultas**: Avaliação 2h vs Tratamento 1h, online/presencial, fluxo de marcação (mock)
- ✅ **Equipa**: hub multi-terapeuta (Marta + 3 "em breve") + página individual da Marta
- ✅ **Programas**: hub + 3 landings (MagraMente, Set You Free, TRANSFORMA-TE) geradas pelo
  TEMPLATE REPLICÁVEL — nova landing = novo .md em `src/data/programas/`
- ✅ **Blog**: listagem + 3 artigos exemplo com cross-sell no fim (na fase final liga ao BRANCT CRM)
- ✅ **Área de Membros**: página de login (UI; auth real com Supabase na próxima fase)
- ✅ Contactos, Política de Privacidade e Termos (versões de trabalho), menu mobile
- ⚠️ **Só para apresentação interna:** testemunhos e artigos são exemplo (nunca publicar sem
  consentimento/revisão); visuais em arco são placeholders para fotografia real; preços "sob
  consulta"; WhatsApp/email/redes são placeholders; legais precisam de validação jurídica
- ✅ SEO técnico: sitemap (@astrojs/sitemap) + robots.txt, schema.org (MedicalBusiness+FAQPage
  na home, Service+Breadcrumb nas áreas, Person na equipa, Product+FAQPage nos programas,
  BlogPosting no blog), canonical + OG completo, favicon, página 404.
  Peso: home 19KB HTML, 0KB de JS bundle — budget Lighthouse folgado.
- ⏳ Próximo: booking real (API BRANCT CRM), auth membros (Supabase), checkout (dev CRM),
  i18n EN, consent banner RGPD (quando houver pixel/analytics), fotos reais + performance pass final

## Vídeo-tour no hero

O hero da Home é um slideshow cinematográfico (Ken Burns) com as fotos reais.
Quando o vídeo-tour da clínica existir, basta guardá-lo em
`src/assets/video/hero-tour.mp4` (H.264, ~10-20s, sem som, <8MB) e fazer build —
o hero passa a vídeo automaticamente, sem tocar em código.

## Conteúdo editável pela cliente (sem tocar em código)

- Áreas: `src/data/areas.json` · Equipa: `src/data/terapeutas.json`
- Landings: `src/data/programas/*.md` (duplicar um ficheiro = nova landing)
- Blog: `src/data/blog/*.md`
