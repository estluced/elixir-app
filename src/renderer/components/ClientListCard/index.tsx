import { Box, Chip, Grid, Typography } from '@mui/material'
import { Client } from '../../../types/client'
import {
  ClientListCardContainer,
  ClientPosterContainer,
  ClientTitle,
} from './styles'
import Image from '../Image'

const ClientListCard = ({ poster, title, version, keywords }: Client) => {
  return (
    <ClientListCardContainer>
      <ClientPosterContainer>
        <Image src={poster.data.attributes.url} />
      </ClientPosterContainer>
      <ClientTitle>
        <Typography>{title}</Typography>
        <Grid container gap="4px">
          <Chip variant="outlined" label={version.data.attributes.version} />
          {keywords.data.map((keyword) => (
            <Chip variant="outlined" label={keyword.attributes.title} />
          ))}
        </Grid>
      </ClientTitle>
    </ClientListCardContainer>
  )
}

export default ClientListCard
