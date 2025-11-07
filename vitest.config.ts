import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    maxConcurrency: 3,
    globals: true,
    environment: 'jsdom',
  },
});
