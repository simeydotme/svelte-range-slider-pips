import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    exclude: ['node_modules', 'dist', 'tests'],
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts']
  },
  server: {
    fs: {
      allow: ['/dist']
    }
  }
});
