import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // This makes sure refreshing on /news/5 still loads the app
    // instead of showing a "Cannot GET /news/5" error
    historyApiFallback: true,
  },
})
