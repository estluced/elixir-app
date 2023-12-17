import { Box, styled } from '@mui/material'

export const ClientCardContainer = styled(Box)(({ theme }) => ({
  border: `3px solid #fff`,
  background: theme.palette.background.paper,
  borderRadius: '16px',
  overflow: 'hidden',
  position: 'relative',
  minWidth: '300px',
  img: {
    opacity: 0.5,
    position: 'relative',
    zIndex: 1,
    maxHeight: '100px',
    width: '100%',
    objectFit: 'cover',
  },
}))

export const ClientCardInfo = styled(Box)(({ theme }) => ({
  padding: '20px',
  position: 'relative',
  zIndex: 2,
  background: theme.palette.background.paper,
  borderRadius: '16px',
  marginTop: '-20px',
}))
