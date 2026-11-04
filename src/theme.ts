import { alpha, createTheme } from '@mui/material/styles'

// Extra palette slots used by the "Dailly English" design.
declare module '@mui/material/styles' {
  interface Palette {
    accent: Palette['primary']
  }
  interface PaletteOptions {
    accent?: PaletteOptions['primary']
  }
  interface TypeBackground {
    muted: string
    sidebar: string
  }
}

const PRIMARY = '#194C31'
const FOREGROUND = '#0F2418'
const MUTED_FOREGROUND = '#617066'
const BORDER = '#D4E2D6'
const MUTED = '#F1EFE6'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: PRIMARY,
      light: '#3B7453',
      dark: '#103420',
      contrastText: '#FCFAF2',
    },
    secondary: {
      main: '#DFEFE1',
      contrastText: '#193525',
    },
    accent: {
      main: '#EDD5A1',
      light: '#F6E9CC',
      contrastText: '#173B27',
    },
    success: {
      main: '#008C55',
      contrastText: '#FBFEFC',
    },
    error: {
      main: '#D92D20',
    },
    warning: {
      main: '#AD6039',
      light: '#F8EAD3',
    },
    background: {
      default: '#F9F8F1',
      paper: '#FFFFFF',
      muted: MUTED,
      sidebar: '#F5F2E5',
    },
    text: {
      primary: FOREGROUND,
      secondary: MUTED_FOREGROUND,
    },
    divider: BORDER,
    action: {
      hover: alpha(PRIMARY, 0.05),
      selected: '#DFEFE1',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily:
      '"Be Vietnam Pro", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: { fontWeight: 600, letterSpacing: '-0.05em' },
    h2: { fontWeight: 600, letterSpacing: '-0.05em' },
    h3: { fontWeight: 700, letterSpacing: '-0.05em' },
    h4: { fontWeight: 600, letterSpacing: '-0.04em' },
    h5: { fontWeight: 600, letterSpacing: '-0.035em' },
    h6: { fontWeight: 600, letterSpacing: '-0.02em' },
    overline: {
      fontSize: '0.68rem',
      fontWeight: 600,
      letterSpacing: '0.18em',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          minWidth: 320,
          minHeight: '100vh',
          WebkitFontSmoothing: 'antialiased',
        },
        '*': {
          boxSizing: 'border-box',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 12,
          minHeight: 40,
        },
        sizeLarge: {
          minHeight: 48,
          fontSize: 15,
        },
        outlined: {
          borderColor: alpha(PRIMARY, 0.4),
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#FFFFFF',
          boxShadow: '0 1px 2px rgba(15, 36, 24, 0.04)',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: BORDER,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: 1,
            borderColor: PRIMARY,
            boxShadow: `0 0 0 3px ${alpha(PRIMARY, 0.15)}`,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        outlined: {
          borderColor: BORDER,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 8,
          borderRadius: 999,
          backgroundColor: MUTED,
        },
        bar: {
          borderRadius: 999,
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          padding: 4,
          gap: 2,
          borderRadius: 12,
          border: `1px solid ${BORDER}`,
          backgroundColor: '#FFFFFF',
        },
        grouped: {
          border: 0,
          borderRadius: '8px !important',
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          height: 36,
          paddingInline: 12,
          fontSize: 14,
          fontWeight: 600,
          textTransform: 'none',
          color: MUTED_FOREGROUND,
          '&.Mui-selected': {
            color: PRIMARY,
            backgroundColor: '#DFEFE1',
          },
          '&.Mui-selected:hover': {
            backgroundColor: '#D2E7D5',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          border: `1px solid ${BORDER}`,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
  },
})
