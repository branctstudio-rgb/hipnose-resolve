/* Prefixa os links internos root-relative do dist/ com o base path (deploy de teste
   em subdiretório, ex. GitHub Pages projeto). Em produção (base '/') não é usado. */
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const BASE = (process.env.PUBLIC_BASE || '').replace(/\/$/, '');
if (!BASE) {
  console.log('PUBLIC_BASE vazio — nada a prefixar.');
  process.exit(0);
}

const escaped = BASE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// href="/x", src="/x" ou poster="/x" que ainda não comecem pelo base nem sejam "//"
const re = new RegExp(`(href|src|poster)="/(?!/)(?!${escaped.slice(1)}[/"])`, 'g');

let tocados = 0;
function walk(dir) {
  for (const nome of readdirSync(dir)) {
    const p = join(dir, nome);
    if (statSync(p).isDirectory()) walk(p);
    else if (nome.endsWith('.html') || nome.endsWith('.xml')) {
      const antes = readFileSync(p, 'utf8');
      const depois = antes.replace(re, `$1="${BASE}/`);
      if (depois !== antes) { writeFileSync(p, depois); tocados++; }
    }
  }
}
walk('dist');
console.log(`prefix-links: ${tocados} ficheiros prefixados com ${BASE}`);
