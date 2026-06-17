import { createTheme } from '@mui/material/styles';

/**
 * Stripe 设计系统主题配置
 * 主色调 Stripe Purple #533afd，强调色 Ruby #ea2261
 * 字体 Inter Variable，标题 weight 300（Stripe 标志性轻盈风格）
 * 蓝色调阴影 + 4-8px 圆角
 */

/** Stripe 蓝色调阴影系统 */
const SHADOWS = {
  /** 标准卡片阴影 */
  card: 'rgba(50,50,93,0.25) 0px 30px 45px -30px, rgba(0,0,0,0.1) 0px 18px 36px -18px',
  /** 轻阴影 */
  light: 'rgba(23,23,23,0.08) 0px 15px 35px 0px',
  /** 悬浮阴影 */
  hover: 'rgba(23,23,23,0.06) 0px 3px 6px 0px',
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#533afd',
      light: '#7b6ffd',
      dark: '#4434d4',
      contrastText: '#fff',
    },
    secondary: {
      main: '#ea2261',
      light: '#f05088',
      dark: '#c41850',
      contrastText: '#fff',
    },
    background: {
      default: '#f7fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#061b31',
      secondary: '#64748d',
    },
    divider: '#e5edf5',
    success: {
      main: '#15be53',
      light: '#e6f9ed',
      dark: '#108c3d',
    },
    error: {
      main: '#ea2261',
    },
  },
  typography: {
    fontFamily: [
      '"Inter"',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Noto Sans SC"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    /** 标题 — weight 300 + 负 letter-spacing（Stripe 标志风格） */
    h1: {
      fontWeight: 300,
      fontSize: '3rem',
      lineHeight: 1.15,
      letterSpacing: '-0.96px',
      color: '#061b31',
    },
    h2: {
      fontWeight: 300,
      fontSize: '2rem',
      lineHeight: 1.2,
      letterSpacing: '-0.64px',
      color: '#061b31',
    },
    h3: {
      fontWeight: 300,
      fontSize: '1.5rem',
      lineHeight: 1.25,
      letterSpacing: '-0.288px',
      color: '#061b31',
    },
    h4: {
      fontWeight: 400,
      fontSize: '1.25rem',
      lineHeight: 1.3,
      color: '#061b31',
    },
    h5: {
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.4,
      letterSpacing: '-0.01em',
      color: '#061b31',
    },
    h6: {
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#061b31',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.5,
      color: '#061b31',
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#273951',
    },
    body1: {
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#64748d',
    },
    body2: {
      fontWeight: 300,
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: '#64748d',
    },
    caption: {
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 1.5,
      color: '#64748d',
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 4,
  },
  shadows: [
    'none',
    SHADOWS.hover,
    SHADOWS.light,
    SHADOWS.card,
    ...Array(20).fill(SHADOWS.card),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFeatureSettings: '"ss01"',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: SHADOWS.card,
          borderRadius: 6,
          border: '1px solid #e5edf5',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 4,
          padding: '8px 16px',
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: SHADOWS.hover,
          },
        },
        outlined: {
          borderColor: '#b9b9f9',
          color: '#533afd',
          '&:hover': {
            borderColor: '#533afd',
            backgroundColor: 'rgba(83,58,253,0.04)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 4,
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
            '& fieldset': {
              borderColor: '#e5edf5',
            },
            '&:hover fieldset': {
              borderColor: '#b9b9f9',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#533afd',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#273951',
            fontWeight: 400,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontWeight: 500,
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid #e5edf5',
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          borderTop: '1px solid #e5edf5',
          height: 56,
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 400,
          '&.Mui-selected': {
            color: '#533afd',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme;
