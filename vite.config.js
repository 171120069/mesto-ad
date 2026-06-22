import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: '.',
  base: './', // <-- ЭТА СТРОКА ИСПРАВЛЯЕТ ПРОБЛЕМУ
  server: {
    open: true
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      }
    }
  }
});