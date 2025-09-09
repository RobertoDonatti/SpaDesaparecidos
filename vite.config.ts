import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  define: {
    __REACT_DEVTOOLS_GLOBAL_HOOK__: 'undefined',
    'globalThis.__REACT_DEVTOOLS_GLOBAL_HOOK__': 'undefined',
    'global.__REACT_DEVTOOLS_GLOBAL_HOOK__': 'undefined'
  },
  resolve: {
    alias: {
  '@': '/src',
    },
  },
})
