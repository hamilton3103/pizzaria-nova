import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      external: ['mysql2', 'dotenv'],
      output: {
        globals: {
          'mysql2': 'mysql2',
          'dotenv': 'dotenv'
        }
      }
    }
  },
  define: {
    global: 'globalThis',
  }
})