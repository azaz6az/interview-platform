import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 使用 tailwind prefix 避免与 MUI 冲突
  css: {
    postcss: './postcss.config.js',
  },
});
