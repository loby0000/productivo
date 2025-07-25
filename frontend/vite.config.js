import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3001,
    strictPort: true,
    host: true,
    watch: {
      usePolling: true
    },    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3002',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    // Configuración de producción
    target: 'es2015',
    minify: 'terser',
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'qr-vendor': ['qrcode'],
          'icons': ['lucide-vue-next']
        }
      }
    },    chunkSizeWarningLimit: 1000
  }
});
