import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue({ customElement: true })],
  server: {
    port: 5177,
    strictPort: true
  },
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
