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

## Estado (02/07/2026 — demo para 1ª apresentação à cliente)

- ✅ Design system "Clínica Premium Editorial 2026" (`src/styles/global.css` — tokens documentados)
- ✅ Home completa: hero (arco que respira), fita de áreas, empatia, 14 áreas, consultas/como funciona
  + fluxo de marcação (mock), equipa (Marta), 3 programas, testemunhos, FAQ, CTA final, footer legal
- ⚠️ **Só para apresentação interna:** testemunhos são fictícios (nunca publicar sem consentimento
  real); visuais em arco são placeholders para fotografia real; preços ainda não incluídos;
  número de WhatsApp é placeholder
- ⏳ Próximo (após validação da cliente): páginas por área, landings template, área de membros,
  widget de booking (API BRANCT CRM), i18n EN, schema.org, consent RGPD
