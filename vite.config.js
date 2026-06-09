import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: 'src/widget.js',
      name: 'MixplaWidget',
      fileName: 'mixpla-widget',
      formats: ['iife']
    },
    rollupOptions: {
      // bundle everything — no externals, so the script is fully self-contained
    }
  }
})
