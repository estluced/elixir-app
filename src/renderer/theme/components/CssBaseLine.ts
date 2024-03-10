import { Components } from '@mui/material'

export default function CssBaseLine(): Components['MuiCssBaseline'] {
  return {
    styleOverrides: {
      '::-webkit-scrollbar': {
        display: 'none',
      },
      '#pages-root': {
        position: 'inherit !important',
      },
      body: {
        margin: 0,
        overflowX: 'hidden',
        backgroundColor: '#111111 !important',
      },
      '*': {
        userSelect: 'none',
        fontFamily: "'Nunito', sans-serif !important",
      },
    },
  }
}
