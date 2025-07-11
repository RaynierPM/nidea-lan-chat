import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: resolve(__dirname, 'electron/main/main.ts')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: resolve(__dirname, 'electron/preload/main.ts')
      }
    }
  },
  renderer: {
    root: resolve(__dirname, 'electron/renderer'),
    resolve: {
      alias: {
        '@renderer': resolve('electron/renderer/src'),
        '@common': resolve('common/'),
      }
    },
    plugins: [react()],
    build: {
      rollupOptions: {
        input: resolve(__dirname, 'electron/renderer/index.html')
      }
    }
  }
})
