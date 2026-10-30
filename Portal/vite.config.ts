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
  // `xlsx` is loaded on demand (Excel upload and download). In development Vite
  // only discovers such a dependency when it is first imported, then optimises
  // it and RELOADS the page — which wiped an open upload preview (#217's e2e).
  // Pre-bundling it up front avoids that. No effect on the production build.
  optimizeDeps: {
    include: ['xlsx'],
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
