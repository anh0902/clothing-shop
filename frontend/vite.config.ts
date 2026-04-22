import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwind()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      proxy: {
        '/api-admin': {
          target: 'http://localhost:8080/api',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api-admin/, '')
        },
        '/api-user': {
          target: 'http://localhost:8000/api',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api-user/, '')
        }
      }
    },
  };
});
