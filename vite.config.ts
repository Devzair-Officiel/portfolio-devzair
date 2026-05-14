import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('framer-motion'))               return 'vendor-motion'
          if (id.includes('react-router'))                return 'vendor-router'
          if (id.includes('i18next') || id.includes('react-i18next')) return 'vendor-i18n'
          if (id.includes('react-dom') || id.includes('react/'))      return 'vendor-react'
          if (id.includes('@dnd-kit'))                    return 'vendor-dnd'
          return 'vendor'
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
})
