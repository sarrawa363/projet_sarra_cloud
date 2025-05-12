import { defineConfig } from 'vite'

export default defineConfig({
  root: 'public', // <-- indique à Vite que ton point d'entrée est ici
  build: {
    outDir: '../dist', // <-- où mettre les fichiers compilés
    emptyOutDir: true
  }
})
