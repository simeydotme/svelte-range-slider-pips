import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
// import preact from '@astrojs/preact';
// import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';

import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), mdx(), sitemap()],
  base: `/svelte-range-slider-pips/`,
  site: `https://simeydotme.github.io`,
  outDir: `./dist`,
  vite: {
    server: {
      watch: {
        usePolling: true,
      },
    },
  },
});
