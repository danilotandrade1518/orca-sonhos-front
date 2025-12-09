import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    maxConcurrency: 3,
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
  },
  resolve: {
    alias: {
      '@app': resolve(__dirname, './src/app'),
      '@core': resolve(__dirname, './src/app/core'),
      '@shared': resolve(__dirname, './src/app/shared'),
      '@features': resolve(__dirname, './src/app/features'),
      '@dtos': resolve(__dirname, './src/dtos'),
      '@either': resolve(__dirname, './src/shared/core'),
    },
  },
  css: {
    modules: {
      classNameStrategy: 'non-scoped',
    },
  },
  esbuild: {
    loader: 'tsx',
  },
  assetsInclude: ['**/*.scss'],
});

