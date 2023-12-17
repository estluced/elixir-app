import { Box, Container, Grid, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { MainContainer } from './styles'
import usePreload from '../../hooks/usePreload'
import { RootState } from '../../store'
import ClientCard from '../../components/ClientCard'
import ClientsNavigation from '../../components/ClientsNavigation'
import Image from '../../components/Image'

const MainPage = () => {
  const { account } = usePreload()
  const clients = useSelector((state: RootState) => state.clients.clients)

  console.log(clients)

  return (
    <MainContainer>
      <Box />
      <ClientsNavigation />
    </MainContainer>
  )
}

export default MainPage
