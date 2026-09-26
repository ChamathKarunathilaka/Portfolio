import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { portfolio } from './src/data/portfolio.js';

// Include editable metadata in the built HTML, even before JavaScript runs.
const escapeHtml = value => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
export default defineConfig({ plugins: [react(), tailwindcss(), {
  name: 'portfolio-metadata',
  transformIndexHtml(html) {
    const title = `${portfolio.name} · ${portfolio.role}`;
    return {
      html: html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`),
      tags: [
        { tag: 'meta', attrs: { name: 'description', content: portfolio.summary }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:title', content: title }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:description', content: portfolio.summary }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:type', content: 'website' }, injectTo: 'head' },
      ],
    };
  },
}] });
