import { defineConfig } from 'vite'

import VueRouter from 'unplugin-vue-router/vite'

import vue from '@vitejs/plugin-vue'

import tailwindcss from '@tailwindcss/vite'
import path from 'path'

import Components from 'unplugin-vue-components/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    VueRouter({/* options */}),
    vue(),
    tailwindcss(),
    Components({
      dirs: ['src/components'],
      extensions: ['vue'],
      deep: true,
      dts: 'src/components.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',  // ton backend Django
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
