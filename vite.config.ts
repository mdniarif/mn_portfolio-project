import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
export default defineConfig({ base: "/mn_portfolio-project/", plugins: [react(), viteSingleFile()], build: { target: 'es2020', cssCodeSplit: false, assetsInlineLimit: 100000000, modulePreload: { polyfill: false } } });
