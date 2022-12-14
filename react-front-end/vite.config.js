import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://movie.hhhwww.top",
        // target: "http://127.0.0.1:28545",
        changeOrigin: true,
//                rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
})
