import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  logLevel: 'info',
  plugins: [
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
