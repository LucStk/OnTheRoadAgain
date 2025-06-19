import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tsconfigPaths from 'vite-tsconfig-paths'
import VueRouter from 'unplugin-vue-router/vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    VueRouter({
      routesFolder: [
        'src/pages',
        // Pointage vers la lib externe (absolu ou relatif)
        path.resolve(__dirname, '../../libs/ui/src/pages'),
      ],
      dts: './src/types/typed-router.d.ts'
    }),
    vue(),
    tsconfigPaths(),
    tailwindcss(),
  ],
})
