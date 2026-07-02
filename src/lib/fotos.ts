import type { ImageMetadata } from 'astro';

/* Fotos reais vindas do site atual da Hipnose Resolve (WordPress).
   Para trocar a foto de uma área basta alterar o nome do ficheiro aqui. */
const ficheiros = import.meta.glob<{ default: ImageMetadata }>('../assets/img/*', { eager: true });

export const fotoPorArea: Record<string, string> = {
  'emagrecimento': 'magramente-1.jpg',
  'cessacao-tabagica': 'tabaco.jpeg',
  'fertilidade-parto-pos-parto': 'fertilidade.jpg',
  'ansiedade-panico': 'ansiedade.png',
  'medos-fobias': 'medos.jpg',
  'depressao': 'depressao.webp',
  'stress-burnout': 'stress.webp',
  'relacionamentos-sexualidade': 'relacionamentos.jpg',
};

export const fotoPorPrograma: Record<string, string> = {
  'magramente': 'magramente-1.jpg',
  'set-you-free': 'tabaco.jpeg',
  'transforma-te': 'marta.jpeg',
};

function resolve(nome: string | undefined): ImageMetadata | null {
  if (!nome) return null;
  return ficheiros[`../assets/img/${nome}`]?.default ?? null;
}

export const fotoDeArea = (id: string) => resolve(fotoPorArea[id]);
export const fotoDePrograma = (id: string) => resolve(fotoPorPrograma[id]);
export const foto = (nome: string) => resolve(nome);
