import { Box, Typography, Button, Paper, Chip, Grid } from '@mui/material'
import { PlayCircle } from '@mui/icons-material'
import marked from 'marked'
import { Client } from '../../../types/client'
import { ClientOverviewContainer, PlayButton } from './styles'
import { Carousel } from '../Carousel'
import Image from '../Image'

const ClientOverview = ({
  title,
  shortDescription,
  description,
  screenshots,
  keywords,
  available,
}: Client) => {
  const parsedDescription = marked.parse(description)

  return (
    <ClientOverviewContainer>
      <Typography variant="h2" fontWeight={700}>
        {title}
      </Typography>
      <Typography
        sx={{
          maxWidth: '400px',
        }}
      >
        {shortDescription}
      </Typography>
      {keywords?.data && (
        <Grid container gap="8px">
          {keywords.data.map((keyword) => (
            <Chip
              key={`keyword-${keyword.id}`}
              variant="outlined"
              label={keyword.attributes.title}
            />
          ))}
        </Grid>
      )}
      {available && (
        <Box mt="5px">
          <PlayButton>
            <PlayCircle
              sx={{
                marginRight: '5px',
              }}
            />
            <Typography fontWeight={800} lineHeight="14px" fontSize="14px">
              Play
            </Typography>
          </PlayButton>
        </Box>
      )}
      <Box
        mt="20px"
        mb="20px"
        sx={{
          img: {
            width: '100%',
            height: 'auto',
          },
        }}
        dangerouslySetInnerHTML={{
          __html: parsedDescription,
        }}
      />
      <Carousel slidesPerView={1} allowTouchMove autoPlay speed={600}>
        {screenshots.data?.map((screenshot) => (
          <Box
            key={screenshot.id}
            sx={{
              height: '300px',
              borderRadius: '8px',
              width: '100%',
              overflow: 'hidden',
            }}
          >
            <Image
              src={screenshot.attributes.url}
              sx={{
                height: '100%',
                width: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
        ))}
      </Carousel>
    </ClientOverviewContainer>
  )
}

export default ClientOverview
