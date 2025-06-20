import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import VueRouter from 'unplugin-vue-router/vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  
  plugins: [
    VueRouter({
      dts: './src/types/typed-router.d.ts'
    }),
    vue({
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag === 'altcha-widget' // Pour altcha
      }
    }
    }),
    tsconfigPaths(),
    tailwindcss(),
  ],
  
  server: {
    fs: {
      allow: [
        '..', // autorise accès au dossier parent (libs/, node_modules/, etc.)
      ]
    }
  },/**/
  build: {
    rollupOptions: {
      external: ['cropperjs/dist/cropper.css','flatpickr/dist/flatpickr.css'],
      
    }
  }
})
