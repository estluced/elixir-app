import { Box, Grid } from '@mui/material'
import Button from '@mui/material/Button'
import { Close, Remove } from '@mui/icons-material'
import usePreload from '../../hooks/usePreload'

function Header() {
  const { bridge } = usePreload()
  const drag = { appRegion: 'drag' }
  const noDrag = { appRegion: 'no-drag' }

  const minimizeApp = () => {
    bridge.sendMessage('app', ['minimize'])
  }

  const quitApp = () => {
    bridge.sendMessage('app', ['quit'])
  }

  return (
    <Grid
      container
      justifyContent="space-between"
      sx={{
        position: 'fixed',
        width: '100%',
        top: 0,
        zIndex: 9,
        height: '42px',
        ...drag,
      }}
    >
      <Box sx={drag} />
      <Grid
        justifyContent="flex-end"
        width="auto"
        sx={{
          height: '100%',
          ...noDrag,
        }}
        container
        wrap="nowrap"
      >
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
    </Grid>
  )
}

export default Header
