import 'swiper/css'
import 'swiper/css/grid'
import 'swiper/css/autoplay'
import 'swiper/css/parallax'
import 'react-toastify/dist/ReactToastify.min.css'
import { Box, CssBaseline, ThemeProvider } from '@mui/material'
import { useEffect, useState } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'
import Header from './components/Header'
import theme from './theme'
import SelectFolderModal from './modals/SelectFolder'
import { DownloadCenterProvider } from './providers/DownloadCenter'
import { store as reduxRtkStore } from './store'
import Pages from './pages'
import { AppContainer } from './styles'
import usePreload from './hooks/usePreload'
import SettingsModal from './modals/Settings'

export default function App() {
  const { localStore, bridge } = usePreload()
  const [selectFolderModalOpen, setSelectFolderModalOpen] =
    useState<boolean>(false)
  const path = localStore.get('installation-path')

  useEffect(() => {
    bridge.on('core/error', ({ error }) => {
      toast.error(error.message || error || 'An error occurred')
    })
  }, [])

  const handleCloseSelectFolderModal = () => {
    setSelectFolderModalOpen(false)
  }

  return (
    <ReduxProvider store={reduxRtkStore}>
      <ThemeProvider theme={theme}>
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

// <Routes>
//   {path?.length ? (
//     <Route path="/" element={<ProductScreen />} />
//   ) : (
//     <Route path="/" element={<SetupScreen />} />
//   )}
// </Routes>
