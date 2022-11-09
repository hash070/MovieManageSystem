import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        // target: "http://127.0.0.1:28545",
        target: "https://movie.hash070.top",
        // target: "https://movie.hhhwww.top",
        changeOrigin: true,
//                rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
})
