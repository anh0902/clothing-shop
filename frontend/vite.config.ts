import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwind()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      proxy: {
        '/api-user': {
          target: 'https://nhom1be.onrender.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api-user/, ''),
        },
        '/api-admin': {
          target: 'https://webchieut6.onrender.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api-admin/, ''),
        },
      },
    },
  };
});
