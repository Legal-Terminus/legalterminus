import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// Pages only the Android app shows (capacitor.config.ts `server.errorPath`). They live
// in MobileApp/web, not public/, so the website never serves them: the app is still
// in development and the site must not mention it.
const appOnlyPages = () => ({
  name: 'lt-app-only-pages',
  generateBundle(this: { emitFile: (f: { type: 'asset'; fileName: string; source: string }) => void }) {
    const dir = path.resolve(__dirname, '../MobileApp/web');
    for (const fileName of fs.readdirSync(dir)) {
      this.emitFile({ type: 'asset', fileName, source: fs.readFileSync(path.join(dir, fileName), 'utf8') });
    }
  },
});

export default defineConfig(({ mode }) => ({
  // Firebase deployment: base should be '/portal/' so assets are at /portal/assets/...
  // Direct Cloud Run access: would need base='/' but we prioritize Firebase
  // `--mode mobile` (Capacitor app bundle) serves from the root. Web builds are unchanged.
  base: mode === 'mobile' ? '/' : '/portal/',
  plugins: mode === 'mobile' ? [react(), appOnlyPages()] : [react()],
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
}));
