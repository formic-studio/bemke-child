import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  const isDevWatch = mode === 'development';

  return {
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: isDevWatch,
      minify: isDevWatch ? false : 'oxc',
      cssCodeSplit: false,
      lib: {
        entry: resolve(__dirname, 'src/js/main.js'),
        name: 'BemkeChild',
        formats: ['iife'],
        fileName: () => 'main.min.js',
        cssFileName: 'main.min',
      },
    },
  };
});
