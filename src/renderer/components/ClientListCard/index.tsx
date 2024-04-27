import { Chip, Grid, Typography } from '@mui/material'
import { Client } from '../../../types/client'
import {
  ClientListCardContainer,
  ClientPosterContainer,
  ClientTitle,
} from './styles'
import StrapiMedia from '../StrapiMedia'

const ClientListCard = ({
  poster,
  title,
  minecraftVersion,
  keywords,
  status,
}: Client) => {
  return (
    <ClientListCardContainer status={status}>
      <ClientPosterContainer>
        <StrapiMedia {...poster.data} />
      </ClientPosterContainer>
      <ClientTitle>
        <Typography fontWeight={600}>{title}</Typography>
        <Grid container gap="4px">
          <Chip
            variant="outlined"
            label={minecraftVersion.data.attributes.version}
          />
          {keywords.data.slice(0, 2).map((keyword) => (
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
