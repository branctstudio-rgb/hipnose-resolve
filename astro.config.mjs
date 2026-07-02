import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://hipnoseresolve.pt',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
});
