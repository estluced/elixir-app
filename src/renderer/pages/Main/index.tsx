import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import {
  ClientBackgroundContainer,
  ClientOverviewContainer,
  MainContainer,
} from './styles'
import { RootState } from '../../store'
import ClientsNavigation from '../../components/ClientsNavigation'
import { Client } from '../../../types/client'
import {
  StrapiAttributes,
  StrapiMedia as IStrapiMedia,
} from '../../../types/strapi'
import ClientOverview from '../../components/ClientOverview'
import StrapiMedia from '../../components/StrapiMedia'

const MainPage = () => {
  const clients = useSelector((state: RootState) => state.clients.clients)
  const [activeClient, setActiveClient] = useState<StrapiAttributes<Client>>()
  const [activeClientBackground, setActiveClientBackground] =
    useState<StrapiAttributes<IStrapiMedia>>()
  const location = useLocation()

  useEffect(() => {
    if (clients.length) {
      setActiveClient(clients[0])
      setActiveClientBackground(clients[0].attributes.background.data)
    }
  }, [clients])

  const handleSetActiveClient = (clientId: number) => {
    const client = clients.find((client) => client.id === clientId)
    location.pathname = `/${client?.id}`
    setActiveClientBackground(client?.attributes.background.data)
  }

  return (
    <>
      {activeClientBackground && (
        <ClientBackgroundContainer
          enableGrayFilter={!activeClient.attributes.available}
        >
          <StrapiMedia {...activeClientBackground} />
        </ClientBackgroundContainer>
      )}
      <MainContainer>
        <ClientOverviewContainer>
          {Boolean(clients.length) && (
            <Routes>
              <Route
                index
                path="/"
                element={<ClientOverview {...clients[0].attributes} />}
              />
              {clients.map((client) => (
                <Route
                  key={client.id}
                  path={`/${client.id}`}
                  element={<ClientOverview {...client.attributes} />}
                />
              ))}
            </Routes>
          )}
          <ClientsNavigation handleSetActiveClient={handleSetActiveClient} />
        </ClientOverviewContainer>
      </MainContainer>
    </>
  )
}

export default MainPage
