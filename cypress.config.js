const { defineConfig } = require('cypress')

module.exports = defineConfig({
  
  e2e: {
    baseUrl: 'http://127.0.0.1:5173', // Port Vite
    supportFile: 'cypress/support/e2e.js',
    setupNodeEvents(on, config) {
      // Tu peux y brancher des plugins si besoin
    },
  },
  component: {
    supportFile: 'cypress/support/component.ts' // ✅ Mis ici maintenant
  }
})
