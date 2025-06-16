import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import vueDevTools from 'vite-plugin-vue-devtools'

import path from 'path'

export default defineConfig({
  optimizeDeps: {
    exclude: ['pinia-plugin-persistedstate']
  },
  plugins: [
    VueRouter({
      routesFolder:"src/pages",
      dts: 'types/typed-router.d.ts',
    }),
    vue(),
    vueDevTools(),
    AutoImport({
      imports: [
        'vue',          // auto-import ref, reactive, etc.
        'vue-router',   // useRoute, useRouter
      ],
      dts: 'types/auto-imports.d.ts',
      vueTemplate: true,
    }),
    Components({
      dirs: ['src/components'],
      extensions: ['vue'],
      deep: true,
      dts: 'types/components.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'auth-lib': path.resolve(__dirname, '../../packages/auth-lib/dist/auth-lib.es.js')
    },
  },
})
