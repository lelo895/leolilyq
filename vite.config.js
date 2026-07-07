import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 400,
    cssCodeSplit: true,
    minify: 'esbuild',
    sourcemap: false,
  },
});
