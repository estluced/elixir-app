import 'swiper/css'
import 'swiper/css/grid'
import 'swiper/css/autoplay'
import 'swiper/css/parallax'
import { Box, CssBaseline, ThemeProvider } from '@mui/material'
import { useState } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import Header from './components/Header'
import theme from './theme'
import SelectFolderModal from './modals/SelectFolder'
import { DownloadCenterProvider } from './providers/DownloadCenter'
import DownloadCenterModal from './modals/DownloadCenter'
import { store as reduxRtkStore } from './store'
import Pages from './pages'
import { AppBackground, AppBackgroundContainer, AppContainer } from './styles'
import Background from './assets/background.webp'
import Image from './components/Image'
import DownloadsHOC from './store/downloads/hoc'

export default function App() {
  const { store } = window.electron
  const [selectFolderModalOpen, setSelectFolderModalOpen] =
    useState<boolean>(false)
  const path = store.get('installation-path')

  const handleCloseSelectFolderModal = () => {
    setSelectFolderModalOpen(false)
  }

  return (
    <ReduxProvider store={reduxRtkStore}>
      <DownloadsHOC />
      <ThemeProvider theme={theme}>
        <DownloadCenterProvider>
          <AppContainer>
            <AppBackgroundContainer>
              <Image src={Background} disableApi />
            </AppBackgroundContainer>
            <CssBaseline />
            <Header />
            <Box id="pages-root">
              <Pages />
            </Box>
            {path?.length && (
              <>
                <DownloadCenterModal />
                <SelectFolderModal
                  isOpen={selectFolderModalOpen}
                  handleClose={handleCloseSelectFolderModal}
                />
              </>
            )}
          </AppContainer>
        </DownloadCenterProvider>
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
