import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import VueRouter from 'unplugin-vue-router/vite'
import path from 'path'
// https://vite.dev/config/
export default defineConfig({
  logLevel: 'info',
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
    tailwindcss(),
  ],
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      // Logs pour le preprocessing CSS
    }
  },
    // Surveiller les changements dans libs
    // Optimizations des dépendances

  server: {
    watch: {
      // Inclure les libs dans le watch
      ignored: ['!**/node_modules/@repo/**']
    }
  },
  
  // Ajouter des logs CSS

})
