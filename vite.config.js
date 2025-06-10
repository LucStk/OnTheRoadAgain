import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'


import path from 'path'

export default defineConfig({
  plugins: [
    VueRouter({
      routesFolder:"src/pages",
      dts: 'src/typed-router.d.ts',
    }),
    vue(),

    AutoImport({
      imports: [
        'vue',          // auto-import ref, reactive, etc.
        'vue-router',   // useRoute, useRouter
        'pinia',

        {
          axios: [['default', 'axios']],
          "@/stores/auth":["useAuthStore"],
          "@/services/api":["api"]
        },
      ],
      dts: 'src/auto-imports.d.ts',
      vueTemplate: true,
    }),

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
  server: {  // attention: pas `devServer`, c’est `server` dans Vite
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
