import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
  build: {
    minify: 'terser',
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/react-router')) {
            return 'vendor-router';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-animation';
          }
          if (id.includes('node_modules/react-icons')) {
            return 'vendor-icons';
          }
          if (id.includes('node_modules/firebase')) {
            return 'vendor-firebase';
          }
          // Component chunks - split heavy components
          if (id.includes('Components/PvtltdTestimonial') || 
              id.includes('Components/PvtltdVideoTestimonial') || 
              id.includes('Components/PvtltdOurclints') ||
              id.includes('Components/DissolvePrivateTestimonial') ||
              id.includes('Components/DissolveVideoTestimonial') ||
              id.includes('Components/DissolaveOurClients')) {
            return 'testimonial-chunks';
          }
        },
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
})
