import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const projectRoot = process.env.MAATA_TEST_ROOT ?? process.cwd();
export default defineConfig({ root: projectRoot, server: { fs: { allow: [projectRoot] } }, plugins: [react(), tailwindcss()], test: { environment: 'node', include: ['src/**/*.test.ts', 'src/**/*.test.tsx'], coverage: { reporter: ['text', 'html'] } } });
