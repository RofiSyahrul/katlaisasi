import { configDefaults, defineConfig } from 'vitest/config';

import config from './vite.config';

export default defineConfig({
  ...(config as Record<string, unknown>),
  test: {
    coverage: {
      ...configDefaults.coverage,
      all: true,
      exclude: ['src/**/*.d.ts', 'src/lib/constants', 'src/lib/types', 'src/**/noop.ts'],
      include: ['src']
    }
  }
});
