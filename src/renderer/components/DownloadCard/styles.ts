import { Box, Paper, styled } from '@mui/material'
import Button from '@mui/material/Button'

export const DownloadCardContainer = styled(Paper)({
  width: '300px',
  padding: '8px',
})

export const StyledProgress = styled('progress')(({ theme }) => ({
  appearance: 'none',
  borderRadius: '8px',
  border: `2px solid ${theme.palette.divider}`,
  transition: 'all 0.2s ease-in-out',
  zIndex: 0,
  width: 'calc(100% - 16px)',
  boxShadow:
    '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
  height: '30px',
  overflow: 'hidden',
  '&::-webkit-progress-bar': {
    background: theme.palette.background.paper,
  },
  '&::-webkit-progress-value': {
    backgroundColor: 'rgba(255, 82, 82, 1)',
    borderRadius: '0 6px 6px 0',
  },
  '&::-moz-progress-bar': {
    backgroundColor: theme.palette.primary.main,
    borderRadius: '8px',
  },
}))

export const ActionButton = styled(Button)(({ theme }) => ({
  ...(theme.components.MuiPaper.styleOverrides.root as object),
  padding: 0,
  aspectRatio: '1 / 1',
  minWidth: '30px',
  height: '30px',
  boxShadow:
    '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
}))
