import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://geeksea.dev',
  
  integrations: [
    tailwind(),
    sitemap(),
    mdx()
  ],
  
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      langs: ['javascript', 'typescript', 'bash', 'python', 'nginx'],
    },
  },
  
  i18n: {
    defaultLocale: 'zh-TW',
    locales: ['zh-TW', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  
  output: 'static',
  
  vite: {
    build: {
      cssMinify: 'lightningcss',
    },
  },
});
