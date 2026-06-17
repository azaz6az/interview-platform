import { createTheme } from '@mui/material/styles';

/**
 * Stripe 设计系统主题配置 — 支持亮色/暗色模式
 */

/** ===== 渐变系统 ===== */
const GRADIENTS = {
  primary: 'linear-gradient(135deg, #533afd 0%, #7c3aed 100%)',
  warm: 'linear-gradient(135deg, #533afd 0%, #ea2261 100%)',
  cool: 'linear-gradient(135deg, #533afd 0%, #3b82f6 100%)',
  success: 'linear-gradient(135deg, #15be53 0%, #10b981 100%)',
  bgSubtle: 'linear-gradient(180deg, #f7fafc 0%, #f5f3ff 100%)',
  hero: 'linear-gradient(135deg, #4338ca 0%, #533afd 50%, #7c3aed 100%)',
  timeline: 'linear-gradient(180deg, #533afd 0%, #ea2261 100%)',
};

/** ===== 彩色阴影系统（亮色） ===== */
const SHADOWS_LIGHT = {
  card: 'rgba(50,50,93,0.08) 0px 20px 40px -20px, rgba(0,0,0,0.04) 0px 10px 20px -10px',
  light: 'rgba(23,23,23,0.06) 0px 10px 30px 0px',
  hover: 'rgba(23,23,23,0.08) 0px 6px 16px 0px',
  purple: 'rgba(83,58,253,0.15) 0px 8px 32px -4px',
  warm: 'rgba(234,34,97,0.12) 0px 8px 32px -4px',
  success: 'rgba(21,190,83,0.12) 0px 8px 32px -4px',
  elevated: 'rgba(50,50,93,0.18) 0px 30px 60px -30px, rgba(0,0,0,0.08) 0px 18px 36px -18px',
};

/** ===== 彩色阴影系统（暗色） ===== */
const SHADOWS_DARK = {
  card: 'rgba(0,0,0,0.3) 0px 20px 40px -20px, rgba(0,0,0,0.2) 0px 10px 20px -10px',
  light: 'rgba(0,0,0,0.25) 0px 10px 30px 0px',
  hover: 'rgba(0,0,0,0.3) 0px 6px 16px 0px',
  purple: 'rgba(83,58,253,0.25) 0px 8px 32px -4px',
  warm: 'rgba(234,34,97,0.2) 0px 8px 32px -4px',
  success: 'rgba(21,190,83,0.2) 0px 8px 32px -4px',
  elevated: 'rgba(0,0,0,0.4) 0px 30px 60px -30px, rgba(0,0,0,0.2) 0px 18px 36px -18px',
};

/** ===== 辅助背景色（亮色） ===== */
const ACCENT_BG_LIGHT = {
  purple: '#f5f3ff',
  blue: '#eff6ff',
  green: '#f0fdf4',
  orange: '#fff7ed',
  pink: '#fdf2f8',
};

/** ===== 辅助背景色（暗色） ===== */
const ACCENT_BG_DARK = {
  purple: 'rgba(83,58,253,0.12)',
  blue: 'rgba(59,130,246,0.12)',
  green: 'rgba(21,190,83,0.12)',
  orange: 'rgba(245,158,11,0.12)',
  pink: 'rgba(234,34,97,0.12)',
};

/** ===== 共享 typography ===== */
const typography = {
  fontFamily: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Noto Sans SC"', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
  h1: { fontWeight: 300, fontSize: '3rem', lineHeight: 1.15, letterSpacing: '-0.96px' },
  h2: { fontWeight: 300, fontSize: '2rem', lineHeight: 1.2, letterSpacing: '-0.64px' },
  h3: { fontWeight: 300, fontSize: '1.5rem', lineHeight: 1.25, letterSpacing: '-0.288px' },
  h4: { fontWeight: 400, fontSize: '1.25rem', lineHeight: 1.3 },
  h5: { fontWeight: 400, fontSize: '1rem', lineHeight: 1.4, letterSpacing: '-0.01em' },
  h6: { fontWeight: 400, fontSize: '0.875rem', lineHeight: 1.5 },
  subtitle1: { fontWeight: 500, fontSize: '1rem', lineHeight: 1.5 },
  subtitle2: { fontWeight: 500, fontSize: '0.875rem', lineHeight: 1.5 },
  body1: { fontWeight: 400, fontSize: '1rem', lineHeight: 1.6 },
  body2: { fontWeight: 300, fontSize: '0.875rem', lineHeight: 1.6 },
  caption: { fontWeight: 400, fontSize: '0.75rem', lineHeight: 1.5 },
  button: { fontWeight: 500, textTransform: 'none' },
};

/** ===== 共享动画 keyframes ===== */
const keyframes = {
  '@keyframes fadeInUp': { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
  '@keyframes fadeIn': { from: { opacity: 0 }, to: { opacity: 1 } },
  '@keyframes pulse': { '0%': { opacity: 0.4, transform: 'scale(0.95)' }, '50%': { opacity: 1, transform: 'scale(1)' }, '100%': { opacity: 0.4, transform: 'scale(0.95)' } },
  '@keyframes waveBar': { '0%, 100%': { height: '4px' }, '50%': { height: '16px' } },
  '@keyframes micPulse': { '0%': { boxShadow: '0 0 0 0 rgba(83,58,253,0.4)' }, '70%': { boxShadow: '0 0 0 12px rgba(83,58,253,0)' }, '100%': { boxShadow: '0 0 0 0 rgba(83,58,253,0)' } },
};

/** ===== 亮色主题 ===== */
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#533afd', light: '#7b6ffd', dark: '#4434d4', contrastText: '#fff' },
    secondary: { main: '#ea2261', light: '#f05088', dark: '#c41850', contrastText: '#fff' },
    background: { default: '#f7fafc', paper: '#ffffff' },
    text: { primary: '#061b31', secondary: '#64748d' },
    divider: '#e5edf5',
    success: { main: '#15be53', light: '#e6f9ed', dark: '#108c3d' },
    error: { main: '#ea2261' },
  },
  typography: { ...typography, h1: { ...typography.h1, color: '#061b31' }, h2: { ...typography.h2, color: '#061b31' }, h3: { ...typography.h3, color: '#061b31' }, h4: { ...typography.h4, color: '#061b31' }, h5: { ...typography.h5, color: '#061b31' }, h6: { ...typography.h6, color: '#061b31' }, subtitle1: { ...typography.subtitle1, color: '#061b31' }, subtitle2: { ...typography.subtitle2, color: '#273951' }, body1: { ...typography.body1, color: '#64748d' }, body2: { ...typography.body2, color: '#64748d' }, caption: { ...typography.caption, color: '#64748d' } },
  shape: { borderRadius: 8 },
  shadows: ['none', SHADOWS_LIGHT.hover, SHADOWS_LIGHT.light, SHADOWS_LIGHT.card, SHADOWS_LIGHT.purple, SHADOWS_LIGHT.elevated, ...Array(19).fill(SHADOWS_LIGHT.elevated)],
  components: {
    MuiCssBaseline: { styleOverrides: { html: { scrollBehavior: 'smooth' }, body: { fontFeatureSettings: '"ss01"', WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' }, '::selection': { backgroundColor: 'rgba(83,58,253,0.15)', color: '#4434d4' }, ...keyframes } },
    MuiCard: { styleOverrides: { root: { boxShadow: SHADOWS_LIGHT.card, borderRadius: 12, border: '1px solid #e5edf5', overflow: 'hidden', transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)' } } },
    MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 500, borderRadius: 8, padding: '8px 20px', fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', '&:active': { transform: 'scale(0.97)' } }, contained: { background: GRADIENTS.primary, boxShadow: 'none', '&:hover': { background: 'linear-gradient(135deg, #4434d4 0%, #6d28d9 100%)', boxShadow: SHADOWS_LIGHT.purple } }, outlined: { borderColor: '#b9b9f9', color: '#533afd', '&:hover': { borderColor: '#533afd', backgroundColor: 'rgba(83,58,253,0.04)', boxShadow: '0 0 0 3px rgba(83,58,253,0.08)' } } } },
    MuiTextField: { styleOverrides: { root: { '& .MuiOutlinedInput-root': { borderRadius: 8, fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif', transition: 'box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1)', '& fieldset': { borderColor: '#e5edf5', transition: 'border-color 0.2s ease' }, '&:hover fieldset': { borderColor: '#b9b9f9' }, '&.Mui-focused fieldset': { borderColor: '#533afd', borderWidth: 1.5 }, '&.Mui-focused': { boxShadow: '0 0 0 3px rgba(83,58,253,0.1)' } }, '& .MuiInputLabel-root': { color: '#273951', fontWeight: 400 } } } },
    MuiChip: { styleOverrides: { root: { borderRadius: 6, fontWeight: 500, fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' } } },
    MuiAppBar: { styleOverrides: { root: { boxShadow: 'none' } } },
    MuiDrawer: { styleOverrides: { paper: { borderRight: '1px solid #e5edf5' } } },
    MuiBottomNavigation: { styleOverrides: { root: { borderTop: '1px solid #e5edf5', height: 56 } } },
    MuiBottomNavigationAction: { styleOverrides: { root: { fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif', fontWeight: 400, transition: 'color 0.2s ease', '&.Mui-selected': { color: '#533afd' } } } },
    MuiIconButton: { styleOverrides: { root: { borderRadius: 8, transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
  },
});

/** ===== 暗色主题 ===== */
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#7c6aff', light: '#9d8fff', dark: '#533afd', contrastText: '#fff' },
    secondary: { main: '#f05088', light: '#f57aa3', dark: '#ea2261', contrastText: '#fff' },
    background: { default: '#0f172a', paper: '#1e293b' },
    text: { primary: '#f1f5f9', secondary: '#94a3b8' },
    divider: '#334155',
    success: { main: '#34d673', light: 'rgba(21,190,83,0.15)', dark: '#15be53' },
    error: { main: '#f05088' },
  },
  typography: { ...typography, h1: { ...typography.h1, color: '#f1f5f9' }, h2: { ...typography.h2, color: '#f1f5f9' }, h3: { ...typography.h3, color: '#f1f5f9' }, h4: { ...typography.h4, color: '#f1f5f9' }, h5: { ...typography.h5, color: '#f1f5f9' }, h6: { ...typography.h6, color: '#f1f5f9' }, subtitle1: { ...typography.subtitle1, color: '#f1f5f9' }, subtitle2: { ...typography.subtitle2, color: '#cbd5e1' }, body1: { ...typography.body1, color: '#94a3b8' }, body2: { ...typography.body2, color: '#94a3b8' }, caption: { ...typography.caption, color: '#94a3b8' } },
  shape: { borderRadius: 8 },
  shadows: ['none', SHADOWS_DARK.hover, SHADOWS_DARK.light, SHADOWS_DARK.card, SHADOWS_DARK.purple, SHADOWS_DARK.elevated, ...Array(19).fill(SHADOWS_DARK.elevated)],
  components: {
    MuiCssBaseline: { styleOverrides: { html: { scrollBehavior: 'smooth' }, body: { fontFeatureSettings: '"ss01"', WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale', backgroundColor: '#0f172a' }, '::selection': { backgroundColor: 'rgba(124,106,255,0.25)', color: '#9d8fff' }, ...keyframes } },
    MuiCard: { styleOverrides: { root: { boxShadow: SHADOWS_DARK.card, borderRadius: 12, border: '1px solid #334155', overflow: 'hidden', transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)', backgroundColor: '#1e293b' } } },
    MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 500, borderRadius: 8, padding: '8px 20px', fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', '&:active': { transform: 'scale(0.97)' } }, contained: { background: GRADIENTS.primary, boxShadow: 'none', '&:hover': { background: 'linear-gradient(135deg, #6d5cff 0%, #8b5cf6 100%)', boxShadow: SHADOWS_DARK.purple } }, outlined: { borderColor: '#7c6aff', color: '#9d8fff', '&:hover': { borderColor: '#9d8fff', backgroundColor: 'rgba(124,106,255,0.08)', boxShadow: '0 0 0 3px rgba(124,106,255,0.12)' } } } },
    MuiTextField: { styleOverrides: { root: { '& .MuiOutlinedInput-root': { borderRadius: 8, fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif', transition: 'box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1)', '& fieldset': { borderColor: '#334155', transition: 'border-color 0.2s ease' }, '&:hover fieldset': { borderColor: '#475569' }, '&.Mui-focused fieldset': { borderColor: '#7c6aff', borderWidth: 1.5 }, '&.Mui-focused': { boxShadow: '0 0 0 3px rgba(124,106,255,0.12)' } }, '& .MuiInputLabel-root': { color: '#94a3b8', fontWeight: 400 } } } },
    MuiChip: { styleOverrides: { root: { borderRadius: 6, fontWeight: 500, fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' } } },
    MuiAppBar: { styleOverrides: { root: { boxShadow: 'none' } } },
    MuiDrawer: { styleOverrides: { paper: { borderRight: '1px solid #334155', backgroundColor: '#1e293b' } } },
    MuiBottomNavigation: { styleOverrides: { root: { borderTop: '1px solid #334155', height: 56, backgroundColor: '#1e293b' } } },
    MuiBottomNavigationAction: { styleOverrides: { root: { fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif', fontWeight: 400, transition: 'color 0.2s ease', color: '#94a3b8', '&.Mui-selected': { color: '#7c6aff' } } } },
    MuiIconButton: { styleOverrides: { root: { borderRadius: 8, transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiDialog: { styleOverrides: { paper: { backgroundColor: '#1e293b' } } },
  },
});

/** 导出 */
export { GRADIENTS, SHADOWS_LIGHT as SHADOWS, ACCENT_BG_LIGHT as ACCENT_BG, SHADOWS_DARK, ACCENT_BG_DARK };
export { lightTheme, darkTheme };
export default lightTheme;
