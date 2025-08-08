import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'node:path';
export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    resolve: {
        alias: {
            '@pkg/shared': path.resolve(__dirname, '../../packages/shared/src'),
        },
    },
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:8787',
                changeOrigin: true,
                rewrite: (p) => p.replace(/^\/api/, ''),
            },
        },
    },
});
