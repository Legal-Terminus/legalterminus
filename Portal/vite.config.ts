import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  // Firebase deployment: base should be '/portal/' so assets are at /portal/assets/...
  // Direct Cloud Run access: would need base='/' but we prioritize Firebase
  base: '/portal/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared'),
    },
    // The shared/ workflow module (repo root) imports 'xstate' and would resolve
    // to the ROOT node_modules copy, while Portal uses its own — two copies in
    // the bundle and clashing type identities. Dedupe to Portal's single copy.
    dedupe: ['xstate', '@xstate/react'],
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
});
