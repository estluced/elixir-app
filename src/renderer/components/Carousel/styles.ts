import { styled, Button, Box } from '@mui/material'

export const NavigationContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'navigationPosition',
})<{ navigationPosition: 'bottom' | 'laterally' | 'inside' }>(
  ({ navigationPosition }) => ({
    ...(navigationPosition === 'bottom' && {
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
      gap: '10px',
    }),
    position: 'relative',
    zIndex: 3,
    ...(navigationPosition === 'laterally' && {
      button: {
        position: 'absolute',
        zIndex: 500,
        top: 'calc(50% - 60px)',
        '&:first-of-type': {
          left: '-35px',
        },
        '&:last-of-type': {
          right: '-35px',
        },
      },
    }),
    ...(navigationPosition === 'inside' && {
      position: 'absolute',
      display: 'flex',
      marginTop: '40px',
      width: '100%',
      justifyContent: 'center',
      gap: '10px',
      bottom: '50px',
      zIndex: 1,
    }),
  }),
)

export const NavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'navigationsColor',
})<{ navigationsColor: 'white' | 'black' }>(({ navigationsColor, theme }) => ({
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  padding: 0,
  minWidth: 'auto',
  ...(navigationsColor === 'white' && {
    svg: {
      stroke: theme.palette.text.primary,
    },
  }),
}))

export const CarouselWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'overflowHidden',
})<{ overflowHidden: boolean }>(({ theme, overflowHidden }) => ({
  ...(overflowHidden
    ? {}
    : {
        '.swiper': {
          overflow: 'visible',
        },
      }),
  '.swiper-pagination': {
    position: 'fixed',
    height: '8px',
    top: 0,
    right: '25px',
    zIndex: 999,
    display: 'grid',
    gap: '10px',
    span: {
      display: 'block',
      width: '12px',
      height: '12px',
      borderRadius: '50%',
    },
    '.swiper-pagination-bullet-active ': {
      backgroundColor: theme.palette.primary.main,
    },
    '.swiper-pagination-bullet:not(.swiper-pagination-bullet-active)': {
      backgroundColor: theme.palette.background.default,
      border: `1px solid ${theme.palette.primary.main}`,
    },
  },
}))

export const StyledGridSlide = styled(Box)({
  display: 'grid',
  gap: '45px',
  width: 'inherit',
  minHeight: 'max-content',
  '&>div': {
    width: 'inherit',
  },
})
