import { Box, Chip, Grid, Typography } from '@mui/material'
import { Delete, Folder, PlayCircle, RotateLeft } from '@mui/icons-material'
import marked from 'marked'
import { useEffect } from 'react'
import { connect, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { Client, ClientStatus, ClientStatusEnum } from '../../../types/client'
import { ClientOverviewContainer, PlayButton } from './styles'
import { Carousel } from '../Carousel'
import StrapiMedia from '../StrapiMedia'
import usePreload from '../../hooks/usePreload'
import { useDownloadCenter } from '../../providers/DownloadCenter'
import DownloadCard from '../DownloadCard'
import { RootState } from '../../store'
import { setClientStatus } from '../../store/clients/clientsSlice'
import ServersInfo from '../ServersInfo'
import ClientMenu from './ClientMenu'

const ClientOverview = ({
  client,
  clientId,
}: {
  client: Client
  clientId: number
}) => {
  const {
    title,
    shortDescription,
    description,
    screenshots,
    keywords,
    available,
    uuid,
    status: clientStatus = ClientStatusEnum.INSTALLED,
    titleImage,
  } = client

  const dispatch = useDispatch()
  const { bridge } = usePreload()
  const parsedDescription = marked.parse(description)
  const { addDownload } = useDownloadCenter()

  const initBridgeEvents = () => {
    bridge.on(`core/download/${uuid}/start`, (e: { status: ClientStatus }) => {
      dispatch(
        setClientStatus({
          id: clientId,
          status: e.status,
        }),
      )
    })

    bridge.on(`core/download/${uuid}/complete`, (e: { status: ClientStatus }) =>
      dispatch(
        setClientStatus({
          id: clientId,
          status: e.status,
        }),
      ),
    )

    bridge.on(`core/launch/client/${uuid}`, (e: { status: ClientStatus }) => {
      dispatch(
        setClientStatus({
          id: clientId,
          status: e.status,
        }),
      )
    })

    bridge.on(
      'core/library/set-client-status',
      (e: { status: ClientStatus }) => {
        dispatch(
          setClientStatus({
            id: clientId,
            status: e.status,
          }),
        )
      },
    )
  }

  useEffect(() => {
    initBridgeEvents()
  }, [uuid])

  const handleAddDownload = () => addDownload(client)

  const handleLaunchClient = () =>
    bridge.sendMessage('core/launch/client', client)

  const handleOpenClientFolder = () => {
    bridge.sendMessage('helpers/open-client-folder', client)
  }

  const clientMenuItems = [
    {
      icon: Folder,
      label: 'Open client folder',
      onClick: handleOpenClientFolder,
    },
    {
      icon: RotateLeft,
      label: 'Check for updates',
      onClick: () => {
        bridge
          .sendMessage('core/library/get-client-status', {
            id: clientId,
            attributes: client,
          })
          .on((clientStatus: { status: ClientStatus }) => {
            if (clientStatus.status === client.status) {
              toast('Client is up to date', {
                type: 'info',
              })
            }
          })
      },
      disabled: clientStatus === ClientStatusEnum.LAUNCHED,
    },
    {
      icon: Delete,
      label: 'Uninstall',
      onClick: () => {
        bridge.sendMessage('core/library/uninstall', {
          id: clientId,
          attributes: client,
        })
      },
      disabled: clientStatus === ClientStatusEnum.LAUNCHED,
    },
  ]

  return (
    <ClientOverviewContainer>
      <Grid container direction="column" gap="10px">
        {titleImage?.data?.attributes ? (
          <StrapiMedia
            {...titleImage?.data}
            sx={{
              height: 'max-content',
              width: '350px',
              objectFit: 'contain',
              marginTop: '10px',
              marginBottom: '30px',
            }}
          />
        ) : (
          <Typography variant="h2" fontWeight={700}>
            {title}
          </Typography>
        )}
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
            {(clientStatus === ClientStatusEnum.INSTALLED ||
              clientStatus === ClientStatusEnum.LAUNCHED) && (
              <ClientMenu menuItems={clientMenuItems} />
            )}
          </Grid>
        )}
      </Grid>
      {client?.servers?.length && <ServersInfo servers={client.servers} />}
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

export default connect(
  (state: RootState) => ({
    client: state.clients.activeClient?.attributes,
    clientId: state.clients.activeClient?.id,
  }),
  {},
)(ClientOverview)
