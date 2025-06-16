// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { sharedDeps } from '../../../vite.config.shared'
import federation from "@originjs/vite-plugin-federation";

import path from 'path'

export default {
    plugins: [
        VueRouter({
            routesFolder:"src/pages",
            dts: 'types/typed-router.d.ts',
        }),
        vue(),
        federation({
            name: 'map_remote',
            filename: 'mapRemoteEntry.js',
            // Modules to expose
            exposes: {
                './Map': '@/Map.vue',
            },
            shared: sharedDeps,
        }),
        AutoImport({
        imports: [
            'vue',          // auto-import ref, reactive, etc.
            'vue-router',   // useRoute, useRouter
            'pinia',
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
            '@': path.resolve(__dirname, '../src'),
        },
    },
    server: {
        port: 5001
    }
}