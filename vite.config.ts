import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Plugin Tailwind v4 — remplace PostCSS
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'), // Alias @ → src/
    },
  },
})