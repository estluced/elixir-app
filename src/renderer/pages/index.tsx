import { useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Container, Grid } from '@mui/material'
import Main from './Main'
import { setClients } from '../store/clients/clientsSlice'
import { StrapiAttributes, StrapiDataMultiple } from '../../types/strapi'
import { Client } from '../../types/client'
import Auth from './Auth'
import usePreload from '../hooks/usePreload'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import SettingsModal from '../modals/Settings'
import MinecraftPage from './Minecraft'

const Pages = () => {
  const dispatch = useDispatch()
  const { bridge, accountJwt, installPath } = usePreload()

  useEffect(() => {
    bridge
      .sendMessage('core/library/get-clients')
      .on((clients: StrapiDataMultiple<StrapiAttributes<Client>>) => {
        dispatch(setClients(clients.data))
      })
  }, [])

  return (
    <HashRouter>
      <Header />
      <Container>
        {!!accountJwt?.length && (
          <>
            <Sidebar />
            <SettingsModal />
          </>
        )}
        <Routes>
          {accountJwt?.length ? (
            <>
              <Route path="/" element={<Main />} />
              <Route path="/minecraft" element={<MinecraftPage />} />
            </>
          ) : (
            <Route path="/" element={<Auth />} />
          )}
        </Routes>
      </Container>
    </HashRouter>
  )
}

export default Pages
