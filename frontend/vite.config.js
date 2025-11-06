import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5176,
    host: true,
    strictPort: false
  },
  preview: {
    host: true,
    port: 8080,
    strictPort: false,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'projektafrontend.onrender.com',
      'profilematch-frontend.onrender.com'
    ]
  },
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['lucide-react', 'framer-motion'],
          charts: ['recharts'],
          pdf: ['jspdf', 'html2canvas']
        }
      }
    }
  }
})