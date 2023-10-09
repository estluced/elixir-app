import { Box } from '@mui/material'
import Button from '@mui/material/Button'
import { Close, Remove, DownloadForOffline } from '@mui/icons-material'
import { useDownloadCenter } from '../../providers/DownloadCenter'

function Header() {
  const { ipcRenderer } = window.electron
  const drag = { appRegion: 'drag' }
  const noDrag = { appRegion: 'no-drag' }
  const { handleOpenDownloadCenter, modalIsOpen } = useDownloadCenter()

  const minimizeApp = () => {
    ipcRenderer.sendMessage('app', ['minimize'])
  }

  const quitApp = () => {
    ipcRenderer.sendMessage('app', ['quit'])
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
        zIndex: 9,
        ...drag,
      }}
      display="flex"
      justifyContent="space-between"
      height="42px"
    >
      <Box />
      <Box sx={noDrag}>
        <Button
          onClick={triggerDownloadCenter}
          sx={{
            color: 'text.primary',
            minWidth: '50px',
          }}
        >
          <DownloadForOffline sx={{ fontSize: '22px' }} />
        </Button>
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
      </Box>
    </Box>
  )
}

export default Header
