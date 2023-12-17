import { Components, Theme } from '@mui/material'

export default function Chip(theme: Theme): Components['MuiChip'] {
  return {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 600,
      },
      outlined: {
        backgroundColor: 'transparent',
        color: theme.palette.primary.main,
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: '16px',
        padding: '3px 8px',
        fontSize: '10px',
        height: 'auto',
        span: {
          padding: 0,
        },
      },
    },
  }
}
