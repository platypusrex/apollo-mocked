import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      graphql: 'graphql/index.js',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['test/**/*.test.tsx'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{tsx,ts}'],
      exclude: ['src/index.ts'],
    },
  },
});
