import { defineConfig } from 'cypress'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
      viteConfig: {
        plugins: [vue()],
        resolve: {
          alias: {
            '@ui': path.resolve(__dirname, '../../libs/ui/src'),
          },
        },
      },
    },
    specPattern: 'src/**/*.cy.{js,ts,jsx,tsx}',
    supportFile: false,
  },
})
