import { Box, styled } from '@mui/material'

export const AppContainer = styled(Box)(({ theme }) => ({
  '#pages-root': {
    position: 'relative',
    zIndex: 1,
  },
}))

export const AppBackgroundContainer = styled(Box)({
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
  position: 'absolute',
  zIndex: 0,
  top: 0,
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'blur(10px)',
    transform: 'scale(1.1)',
  },
})
