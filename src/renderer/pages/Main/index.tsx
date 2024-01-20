import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import {
  ClientBackgroundContainer,
  ClientOverviewContainer,
  MainContainer,
} from './styles'
import usePreload from '../../hooks/usePreload'
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

  useEffect(() => {
    if (clients.length) {
      setActiveClient(clients[0])
      setActiveClientBackground(clients[0].attributes.background.data)
    }
  }, [clients])

  const handleSetActiveClient = (clientId: number) => {
    const client = clients.find((client) => client.id === clientId)
    setActiveClient(client)
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
          {activeClient?.attributes && (
            <ClientOverview {...activeClient.attributes} />
          )}
          <ClientsNavigation handleSetActiveClient={handleSetActiveClient} />
        </ClientOverviewContainer>
      </MainContainer>
    </>
  )
}

export default MainPage
