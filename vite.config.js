import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    strictPort: true, // Fuerza a usar exactamente el puerto 5173, no busca alternativas
    host: true, // Permite conexiones desde otras IPs
    open: true // Abre automáticamente el navegador
  },
  preview: {
    port: 5173,
    strictPort: true
  }
})
