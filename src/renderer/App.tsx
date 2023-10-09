import 'swiper/css'
import 'swiper/css/grid'
import 'swiper/css/autoplay'
import 'swiper/css/parallax'
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { useEffect, useState } from 'react'
import Header from './components/Header'
import theme from './theme'
import SelectFolderModal from './modals/SelectFolder'
import { DownloadCenterProvider } from './providers/DownloadCenter'
import DownloadCenterModal from './modals/DownloadCenter'
import ProductsNavigation from './components/ProductsNavigation'
import { ProductsProvider } from './providers/Products'
import ProductScreen from './screens/Product'

export default function App() {
  const { store } = window.electron
  const [selectFolderModalOpen, setSelectFolderModalOpen] =
    useState<boolean>(false)

  useEffect(() => {
    const path = store.get('installation-path')
    if (!path || path?.length < 1) setSelectFolderModalOpen(true)
  }, [window])

  const handleCloseSelectFolderModal = () => {
    setSelectFolderModalOpen(false)
  }

  return (
    <ThemeProvider theme={theme}>
      <DownloadCenterProvider>
        <CssBaseline />
        <Header />
        <Router>
          <ProductsProvider>
            <Routes>
              <Route path="/" element={<ProductScreen />} />
            </Routes>
            <ProductsNavigation />
          </ProductsProvider>
        </Router>
        <DownloadCenterModal />
        <SelectFolderModal
          isOpen={selectFolderModalOpen}
          handleClose={handleCloseSelectFolderModal}
        />
      </DownloadCenterProvider>
    </ThemeProvider>
  )
}
