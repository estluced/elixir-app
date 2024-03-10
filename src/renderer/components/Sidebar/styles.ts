import { Box, Paper, styled } from '@mui/material'
import Button from '@mui/material/Button'

export const SidebarContainer = styled(Paper)({
  margin: '10px',
  width: '60px',
  height: 'calc(100vh - 44px)',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 1201,
  appRegion: 'no-drag',
})

export const SidebarButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{
  active: boolean
}>(({ theme, active }) => ({
  transition: '0s !important',
  border: '2px solid transparent',
  minWidth: 'auto',
  height: '46px',
  borderRadius: '12px',
  ...(active
    ? {
        ...(theme.components.MuiPaper.styleOverrides.root as object),
        boxShadow:
          '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12) !important',
      }
    : {}),
}))
