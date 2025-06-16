import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'
import path from 'path'

export default defineConfig({
  plugins: [vue(),],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'AUTH-LIB',
      fileName: (format) => `ui-lib.${format}.js`
    },
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      external: ['vue'],
      output: {
        format: 'esm',
        globals: {
          vue: 'Vue'
        }
      },
    },
  },
  test: {
    environment: 'jsdom', // ou node
    }
})