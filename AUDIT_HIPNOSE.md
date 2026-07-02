# AUDIT_HIPNOSE.md — Fase 0 · Auditoria + Decisões Técnicas
*Hipnose Resolve — Site Premium 2026 + BRANCT CRM*
*2026-07-02 · Dev BRANCT · Estado: **aguarda validação do Felipe***

---

## 1. Sumário executivo

- **Stack recomendado:** **Astro** (site público estático, content collections) + **BRANCT CRM** (booking, membros, IA WhatsApp, email marketing) + **Supabase** (auth da área de membros, se ficar do lado do site). Detalhe na secção 3.
- **Pagamentos: viável com um único processador — e a implementação é toda do dev do CRM (decisão Felipe 02/07).** O Stripe cobre **cartão + MB WAY + Klarna (parcelamento) + Multibanco + Pix (Brasil)** numa conta PT. A secção 4 é o caderno de requisitos que entregamos ao dev do CRM; o site nunca toca em chaves/checkout — só aponta para URLs de checkout dele e expõe a API de desbloqueio de membros (6-B). PayPal fica como integração separada opcional. Ressalva séria sobre Pix/telehealth na secção 4.
- **O maior trabalho não é o site — é o booking.** O BRANCT CRM tem calendário Google, inbox IA e Stripe, mas **não tem** booking público self-service com slots reais, geração automática de Meet, permissões que escondam contactos aos terapeutas, nem área de membros. São 4 módulos novos/estendidos **do lado do CRM (outro dev)** — é o caminho crítico do projeto e precisa de um contrato de API fechado já na Fase 1 (esboço na secção 6).
- **Riscos principais:** apps Google do CRM ainda em verificação (Meet/Calendar dependem disso); dados de saúde = categoria especial RGPD no formulário de booking; restrição "telehealth" do Pix.

---

## 2. Contexto e fontes

| Fonte | Localização |
|---|---|
| Briefing da cliente (PDF "Site – O QUE PRECISO", 02/07) | `MARKETING/clients/hipnose_resolve/briefings/` |
| INDEX do cliente | `MARKETING/clients/hipnose_resolve/INDEX.md` |
| Handoff marketing → dev | `MARKETING/_shared/handoffs/PROMPT_CLAUDE_CODE_HIPNOSE_RESOLVE.md` |
| Capacidades atuais do BRANCT CRM | `BRANCT TECH/Branct_CRM_Visao_Geral_Marketing.md` |
| Padrão de site BRANCT (referência) | `Sites/sitebranct/` (HTML estático + Supabase, design system Premium Light 2026) |

Não há site atual para auditar tecnicamente em detalhe (substituição total confirmada no briefing). O domínio atual ainda não foi confirmado (pergunta em aberto ao Felipe/cliente).

---

## 3. Decisão de stack — site público

### Opções consideradas

**A) HTML estático puro (padrão sitebranct)**
Zero build, deploy FTP simples, já dominamos.
❌ Rejeitado: o Hipnose tem ~14 páginas de áreas de intervenção com estrutura idêntica, páginas por terapeuta, e **landings que a cliente quer replicar sozinha**. Em HTML puro cada página nova é copy-paste manual — exatamente o que torna o site atual dela "fraco e desatualizado". Blog SEO também sofre.

**B) Astro (estático com content collections) — ✅ RECOMENDADO**
- Output 100% estático (mesmo perfil de performance/deploy do padrão BRANCT: FTP, sem servidor).
- **Content collections** = cada área de intervenção, terapeuta e landing é um ficheiro `.md`/`.json` com frontmatter. A cliente cria uma landing nova duplicando um ficheiro de config — cumpre o requisito "replicável" sem CMS pago.
- Zero JS por defeito; islands só onde há interatividade (widget de booking, consent banner). Encaixa no budget Lighthouse ≥95 / JS <100KB.
- Estrutura multi-terapeuta e i18n PT→EN nativas (rotas por coleção).
- Blog: puxar posts do **blog do BRANCT CRM via endpoint público com API key** (já funcional em produção) em build time + webhook de rebuild ao publicar → HTML estático indexável. O snippet de embed client-side do CRM ficaria invisível para SEO; não usar como via principal.

**C) WordPress/CMS tradicional**
❌ Rejeitado: contraria o padrão BRANCT (performance, manutenção, segurança) e o CRM já é o CMS do ecossistema (blog, catálogo).

### Peças da plataforma

| Peça | Onde vive | Notas |
|---|---|---|
| Site público (home, áreas, equipa, consultas, landings, blog, legais) | **Astro estático** — repo `Sites/hipnose_resolve/` | Deploy tipo sitebranct |
| Booking (disponibilidade, slots, pagamento, confirmação) | **Widget no site → API do BRANCT CRM** | Módulo novo no CRM (secção 5/6) |
| Área de membros | **Site (Astro + Supabase)** — decisão Felipe 02/07 | Construímos tudo; pontos de ligação ao CRM prontos para o dev do CRM ligar (secção 5.5) |
| Blog (autoria) | BRANCT CRM (já existe) | Site consome via API em build |
| WhatsApp IA, email marketing, leads | BRANCT CRM (já existe) | Botão flutuante no site |

---

## 4. Validação de pagamentos (pesquisa 02/07/2026)

**Requisito da cliente:** MBWay, cartão, PayPal, Klarna (parcelamento) · cobrar EUR + BRL.

| Método | Viável? | Via | Notas |
|---|---|---|---|
| **Cartão** | ✅ | Stripe (já em produção no CRM, EUR+BRL) | Pode **apresentar preços em BRL** ao cliente brasileiro; liquidação em EUR com conversão ~1-2% |
| **MB WAY** | ✅ **nativo no Stripe** desde out/2025 | Stripe Checkout/Payment Links | Merchants PT suportados; só EUR; €0,50–€5.000; **sem pagamentos recorrentes** (só one-off); reembolsos totais/parciais OK |
| **Klarna** | ✅ | Stripe | Disponível para negócios PT; consumidores da zona euro (PT incluído); **só processa EUR**; parcelamento 3x/4x sem juros + financiamento 6–36 meses conforme perfil — cobre o requisito de parcelar programas |
| **Pix (Brasil)** | ⚠️ Viável com ressalva | Stripe (via Ebanx, cross-border) | Conta PT aceita Pix de clientes BR, liquida EUR. Cliente paga **IOF 3,5%** (ou absorvemos). Limites: US$3.000/transação, US$10.000/mês/cliente. **⚠️ Categoria proibida: "telehealth/medicine vendors"** — ver risco abaixo |
| **PayPal** | ✅ possível, **recomendo adiar** | Integração separada (não passa pelo Stripe) | Segunda integração de checkout + reconciliação dupla no CRM. Com cartão+MBWay+Klarna+Pix, o PayPal acrescenta pouco; propor à cliente como fase posterior se os dados mostrarem procura |

### Decisão proposta
**Stripe como processador único** (checkout com cartão + MB WAY + Klarna + Multibanco; Pix para o Brasil se a ressalva abaixo se resolver). Preços editáveis manualmente pela admin = produtos/preços geridos no CRM que criam Stripe Checkout Sessions dinâmicas — sem hardcode no site, cumpre o requisito "pacotes e protocolos com valores manuais".

**Responsabilidade (decisão Felipe 02/07): toda a implementação de pagamentos é do dev do CRM** — conta Stripe, checkout, webhooks, reconciliação, faturação por terapeuta. Esta secção é o caderno de requisitos que lhe entregamos. Do lado do site: botões/CTAs apontam para URLs de checkout fornecidas pelo CRM (configuráveis por programa/pacote, sem redeploy), páginas de retorno sucesso/cancelamento, e a API 6-B para ele libertar acessos de membros após pagamento. **Nenhuma chave de pagamento vive no site** — mesma filosofia do funil do trial do sitebranct (a landing nunca vê passwords; aqui, nunca vê pagamentos).

### ⚠️ Ressalva Pix/telehealth — validar antes de prometer à cliente
A documentação do Pix cross-border da Stripe exclui "telehealth/medicine vendors". Hipnoterapia não é ato médico, mas **consultas online de saúde mental podem ser classificadas como telehealth** pelo parceiro (Ebanx). Ação: contactar o suporte Stripe com a descrição exata do negócio antes de anunciar Pix. **Plano B sólido:** cartão com preço apresentado em BRL (sem restrição de categoria). O requisito "cobrar em EUR e Real" fica cumprido mesmo sem Pix.

### Consequências para o fluxo
- **Cliente brasileiro:** vê preços em BRL, paga com cartão (ou Pix se aprovado). MB WAY/Klarna/Multibanco ficam ocultos para BRL (são EUR-only) — o checkout adapta métodos à moeda.
- **Parcelamento de programas:** Klarna (EUR). Para BRL não há parcelamento nativo cross-border — comunicar à cliente que parcelado é só mercado PT/EUR por agora.
- **MB WAY sem recorrência:** pacotes pagos em prestações internas (subscription) não podem usar MB WAY — só cartão. Irrelevante para pagamentos one-off.

Fontes: [Stripe MB WAY docs](https://docs.stripe.com/payments/mb-way) · [changelog MB WAY out/2025](https://docs.stripe.com/changelog/clover/2025-10-29/mb-way-payment-link-checkout-sessions) · [Klarna Portugal — comerciantes](https://www.klarna.com/pt/empresa/) · [Klarna on Stripe](https://stripe.com/payments/klarna) · [Stripe supported currencies](https://docs.stripe.com/currencies) · [Stripe Pix docs](https://docs.stripe.com/payments/pix) · [presentment vs settlement](https://stripe.com/resources/more/presentment-currency-and-settlement-currency-explained-what-every-business-needs-to-know)

---

## 5. BRANCT CRM — o que existe vs. o que falta

Base: `Branct_CRM_Visao_Geral_Marketing.md`. O CRM é de **outro dev/outro repo** — tudo o que está em "CRM: novo/estender" é trabalho a coordenar com ele, não deste repo.

### ✅ Já existe (usar tal como está)
| Capacidade | Estado |
|---|---|
| Inbox IA (WhatsApp Meta Cloud API, email Resend, SMS Twilio) + base de conhecimento + sequências | Funcional; WABA em verificação Meta para escala |
| Google Calendar (sync nativo, eventos, participantes) | Funcional; **app Google em modo de teste, em verificação** |
| Stripe EUR + BRL | Produção |
| Campanhas email/SMS/WhatsApp com merge tags | Funcional |
| Blog com endpoint público + API key | Produção |
| Leads, pipeline, tarefas, financeiro (EUR/BRL), roles Owner/Admin/Member com permissões por menu | Funcional |
| Multi-idioma PT-PT/EN/ES/IT/HR, multi-moeda | Funcional |

### 🔧 Falta (gap analysis — caminho crítico do projeto)

**5.1 Booking público self-service — NOVO (CRM) + widget (site)**
O CRM tem calendário interno mas nenhum fluxo público de marcação. Necessário: motor de disponibilidade por terapeuta (horários de trabalho − eventos Google − buffers), tipos de consulta (Avaliação 2h / Tratamento 1h), online/presencial, criação de evento + pagamento + confirmação. É o requisito nº 1 da cliente ("detesta formulário que não marca nada").

**5.2 Google Meet automático — ESTENDER (CRM)**
A integração Calendar já cria eventos; falta criar com `conferenceData` (Meet) quando online e incluir o link na confirmação/lembretes. Tecnicamente simples, **mas bloqueado pela verificação Google OAuth do CRM** — sem app verificada não há Meet em produção.

**5.3 Permissões por papel com ocultação de campos — NOVO (CRM)**
Requisito de privacidade da cliente: terapeuta vê agenda + nome, **nunca telefone/email**. O CRM tem permissões por menu, não por campo. Necessário papel "Terapeuta" com redação de contactos em TODAS as superfícies (ficha de lead, evento de calendário, inbox, exports, notificações). É também boa prática RGPD (minimização) e argumento de venda do BRANCT CRM para qualquer clínica.

**5.4 Faturação por terapeuta — ESTENDER (CRM)**
O financeiro existe; falta atribuir cada consulta paga ao terapeuta (via booking) e um relatório mensal por terapeuta. Deriva quase de graça do módulo 5.1 se o booking gravar `therapist_id` na transação.

**5.5 Área de membros — NOVO (site) · DECIDIDO Felipe 02/07: construímos no site, CRM liga-se depois**
A área de membros vive no site (Supabase próprio do cliente — isolamento por cliente, não reutilizar o projeto do sitebranct):
- **Auth:** Supabase Auth (email + password, com magic link como recuperação). Identidade partilhada com o CRM **pelo email** (member no site ↔ lead no CRM).
- **Dados (Postgres + RLS):** `programs` (magramente, set-you-free, transforma-te) · `entitlements` (user × programa, com `source`: stripe/manual/crm) · `materials` (áudios, ebooks, receitas → Storage privado, servido por signed URLs curtas; nada de links públicos tipo Drive).
- **Desbloqueio:** após pagamento confirmado (lado CRM), o dev do CRM chama `POST /api/crm/entitlements` (6-B) → Edge Function cria o utilizador (convite por email) + entitlement + email de boas-vindas. O site não processa pagamentos (decisão Felipe 02/07) — apenas recebe a ordem de desbloqueio autenticada por API key.
- **Pontos de ligação prontos para o dev do CRM** (contrato na secção 6-B): tudo o que o CRM precisa para ver e gerir membros fica exposto e documentado desde o dia 1 — o CRM liga quando o outro dev estiver pronto, sem retrabalho no site.

**5.6 Lembretes de consulta — ESTENDER (CRM)**
As sequências da IA existem; falta gatilho ligado ao booking (ex.: lembrete 24h + 2h antes, com link Meet). Reduz no-shows 25-40% (pesquisa do marketing).

---

## 6. Contratos de integração com o BRANCT CRM

### 6-A. API booking (esboço para fechar na Fase 1 com o dev do CRM)

```
GET  /public/v1/therapists?area=ansiedade          → terapeutas da área (nome, foto, bio curta, línguas, cor)
GET  /public/v1/availability?therapist_id=&type=avaliacao|tratamento&mode=online|presencial&from=&to=
                                                   → slots reais (working hours − Google Calendar − buffers)
POST /public/v1/bookings                           → { therapist_id, type, mode, slot, nome, telefone, email, consent }
                                                   → cria hold do slot + Stripe Checkout Session → { checkout_url }
Webhook Stripe checkout.session.completed          → confirma booking, cria evento Google (+Meet se online),
                                                     envia confirmação (email/WhatsApp), agenda lembretes,
                                                     regista faturação por terapeuta
GET  /public/v1/bookings/:id/status                → polling da página de confirmação
```
- Slot hold com TTL (ex.: 15 min) para evitar double-booking durante o checkout.
- CORS restrito ao domínio do site; rate limiting; sem dados de saúde no payload além da área escolhida (ver secção 7).
- Widget no site = ilha Astro, mobile-first, mínimo de campos (nome, telemóvel, email), testemunhos ao lado.

### 6-B. Área de membros → CRM (construímos já; o dev do CRM liga quando quiser)

O site é a fonte de verdade dos membros/entitlements. Deixamos 3 pontos de ligação prontos e documentados:

```
1. EVENTOS DE SAÍDA (site → CRM) — Edge Function emite para URL configurável (env CRM_WEBHOOK_URL):
   member.created      { email, nome, created_at }
   entitlement.granted { email, program_id, source, amount, currency }   ← compra de programa
   entitlement.revoked { email, program_id, reason }
   (sem CRM_WEBHOOK_URL definida, os eventos ficam registados na tabela `events_outbox` — o CRM
    pode fazer replay quando ligar; nada se perde)

2. API DE GESTÃO (CRM → site) — endpoints com API key (env CRM_API_KEY). É por aqui que o dev do
   CRM liberta acessos após QUALQUER pagamento (checkout online ou venda manual da Marta):
   POST   /api/crm/entitlements        → conceder programa (caminho principal pós-pagamento)
   DELETE /api/crm/entitlements        → revogar (reembolso, chargeback)
   GET    /api/crm/members?email=      → estado do membro + programas ativos

3. IDENTIDADE — chave de junção é o email (member no site ↔ lead no CRM). Sem IDs partilhados
   nem dependência de schema entre sistemas.
```

Regra: **o site nunca chama o CRM de forma síncrona** — se o CRM estiver offline ou ainda não ligado, a área de membros funciona a 100%. A ligação é aditiva.

### 6-C. Divisão de responsabilidades site ↔ CRM (fechada com o Felipe, 02/07)

| Responsabilidade | Site (nós) | CRM (outro dev) |
|---|:-:|:-:|
| Páginas públicas, landings, blog (render), SEO, performance | ✅ | |
| Área de membros: auth, conteúdos, entitlements, API 6-B | ✅ | liga-se depois |
| Widget de booking (UI mobile-first no site) | ✅ | |
| Motor de booking: disponibilidade, slots, Meet, lembretes | | ✅ |
| **Pagamentos (tudo): Stripe, checkout, webhooks, métodos, EUR/BRL** | | ✅ |
| Faturação por terapeuta | | ✅ |
| Desbloqueio de programas pós-pagamento | expõe API 6-B | chama API 6-B |
| CTAs de compra | apontam para checkout URLs do CRM (configuráveis) | fornece as URLs |
| Papel "Terapeuta" (privacidade contactos) | | ✅ |
| IA WhatsApp, email marketing, leads | botão/embed | ✅ |
| Consent RGPD, disclaimers, legais | ✅ | |

---

## 7. Compliance RGPD + saúde (inegociável)

- **A escolha da área ("Depressão", "Vícios"…) associada a nome/contacto é dado de categoria especial (art. 9º RGPD).** Consequências: consentimento explícito no booking, TLS + encriptação at rest, acesso mínimo (reforça 5.3), retenção definida, e a área NÃO entra em emails de marketing sem consentimento separado.
- Consent gate antes de qualquer pixel/analytics (padrão já estabelecido no sitebranct — reutilizar a mecânica).
- Disclaimers em todas as páginas de área: hipnoterapia não substitui diagnóstico/tratamento médico; sem promessas de cura. Testemunhos só com consentimento documentado.
- Livro de reclamações eletrónico no rodapé (obrigatório PT) + política de privacidade + termos dos programas digitais (direito de livre resolução em conteúdos digitais — informar renúncia no checkout).
- schema.org: MedicalBusiness/LocalBusiness + Person por terapeuta + FAQPage + Product (programas).

---

## 8. Riscos e dependências

| # | Risco/Dependência | Impacto | Mitigação |
|---|---|---|---|
| 1 | **Verificação Google OAuth do CRM pendente** | Bloqueia Meet automático + sync Calendar em produção | Dev do CRM iniciar/acelerar verificação JÁ (semanas de prazo); é pré-requisito do booking |
| 2 | **Booking = módulo novo no CRM (outro dev)** | Caminho crítico; sem ele o site entrega "formulário que não marca nada" | Fechar contrato de API (secção 6) na Fase 1; desenvolvimento paralelo site/CRM |
| 3 | Pix × categoria telehealth | Perder Pix para o Brasil | Validar com Stripe; plano B: cartão em BRL (já cobre o requisito) |
| 4 | Verificação Meta do WABA pendente | IA WhatsApp limitada em escala | Já em curso; não bloqueia lançamento (botão WhatsApp funciona) |
| 5 | Assets em falta (logo, fotos, vídeo instalações, preços, textos) | Bloqueia Fase 2 em diante | Lista de pedidos na nota de handoff ao marketing |
| 6 | Dados de saúde no booking | Risco legal RGPD | Secção 7 aplicada desde o design; rever com a cliente |

---

## 9. Perguntas em aberto (Felipe/cliente)

1. ~~Área de membros: CRM ou site?~~ **DECIDIDO 02/07 (Felipe): no site; construímos tudo e o dev do CRM liga depois via contrato 6-B.**
2. Logo e identidade existem ou criamos? Fotos profissionais da Marta/instalações (o hero com vídeo depende disto)?
3. Domínio atual: qual é, mantemos ou registamos novo? (afeta SEO desde já)
4. Preços de consultas, pacotes e dos 3 programas.
5. Confirmar com a cliente: "agenda Zappy" do PDF é substituída pelo BRANCT CRM.
6. Certificações/cédula da Marta para rodapé + página de equipa (compliance).
7. PayPal: aceita adiar para fase posterior dado que Stripe cobre cartão+MBWay+Klarna(+Pix)?

---

## 10. Próximos passos (Fase 1, após validação deste documento)

1. Design system: tokens (paleta calma quente, serif editorial + sans, spacing, sombras) + styleguide — a validar com Felipe/cliente.
2. Fechar contrato de API do booking com o dev do CRM (secção 6) e arrancar o módulo em paralelo.
3. Dev do CRM: iniciar verificação Google OAuth (risco #1) e papel "Terapeuta" (5.3).
4. Scaffold Astro do repo `Sites/hipnose_resolve/` com content collections (áreas, terapeutas, landings).
