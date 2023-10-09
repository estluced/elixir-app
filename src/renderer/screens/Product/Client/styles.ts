import { Box, Select, styled } from '@mui/material'

export const ProductWrapper = styled(Box)(({ theme }) => ({
  display: 'grid',
  maxWidth: '60vw',
  margin: '0 auto',
  position: 'relative',
  zIndex: 1,
  marginBottom: '150px',
  gap: '20px',
}))

export const StyledSelectVersion = styled(Select)(({ theme }) => ({
  border: 'none !important',
  fieldset: {
    borderColor: 'transparent !important',
  },
  '.MuiSelect-select': {
    padding: '10px 40px 10px 10px !important',
    color: theme.palette.text.primary,
    fontSize: '14px',
    fontWeight: 'bold',
  },
  '.MuiSelect-icon': {
    transform: 'rotate(270deg)',
    fontSize: '24px',
    color: theme.palette.text.primary,
    '&.MuiSelect-iconOpen': {
      transform: 'rotate(90deg)',
    },
  },
}))
