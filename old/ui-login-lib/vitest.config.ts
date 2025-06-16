import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',  // émule un navigateur dans les tests
    setupFiles: './tests/setup.ts', // fichier à créer pour setup pinia global
  },
})