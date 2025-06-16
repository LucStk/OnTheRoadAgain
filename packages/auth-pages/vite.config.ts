import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [
    vue(),
    VueRouter({
      routesFolder: 'src/pages',
      dts: 'src/typed-router.d.ts', // génère automatiquement les types
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'AuthPages',
      formats: ['es', 'cjs'],
      fileName: (format) => `auth-pages.${format}.js`
    },
    rollupOptions: {
      external: ['vue', 'vue-router', 'auth-lib']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      //'auth-lib': path.resolve(__dirname, '../../packages/auth-lib/dist/auth-lib.es.js')
    },
  },
})
