import 'swiper/css'
import 'swiper/css/grid'
import 'swiper/css/autoplay'
import 'swiper/css/parallax'
import 'react-toastify/dist/ReactToastify.min.css'
import { Box, CssBaseline, ThemeProvider } from '@mui/material'
import { useEffect, useState } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'
import theme from './theme'
import SelectFolderModal from './modals/SelectFolder'
import { DownloadCenterProvider } from './providers/DownloadCenter'
import { store as reduxRtkStore } from './store'
import Pages from './pages'
import { AppContainer } from './styles'
import usePreload from './hooks/usePreload'
import UpdateOverlay from './components/UpdateOverlay'

export default function App() {
  const { localStore, bridge } = usePreload()
  const [selectFolderModalOpen, setSelectFolderModalOpen] =
    useState<boolean>(false)
  const path = localStore.get('installation-path')

  useEffect(() => {
    bridge.sendMessage('check-for-updates', {
      shouldInform: false,
    })

    bridge.on('core/error', ({ message }) => {
      toast.error(message.message || message || 'An error occurred')
    })

    bridge.on('core/info', ({ message }) => {
      toast.info(message)
    })

    bridge.on('core/warn', ({ message }) => {
      toast.warn(message)
    })

    bridge.on('core/success', ({ message }) => {
      toast.success(message)
    })
  }, [])

  const handleCloseSelectFolderModal = () => {
    setSelectFolderModalOpen(false)
  }

  return (
    <ReduxProvider store={reduxRtkStore}>
      <ThemeProvider theme={theme}>
        <UpdateOverlay />
        <DownloadCenterProvider>
          <AppContainer>
            <CssBaseline />
            <Box id="pages-root">
              <Pages />
            </Box>
            {path?.length && (
              <SelectFolderModal
                isOpen={selectFolderModalOpen}
                handleClose={handleCloseSelectFolderModal}
              />
            )}
          </AppContainer>
        </DownloadCenterProvider>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          closeOnClick
          stacked
          limit={3}
          theme="dark"
        />
      </ThemeProvider>
    </ReduxProvider>
  )
}
