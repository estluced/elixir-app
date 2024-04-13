import { Grid } from '@mui/material'
import Button from '@mui/material/Button'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import usePreload from '../../../../hooks/usePreload'
import { toggleSettingsModal } from '../../../../store/app/modalsSlice'

const LauncherSettings = () => {
  const { localStore, bridge } = usePreload()
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(toggleSettingsModal())
    localStore.set('account', null)
    localStore.set('_jwt', null)
    window.location.reload()
  }

  const handleClearCache = () => {
    bridge.sendMessage('helpers/clear-cache')
    dispatch(toggleSettingsModal())
    toast('Cache cleared', { type: 'success' })
  }

  const checkForUpdates = () => {
    bridge.sendMessage('check-for-updates')
    dispatch(toggleSettingsModal())
  }

  return (
    <Grid container direction="column" gap="10px">
      <Button variant="contained" fullWidth onClick={handleClearCache}>
        Clear cache
      </Button>
      <Button variant="contained" fullWidth onClick={checkForUpdates}>
        Check for updates
      </Button>
      <Button
        variant="contained"
        color="error"
        fullWidth
        onClick={handleLogout}
      >
        Log out
      </Button>
    </Grid>
  )
}

export default LauncherSettings
