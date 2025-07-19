import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      // Remover dependências externas que causam problemas no build
      external: [],
      output: {
        globals: {}
      }
    }
  },
  define: {
    global: 'globalThis',
  },
  // Configurações para build estático
  base: './',
  publicDir: 'public'
})