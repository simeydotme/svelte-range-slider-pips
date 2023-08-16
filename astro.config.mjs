import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
// import preact from '@astrojs/preact';
// import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import minifier from 'astro-html-minifier';
import expressiveCode from "astro-expressive-code";

import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), mdx(), minifier(), sitemap()],
  base: `/`,
  site: `https://advanced-astro.dev`,
  vite: {
    server: {
      watch: {
        usePolling: true
      }
    }
  }
});