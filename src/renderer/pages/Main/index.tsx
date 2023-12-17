import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { ExpandMoreRounded } from '@mui/icons-material'
import Button from '@mui/material/Button'
import { Box, Grid, Typography } from '@mui/material'
import {
  ClientBackgroundContainer,
  ClientOverviewContainer,
  ExpandMoreButton,
  MainContainer,
} from './styles'
import usePreload from '../../hooks/usePreload'
import { RootState } from '../../store'
import ClientsNavigation from '../../components/ClientsNavigation'
import Image from '../../components/Image'
import { Client } from '../../../types/client'
import { StrapiAttributes } from '../../../types/strapi'
import ClientOverview from '../../components/ClientOverview'

const MainPage = () => {
  const { account } = usePreload()
  const clients = useSelector((state: RootState) => state.clients.clients)
  const [activeClient, setActiveClient] = useState<StrapiAttributes<Client>>()
  const [activeClientBackground, setActiveClientBackground] = useState<string>()

  useEffect(() => {
    if (clients.length) {
      setActiveClient(clients[0])
      setActiveClientBackground(
        clients[0].attributes.background?.data?.attributes?.url,
      )
    }
  }, [clients])

  const handleSetActiveClient = (clientId: number) => {
    const client = clients.find((client) => client.id === clientId)
    setActiveClient(client)
    setActiveClientBackground(
      client?.attributes.background?.data?.attributes?.url,
    )
  }

  return (
    <>
      {activeClientBackground && (
        <ClientBackgroundContainer
          enableGrayFilter={!activeClient.attributes.available}
        >
          <Image src={activeClientBackground} />
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
