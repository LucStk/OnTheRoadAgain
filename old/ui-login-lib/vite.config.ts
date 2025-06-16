import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    federation({
      remotes: {
        ui_remote: 'http://localhost:5001/assets/remoteEntry.js', // adapte le port si besoin
      },
      shared: ['vue', 'pinia'],
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
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        format: 'esm',
      },
    },
  },
  server: {
    port: 5002
  },
    test: {
    environment: 'jsdom', // ou node
    }
})