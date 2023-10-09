import { Box, styled } from '@mui/material'

export const ProductWrapper = styled(Box)(({ theme }) => ({
  display: 'grid',
  maxWidth: '60vw',
  margin: '0 auto',
  position: 'relative',
  zIndex: 1,
  marginBottom: '150px',
  gap: '20px',
}))
