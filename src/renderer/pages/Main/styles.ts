import { Box, styled, Button } from '@mui/material'

export const MainContainer = styled(Box)({
  position: 'relative',
  zIndex: 2,
})

export const ClientBackgroundContainer = styled(Box, {
  shouldForwardProp: (props) => props !== 'enableGrayFilter',
})<{ enableGrayFilter: boolean }>(({ enableGrayFilter }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 1,
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: `brightness(0.3) ${enableGrayFilter ? 'grayscale(1)' : ''}`,
  },
}))

export const ClientOverviewContainer = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '65% 35%',
})

export const ExpandMoreButton = styled(Button)({
  borderRadius: '50%',
  padding: '8px',
  border: '1.5px solid #fff',
  margin: '0 auto',
  minWidth: 'auto',
  svg: {
    color: '#fff',
  },
})
