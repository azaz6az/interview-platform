/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  // 使用 tw- 前缀避免与 MUI class 冲突
  prefix: 'tw-',
  corePlugins: {
    // 禁用 preflight 避免与 MUI 样式冲突
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
};
