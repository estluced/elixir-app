import { Box, Chip, Grid, Typography } from '@mui/material'
import { PlayCircle, FolderOpen } from '@mui/icons-material'
import marked from 'marked'
import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { Client, ClientStatus, ClientStatusEnum } from '../../../types/client'
import { ClientOverviewContainer, PlayButton } from './styles'
import { Carousel } from '../Carousel'
import StrapiMedia from '../StrapiMedia'
import usePreload from '../../hooks/usePreload'
import { useDownloadCenter } from '../../providers/DownloadCenter'
import DownloadCard from '../DownloadCard'
import { DownloadProgress } from '../../../types/downloads'

const ClientOverview = (client: Client) => {
  const {
    title,
    shortDescription,
    description,
    screenshots,
    keywords,
    available,
    uuid,
  } = client
  const location = useLocation()
  const { bridge } = usePreload()
  const parsedDescription = marked.parse(description)
  const { addDownload } = useDownloadCenter()
  const [clientStatus, setClientStatus] = useState<ClientStatus>(
    ClientStatusEnum.INSTALLED,
  )

  const initBridgeEvents = () => {
    bridge
      .sendMessage('core/library/check-client-exists', client)
      .on((e: { status: ClientStatus }) => setClientStatus(e.status))

    bridge.on(`core/download/${uuid}/start`, (e: { status: ClientStatus }) => {
      setClientStatus(e.status)
    })

    bridge.on(`core/download/${uuid}/complete`, (e: { status: ClientStatus }) =>
      setClientStatus(e.status),
    )

    bridge.on(`core/launch/client/${uuid}`, (e: { status: ClientStatus }) => {
      setClientStatus(e.status)
      console.log(e)
    })

    bridge.on(
      `core/download/${uuid}/total:progress`,
      (e: { status: ClientStatusEnum; progress: DownloadProgress }) => {
        const { status } = e
        if (status === clientStatus) return
        setClientStatus(status)
      },
    )
  }

  useEffect(() => {
    initBridgeEvents()

    console.log(location)

    return () => {
      setClientStatus(ClientStatusEnum.INSTALLED)
    }
  }, [uuid])

  const handleAddDownload = () => addDownload(client)

  const handleLaunchClient = () =>
    bridge.sendMessage('core/launch/client', client)

  const handleOpenClientFolder = () => {
    bridge.sendMessage('helpers/open-client-folder', client)
  }

  return (
    <ClientOverviewContainer>
      <Grid container direction="row" gap="10px">
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
          <Grid container direction="row" wrap="nowrap" gap="10px" mt="5px">
            {(clientStatus === ClientStatusEnum.INSTALLED ||
              clientStatus === ClientStatusEnum.LAUNCHED) && (
              <PlayButton
                disabled={clientStatus === ClientStatusEnum.LAUNCHED}
                onClick={handleLaunchClient}
              >
                <PlayCircle
                  sx={{
                    marginRight: '5px',
                  }}
                />
                <Typography fontWeight={800} lineHeight="14px" fontSize="14px">
                  Play
                </Typography>
              </PlayButton>
            )}
            {clientStatus === ClientStatusEnum.NOT_INSTALLED && (
              <PlayButton onClick={handleAddDownload}>
                <PlayCircle
                  sx={{
                    marginRight: '5px',
                  }}
                />
                <Typography fontWeight={800} lineHeight="14px" fontSize="14px">
                  Download
                </Typography>
              </PlayButton>
            )}
            {clientStatus === ClientStatusEnum.OUTDATED && (
              <PlayButton onClick={handleAddDownload}>
                <PlayCircle
                  sx={{
                    marginRight: '5px',
                  }}
                />
                <Typography fontWeight={800} lineHeight="14px" fontSize="14px">
                  Update
                </Typography>
              </PlayButton>
            )}
            {clientStatus === ClientStatusEnum.DOWNLOADING && (
              <DownloadCard uuid={uuid} />
            )}
            {clientStatus === ClientStatusEnum.INSTALLED && (
              <PlayButton
                onClick={handleOpenClientFolder}
                sx={{
                  padding: '5px 8px',
                  minWidth: 'auto',
                }}
              >
                <FolderOpen
                  sx={{
                    width: '22px',
                    height: '22px',
                  }}
                />
              </PlayButton>
            )}
          </Grid>
        )}
      </Grid>
      <Carousel
        slidesPerView={1}
        spaceBetween={45}
        allowTouchMove
        autoPlay
        speed={600}
      >
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
      <Box
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
    </ClientOverviewContainer>
  )
}

export default ClientOverview
