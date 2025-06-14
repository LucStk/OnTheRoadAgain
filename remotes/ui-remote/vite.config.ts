import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'ui_remote',
      filename: 'remoteEntry.js',
      exposes: {
        './api': './src/services/api.ts',
        './useAuthStore': './src/stores/auth.ts'
      },
      shared: ['vue', 'pinia']
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  },
  server: {
    port: 5006
  },
    test: {
    environment: 'jsdom', // ou node
    }
})