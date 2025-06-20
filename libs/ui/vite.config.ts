import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import VueRouter from 'unplugin-vue-router/vite'
// https://vite.dev/config/
export default defineConfig({
  
  plugins: [
    VueRouter({
      /* options */
    }),
   vue(),
   tailwindcss(),
  ],
    server: {
    fs: {
      allow: [
        '..', // autorise accès au dossier parent (libs/, node_modules/, etc.)
      ]
    }
  },/**/
})
