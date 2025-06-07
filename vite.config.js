import { defineConfig } from 'vite'

import VueRouter from 'unplugin-vue-router/vite'

import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    VueRouter({
      /* options */
    }),
    vue(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),  
      '@MapApp': path.resolve(__dirname, './src/MapApp'),  
      '@UserApp': path.resolve(__dirname, './src/UserApp'),  
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
