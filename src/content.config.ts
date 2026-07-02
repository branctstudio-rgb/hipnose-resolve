import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

/* Áreas de intervenção — a Marta edita/acrescenta em src/data/areas.json */
const areas = defineCollection({
  loader: file('./src/data/areas.json'),
  schema: z.object({
    id: z.string(),
    nome: z.string(),
    curto: z.string(),          // frase do card
    dor: z.array(z.string()),   // o problema em linguagem humana
    ajuda: z.array(z.string()), // como a hipnoterapia ajuda
    sinais: z.array(z.string()),
    terapeuta: z.string(),      // id em terapeutas.json
    programa: z.string().nullable(), // id de programa relacionado (cross-sell)
    ordem: z.number(),
  }),
});

/* Equipa — multi-terapeuta desde o dia 1 */
const terapeutas = defineCollection({
  loader: file('./src/data/terapeutas.json'),
  schema: z.object({
    id: z.string(),
    nome: z.string(),
    papel: z.string(),
    estado: z.enum(['ativa', 'breve']),
    bio: z.string(),
    frase: z.string().optional(),
    especialidades: z.array(z.string()),
    linguas: z.array(z.string()),
    formacao: z.array(z.string()).optional(),
  }),
});

/* Programas / landings de transformação — TEMPLATE REPLICÁVEL:
   nova landing = novo ficheiro .md em src/data/programas/ */
const programas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/programas' }),
  schema: z.object({
    nome: z.string(),
    kicker: z.string(),
    promessa: z.string(),
    sub: z.string(),
    dor: z.array(z.string()),
    metodo: z.array(z.object({ titulo: z.string(), txt: z.string() })),
    conteudo: z.array(z.string()),
    testemunho: z.object({ txt: z.string(), autor: z.string() }),
    tiers: z.array(z.object({ nome: z.string(), detalhe: z.string(), ideal: z.string() })).optional(),
    preco: z.object({ valor: z.string(), nota: z.string() }),
    faq: z.array(z.object({ q: z.string(), a: z.string() })),
    area: z.string(),           // id da área relacionada (cross-sell)
    comprarOnline: z.boolean(), // true = programa digital vendido no site
    ordem: z.number(),
  }),
});

/* Blog — motor de SEO (na fase final passa a vir do BRANCT CRM via API) */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/blog' }),
  schema: z.object({
    titulo: z.string(),
    resumo: z.string(),
    data: z.string(),
    categoria: z.string(),
    areaRelacionada: z.string().nullable(),
  }),
});

export const collections = { areas, terapeutas, programas, blog };
