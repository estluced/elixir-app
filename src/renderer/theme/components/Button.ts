import { Components, Theme } from '@mui/material'

export default function Button(theme: Theme): Components['MuiButton'] {
  return {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 600,
      },
      contained: {
        '&.Mui-disabled': {
          backgroundColor: theme.palette.background.default,
          opacity: 0.6,
          color: theme.palette.text.primary,
        },
      },
      text: {
        borderRadius: '0',
        height: '100%',
      },
    },
  }
}
