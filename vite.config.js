import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // permite acceder desde otros dispositivos en la misma red local
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
