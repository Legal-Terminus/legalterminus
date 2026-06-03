import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from dist
// When Firebase rewrites /portal/** to this service, it strips /portal from the path
// So we serve static files from root
app.use('/', express.static(join(__dirname, 'dist'), {
  maxAge: '1h',
  etag: false,
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// SPA fallback: route all requests to index.html for client-side routing
// This handles all routes that don't match static files
app.use((req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'), (err) => {
    if (err) {
      console.error('Error sending index.html for', req.path, ':', err);
      res.status(500).send('Error loading page');
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Internal server error');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Portal running on http://0.0.0.0:${PORT}`);
  console.log(`📁 Serving from: ${join(__dirname, 'dist')}`);
}).on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
