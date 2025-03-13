import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ['tests/vitest/*.{test,spec}.{js,ts}'],
    exclude: ['node_modules', 'dist', 'tests'],
    environment: 'jsdom',
    setupFiles: ['./setupTest.js']
  },
  server: {
    fs: {
      allow: ['/dist']
    }
  }
});
