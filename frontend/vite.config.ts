import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        // svgo options
      },
    }),
  ],
  server:{
    port:3001
  },
  resolve: {
    alias: {
      '@src': '/src',
      '@assets': '/src/assets',
      '@components': '/src/components',
      '@config': '/src/config',
      '@lib': '/src/lib',
      '@pages': '/src/pages',
      '@interfaces': '/src/interfaces',
    },
  },
});
