import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  
  plugins: [
    VueRouter({
      dts: './src/types/typed-router.d.ts'
    }),
    vue(),
    tsconfigPaths(),
    tailwindcss(),
  ],
})
