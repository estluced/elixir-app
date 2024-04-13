import { Box, styled } from '@mui/material'

export const UpdateOverlayBackdrop = styled(Box)(() => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backdropFilter: 'blur(10px)',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  zIndex: 999999,
  transition: 'all 0.3s',
}))

export const UpdateOverlaySpinner = styled(Box)(() => ({
  '.ap': { width: '6em', height: '12em' },
  '.ap__ring': {
    stroke: 'hsla(0, 100%, 66%, 0.15)',
    transition: 'stroke 0.3s',
  },
  '.ap__worm1, .ap__worm2': {
    animationDuration: '3s',
    animationIterationCount: 'infinite',
  },
  '.ap__worm1': { animationName: 'worm1' },
  '.ap__worm2': { animationName: 'worm2', visibility: 'hidden' },
  '@keyframes worm1': {
    from: { animationTimingFunction: 'ease-in-out', strokeDashoffset: -87.96 },
    '20%': { animationTimingFunction: 'ease-in', strokeDashoffset: 0 },
    '60%': { strokeDashoffset: -791.68, visibility: 'visible' },
    '60.1%, to': { strokeDashoffset: -791.68, visibility: 'hidden' },
  },
  '@keyframes worm2': {
    'from, 60%': { strokeDashoffset: -87.96, visibility: 'hidden' },
    '60.1%': {
      animationTimingFunction: 'cubic-bezier(0,0,0.5,0.75)',
      strokeDashoffset: -87.96,
      visibility: 'visible',
    },
    '77%': {
      animationTimingFunction: 'cubic-bezier(0.5,0.25,0.5,0.88)',
      strokeDashoffset: -340,
      visibility: 'visible',
    },
    to: { strokeDashoffset: -669.92, visibility: 'visible' },
  },
}))

export const UpdateOverlayContainer = styled(Box)(() => ({
  position: 'absolute',
  zIndex: 9999999,
  width: '100%',
  height: '100%',
  display: 'flex',
  marginTop: '-3em',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  textAlign: 'center',
  gap: '20px',
  transition: 'all 0.3s',
}))
