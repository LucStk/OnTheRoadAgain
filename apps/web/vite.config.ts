import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import VueRouter from 'unplugin-vue-router/vite'
import path from 'path'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    VueRouter({
      routesFolder: [
        path.resolve(__dirname, './src/pages'), 
        path.resolve(__dirname, '../../libs/ui/src/pages'),
      ],
      dts: './src/types/typed-router.d.ts'
    }),
    vue(),
    tailwindcss(),
  ],
    resolve: {
    alias: {
      '@pages': path.resolve(__dirname, './src/pages'),
      '@ui-pages': path.resolve(__dirname, '../../lib/ui/src/pages')
    }
  }
})
