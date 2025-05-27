import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  test: {
    include: ['tests/vitest/*.{test,spec}.{js,ts}'],
    exclude: ['node_modules', 'dist', 'tests'],
    environment: 'jsdom',
    setupFiles: ['./tests/setupTest.js']
  },
  server: {
    fs: {
      allow: ['/dist']
    }
  }
});
