import { Drawer, Grid } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import AccountSettings from './sections/Account'
import LaunchSettings from './sections/Launch'
import { RootState } from '../../store'
import { toggleSettingsModal } from '../../store/app/modalsSlice'
import SkinEditor from '../../components/SkinEditor'
import ClientsFolder from './sections/ClientsFolder'
import RAMSettings from './sections/RAM'
import LauncherSettings from './sections/Launcher'

const SettingsModal = () => {
  const dispatch = useDispatch()

  const settingsIsOpen = useSelector(
    (state: RootState) => state.modals.settings,
  )

  const handleToggleSettingsModal = () => dispatch(toggleSettingsModal())

  return (
    <Drawer
      open={settingsIsOpen}
      keepMounted
      elevation={1}
      onClose={handleToggleSettingsModal}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        },
      }}
      PaperProps={{
        sx: {
          border: 'none',
          background: 'transparent',
          boxShadow: 'none',
          marginLeft: '90px',
          marginTop: '10px',
          marginBottom: '34px',
          width: '324px',
          height: 'calc(100% - 44px)',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      }}
    >
      <Grid width="auto" container gap="20px" direction="column">
        <AccountSettings />
        <SkinEditor width={324} />
        <ClientsFolder />
        <LaunchSettings />
        <RAMSettings />
        <LauncherSettings />
      </Grid>
    </Drawer>
  )
}

export default SettingsModal
