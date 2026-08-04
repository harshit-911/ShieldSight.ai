import { defineConfig, build as viteBuild, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

/**
 * Custom Vite plugin to build the content script as a self-contained IIFE bundle.
 * Chrome Extension MV3 content scripts run in isolated script contexts and cannot
 * use ES module import statements.
 */
function buildContentScript(): Plugin {
  return {
    name: 'build-content-script',
    async writeBundle() {
      await viteBuild({
        configFile: false,
        resolve: {
          alias: {
            '@': resolve(__dirname, './src'),
          },
        },
        build: {
          write: true,
          outDir: 'dist',
          emptyOutDir: false,
          lib: {
            entry: resolve(__dirname, 'src/content/index.ts'),
            name: 'ShieldSightContentScript',
            formats: ['iife'],
            fileName: () => 'content.js',
          },
          rollupOptions: {
            output: {
              extend: true,
            },
          },
        },
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), buildContentScript()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'index.html'),
        background: resolve(__dirname, 'src/background/index.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'background') {
            return '[name].js';
          }
          return 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
});
