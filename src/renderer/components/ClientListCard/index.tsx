import { Box, Chip, Grid, Typography } from '@mui/material'
import { Client } from '../../../types/client'
import {
  ClientListCardContainer,
  ClientPosterContainer,
  ClientTitle,
} from './styles'
import Image from '../Image'
import StrapiMedia from '../StrapiMedia'

const ClientListCard = ({ poster, title, version, keywords }: Client) => {
  return (
    <ClientListCardContainer>
      <ClientPosterContainer>
        <StrapiMedia {...poster.data} />
      </ClientPosterContainer>
      <ClientTitle>
        <Typography>{title}</Typography>
        <Grid container gap="4px">
          <Chip variant="outlined" label={version.data.attributes.version} />
          {keywords.data.slice(0, 1).map((keyword) => (
            <Chip
              key={`keyword-${keyword.id}`}
              variant="outlined"
              label={keyword.attributes.title}
            />
          ))}
        </Grid>
      </ClientTitle>
    </ClientListCardContainer>
  )
}

export default ClientListCard
