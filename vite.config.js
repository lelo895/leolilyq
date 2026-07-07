import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jsx}'],
        maximumFileSizeToCacheInBytes: 5000000
      }
    })
  ],
  build: {
    chunkSizeWarningLimit: 400,
    cssCodeSplit: true,
    minify: 'esbuild',
    sourcemap: false,
  },
});
