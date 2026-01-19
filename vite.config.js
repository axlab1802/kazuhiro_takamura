import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 1105,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});
