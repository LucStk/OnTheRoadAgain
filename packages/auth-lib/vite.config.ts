import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { peerDependencies } from './package.json'

import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'), // ✅ point d’entrée réel
      name: 'AuthLib',
      fileName: (format) => `auth-lib.${format}.js`,
      formats: ['es', 'cjs'], // ✅ formats courants (ESM + CommonJS)
    },
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      external: Object.keys(peerDependencies), // ✅ automatiquement tous les peer deps
      output: {
        globals: {
          vue: 'Vue',
          pinia: 'Pinia',
          axios: 'axios'
        }
      },
    },
  },
  test: {
    environment: 'jsdom',
  },
})
