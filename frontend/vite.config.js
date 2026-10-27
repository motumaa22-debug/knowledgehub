import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-index-to-404',
      closeBundle() {
        try {
          const distDir = path.resolve(__dirname, 'dist');
          const indexPath = path.join(distDir, 'index.html');
          const notFoundPath = path.join(distDir, '404.html');
          if (fs.existsSync(indexPath)) {
            fs.copyFileSync(indexPath, notFoundPath);
          }
        } catch (e) {
          console.warn('Could not copy 404.html:', e);
        }
      },
    },
  ],
  server: {
    port: 5173,
    open: false,
  },
});
