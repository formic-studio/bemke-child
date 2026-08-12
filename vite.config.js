import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  const isDevWatch = mode === 'development';

  return {
    build: {
      outDir: 'dist',
      // Dynamic chunks are content-hashed and cached for a year by Hostinger.
      // Keep prior hashes available so cached entry files never point to 404s.
      emptyOutDir: false,
      sourcemap: isDevWatch,
      minify: isDevWatch ? false : 'oxc',
      cssCodeSplit: false,
      lib: {
        entry: resolve(__dirname, 'src/js/main.js'),
        name: 'BemkeChild',
        formats: ['es'],
        fileName: () => 'main.min.js',
        cssFileName: 'main.min',
      },
      rollupOptions: {
        output: {
          chunkFileNames: 'chunks/[name]-[hash].js',
        },
      },
    },
  };
});
