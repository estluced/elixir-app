import { Components } from '@mui/material'

export default function CssBaseLine(): Components['MuiCssBaseline'] {
  return {
    styleOverrides: {
      '*::-webkit-scrollbar': {
        width: '6px',
      },
      '*::-webkit-scrollbar-track': {},
      '*::-webkit-scrollbar-thumb': {
        backgroundColor: '#555555',
        borderRadius: '4px',
      },
      body: {
        margin: 0,
        overflowX: 'hidden',
      },
      '*': {
        userSelect: 'none',
        fontFamily: "'Nunito', sans-serif !important",
      },
    },
  }
}
