import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  plugins: [glsl()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'tests/', 'src/main.ts', 'src/main-mobile.ts']
    }
  }
});
