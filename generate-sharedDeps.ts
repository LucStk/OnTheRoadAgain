// generate-sharedDeps.ts
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __filename équivalent
const __filename = fileURLToPath(import.meta.url);
// __dirname équivalent
const __dirname = path.dirname(__filename);

const packageJsonPath = path.resolve(__dirname, 'package.json');
const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

const deps = pkg.dependencies || {};
const devDeps = pkg.devDependencies || {};

// Filtrage des deps à partager (ajuste selon ton besoin)
const allowed = [
  "vue",
  "vue-router",
  "pinia",
  "pinia-plugin-persistedstate",
  "axios",
  "axios-auth-refresh",
  "mitt",
  "vue-cropperjs",
  "vue-flatpickr-component",
];

const sharedDeps: Record<string, any> = {};

for (const dep of allowed) {
  const version = deps[dep] || devDeps[dep];
  if (version) {
    sharedDeps[dep] = {
      singleton: true,
      strictVersion: true,
      requiredVersion: version
    };
  }
}

const output = `export const sharedDeps = ${JSON.stringify(sharedDeps, null, 2)};\n`;

fs.writeFileSync(path.resolve(__dirname, 'vite.config.shared.ts'), output);
console.log('✅ sharedDeps généré dans vite.config.shared.ts');
