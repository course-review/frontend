import { fileURLToPath, URL } from 'node:url'
import envCompatible from 'vite-plugin-env-compatible';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// @ts-ignore
import nightwatchPlugin from 'vite-plugin-nightwatch'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    nightwatchPlugin(),
    envCompatible()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
