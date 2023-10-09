import { Box, styled } from '@mui/material'

export const DownloadCardWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'expanded',
})<{ expanded: boolean }>(({ theme, expanded }) => ({
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  borderRadius: '8px',
  padding: '8px',
  display: 'grid',
  transition: 'all 0.2s ease-in-out',
  height: expanded ? '140px' : '60px',
  position: 'relative',
  overflow: 'hidden',
}))

export const StyledProgress = styled('progress')(({ theme }) => ({
  appearance: 'none',
  position: 'absolute',
  bottom: '5px',
  left: '8px',
  transition: 'all 0.2s ease-in-out',
  zIndex: 0,
  width: 'calc(100% - 16px)',
  height: '4px',
  borderRadius: '8px',
  '&::-webkit-progress-bar': {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
  },
  '&::-webkit-progress-value': {
    backgroundColor: 'rgba(255, 82, 82, 1)',
    borderRadius: '8px',
  },
  '&::-moz-progress-bar': {
    backgroundColor: theme.palette.primary.main,
    borderRadius: '8px',
  },
}))
