import { Box, Typography } from '@mui/material'
import { Client } from '../../../types/client'
import { ClientCardContainer, ClientCardInfo } from './styles'
import Image from '../Image'

const ClientCard = ({ title, screenshots }: Client) => {
  return (
    <ClientCardContainer>
      <Image src={screenshots.data[0].attributes.url} />
      <ClientCardInfo>
        <Typography variant="h6">{title}</Typography>
      </ClientCardInfo>
    </ClientCardContainer>
  )
}

export default ClientCard
