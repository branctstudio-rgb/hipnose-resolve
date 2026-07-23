/* ============================================================
   CONFIGURAÇÃO CENTRAL — Hipnose Resolve
   Fonte única de verdade para contactos, ambiente e feature flags.
   Alterar aqui propaga para todo o site.
   ============================================================ */

export const siteConfig = {
  siteName: 'Hipnose Resolve',
  tagline: 'Clínica de Reprogramação Mental',
  productionUrl: 'https://hipnoseresolve.pt',
  previewBasePath: '/hipnose-resolve/',
  /* 'preview' | 'production' — em preview o site fica noindex.
     O workflow do GitHub Pages injeta PUBLIC_NOINDEX=1; este campo
     documenta a intenção e serve de fallback. */
  environment: 'preview' as 'preview' | 'production',
  allowIndexing: false,
};

export const contactConfig = {
  phone: '+351915574759',
  phoneDisplay: '+351 915 574 759',
  whatsapp: '+351915574759',
  whatsappMessage:
    'Olá! Gostaria de saber mais sobre as consultas da Hipnose Resolve e marcar uma avaliação.',
  /* PENDENTE DE CONFIRMAÇÃO PELA CLIENTE — ver relatório de pendências.
     Até lá os componentes mantêm os emails onde já estavam. */
  generalEmail: 'info@hipnoseresolve.pt', // PENDENTE confirmar
  bookingEmail: 'marcacoes@hipnoseresolve.pt', // PENDENTE confirmar
  privacyEmail: 'info@hipnoseresolve.pt', // PENDENTE confirmar
  address: {
    street: 'Rua Dr. Álvaro Monteiro, 12 R/C dto.',
    postalCode: '3510-014',
    city: 'Viseu',
    country: 'Portugal',
  },
  instagram: 'https://www.instagram.com/hipnoseresolve/',
  facebook: 'https://www.facebook.com/profile.php?id=61555999870032',
};

/* URL única do WhatsApp com mensagem pré-preenchida corretamente codificada */
export const WA_URL = `https://wa.me/${contactConfig.whatsapp.replace('+', '')}?text=${encodeURIComponent(contactConfig.whatsappMessage)}`;

export const featureFlags = {
  newsletterEnabled: false, // sem integração real — não renderizar
  membersAreaEnabled: false, // sem backend — página vira "em preparação"
  legalDocsValidated: false, // políticas em rascunho — noindex + aviso
  bookingSystemEnabled: false, // marcação automática ainda não existe (CRM)
};

export const brandingConfig = {
  developerName: 'BRANCT Studio',
  developerUrl: 'https://branct.com',
};
