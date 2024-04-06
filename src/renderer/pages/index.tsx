import { HashRouter, Routes, Route } from 'react-router-dom'
import { Container } from '@mui/material'
import { useEffect } from 'react'
import { connect } from 'react-redux'
import Main from './Main'
import Auth from './Auth'
import usePreload from '../hooks/usePreload'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import SettingsModal from '../modals/Settings'
import MinecraftPage from './Minecraft'
import SetupPage from './Setup'
import { StrapiAttributes, StrapiDataMultiple } from '../../types/strapi'
import { Client } from '../../types/client'
import { setActiveClient, setClients } from '../store/clients/clientsSlice'
import { RootState } from '../store'

interface PagesProps {
  activeClient: Client
  setActiveClient: (clientId: number) => void
  setClients: (clients: StrapiAttributes<Client>[]) => void
}

const Pages = ({ activeClient, setActiveClient, setClients }: PagesProps) => {
  const { bridge } = usePreload()
  const { accountJwt, setupIsComplete } = usePreload()

  useEffect(() => {
    bridge
      .sendMessage('core/library/get-clients')
      .on((clientsResponse: StrapiDataMultiple<StrapiAttributes<Client>>) => {
        bridge
          .sendMessage('core/library/get-clients-statuses', clientsResponse)
          .on((clientsWithStatuses: StrapiAttributes<Client>[]) => {
            setClients(
              clientsWithStatuses.sort(
                (a, b) =>
                  new Date(b?.attributes.createdAt).getTime() -
                  new Date(a?.attributes.createdAt).getTime(),
              ),
            )
            if (!activeClient) setActiveClient(clientsWithStatuses[0].id)
          })
      })
  }, [])

  return (
    <HashRouter>
      <Header />
      <Container>
        {setupIsComplete ? (
          <>
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
          </>
        ) : (
          <SetupPage />
        )}
      </Container>
    </HashRouter>
  )
}

export default connect(
  (state: RootState) => ({
    activeClient: state.clients.activeClient?.attributes,
  }),
  (dispatch) => ({
    setActiveClient: (clientId: number) => dispatch(setActiveClient(clientId)),
    setClients: (clients: StrapiAttributes<Client>[]) =>
      dispatch(setClients(clients)),
  }),
)(Pages)
