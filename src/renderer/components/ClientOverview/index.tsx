import { Box, Typography, Chip, Grid } from '@mui/material'
import { PlayCircle } from '@mui/icons-material'
import marked from 'marked'
import { useDispatch } from 'react-redux'
import { Client } from '../../../types/client'
import { ClientOverviewContainer, PlayButton } from './styles'
import { Carousel } from '../Carousel'
import StrapiMedia from '../StrapiMedia'
import { addDownload } from '../../store/downloads/downloadsSlice'

const ClientOverview = ({
  title,
  shortDescription,
  description,
  screenshots,
  keywords,
  available,
  mainFile,
}: Client) => {
  const parsedDescription = marked.parse(description)
  const dispatch = useDispatch()

  const handleAddDownload = () => dispatch(addDownload(mainFile.data))

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
          <PlayButton onClick={handleAddDownload}>
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
            <StrapiMedia
              {...screenshot}
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
