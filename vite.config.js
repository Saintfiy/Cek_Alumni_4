import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Cek_Alumni_4/',
  css: {
    devSourcemap: true
  },
  build: {
    cssMinify: false
  }
})
