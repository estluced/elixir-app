import { Box, Grid } from '@mui/material'
import Button from '@mui/material/Button'
import { Close, Remove, DownloadForOffline } from '@mui/icons-material'
import { useDownloadCenter } from '../../providers/DownloadCenter'
import AccountMenu from './AccountMenu'
import usePreload from '../../hooks/usePreload'

function Header() {
  const { bridge, account, installPath } = usePreload()
  const drag = { appRegion: 'drag' }
  const noDrag = { appRegion: 'no-drag' }
  const { handleOpenDownloadCenter, modalIsOpen } = useDownloadCenter()

  const minimizeApp = () => {
    bridge.sendMessage('app', ['minimize'])
  }

  const quitApp = () => {
    bridge.sendMessage('app', ['quit'])
  }

  const triggerDownloadCenter = () => {
    if (!modalIsOpen) {
      handleOpenDownloadCenter()
    }
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        width: '100%',
        top: 0,
        zIndex: 9,
        ...drag,
      }}
      display="flex"
      justifyContent="space-between"
      height="42px"
    >
      <Box width="100%" />
      <Grid justifyContent="flex-end" container sx={noDrag} wrap="nowrap">
        {installPath?.length && account && (
          <Button
            onClick={triggerDownloadCenter}
            sx={{
              color: 'text.primary',
              minWidth: '50px',
            }}
          >
            <DownloadForOffline sx={{ fontSize: '22px' }} />
          </Button>
        )}
        <AccountMenu />
        <Button
          sx={{
            color: 'text.primary',
          }}
          onClick={minimizeApp}
        >
          <Remove sx={{ fontSize: '16px' }} />
        </Button>
        <Button
          sx={{
            color: 'text.primary',
          }}
          onClick={quitApp}
        >
          <Close sx={{ fontSize: '16px' }} />
        </Button>
      </Grid>
    </Box>
  )
}

export default Header
