import { Grid, Paper, Typography, Switch } from '@mui/material'
import { useEffect, useState } from 'react'
import usePreload from '../../../../hooks/usePreload'
import { Settings } from '../../../../../types/settings'

const SwitchButton = ({
  label,
  checked,
  onClick,
}: {
  label: string
  checked: boolean
  onClick: () => void
}) => (
  <Grid
    container
    component={Paper}
    onClick={onClick}
    direction="row"
    justifyContent="space-between"
    alignItems="center"
    sx={{
      padding: '5px 10px 5px 16px',
      cursor: 'pointer',
    }}
  >
    <Typography fontWeight={600}>{label}</Typography>
    <Switch checked={checked} />
  </Grid>
)

const GameSettings = () => {
  const { localStore } = usePreload()
  const [gameSettings, setGameSettings] = useState<Settings>({
    shell: false,
    fullscreen: undefined,
    minRam: 0,
    maxRam: 0,
  })

  useEffect(() => {
    const shellFromStore = localStore.get('shell')
    const fullscreenFromStore = localStore.get('fullscreen')
    const minRamFromStore = localStore.get('minRam')
    const maxRamFromStore = localStore.get('maxRam')
    setGameSettings({
      shell: shellFromStore || false,
      fullscreen: fullscreenFromStore || undefined,
      minRam: minRamFromStore || 0,
      maxRam: maxRamFromStore || 0,
    })
  }, [])

  const onChangeShell = () => {
    localStore.set('shell', !gameSettings.shell)
    setGameSettings({ ...gameSettings, shell: !gameSettings.shell })
  }

  const onChangeFullscreen = () => {
    const fullscreen = !gameSettings.fullscreen || undefined
    localStore.set('fullscreen', fullscreen)
    setGameSettings({ ...gameSettings, fullscreen })
  }

  return (
    <Paper
      sx={{
        padding: '30px 20px',
      }}
      component={Grid}
      container
      direction="column"
      wrap="nowrap"
      gap="10px"
    >
      <Typography
        textAlign="center"
        mb="10px"
        p="0 20px"
        variant="h5"
        fontWeight={600}
      >
        Launch settings
      </Typography>
      <SwitchButton
        label="Console"
        checked={gameSettings.shell}
        onClick={onChangeShell}
      />
      <SwitchButton
        label="Fullscreen"
        checked={gameSettings.fullscreen}
        onClick={onChangeFullscreen}
      />
    </Paper>
  )
}

export default GameSettings
