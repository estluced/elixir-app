import { Components, Theme } from '@mui/material'

export default function TextField(theme: Theme): Components['MuiTextField'] {
  return {
    styleOverrides: {
      root: {
        '.MuiFormLabel-root': {
          color: theme.palette.text.primary,
        },
        '.MuiInputBase-root': {
          outline: 'none',
          fieldset: {
            borderColor: theme.palette.primary.main,
          },
          '&.MuiOutlinedInput-root ': {
            borderRadius: '8px',
          },
        },
      },
    },
  }
}
