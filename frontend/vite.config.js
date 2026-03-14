import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Bất cứ khi nào Frontend gọi '/api', Vite sẽ tự động gửi ngầm nó sang Render
      '/api': {
        target: 'https://webchieut6-1.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})