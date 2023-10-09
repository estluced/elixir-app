import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
} from '@mui/material'
import Button from '@mui/material/Button'
import { ReactNode } from 'react'
import { ChevronLeftRounded } from '@mui/icons-material'
import { useProducts } from '../../../providers/Products'
import Image from '../../../components/Image'
import { ProductWrapper, StyledSelectVersion } from './styles'
import { Carousel } from '../../../components/Carousel'
import Background from '../../../assets/background.png'
import MinecraftLogo from '../../../assets/minecraft_logo.png'
import { useDownloadCenter } from '../../../providers/DownloadCenter'
import getClientManifest from '../../../api/getClientManifest'

function ClientView() {
  const {
    activeClient,
    clients,
    selectedClient,
    selectedClientInstalled,
    updateSelectedClient,
  } = useProducts()
  const { pushDownload } = useDownloadCenter()
  const { store } = window.electron

  const handleChangeClient = (event: SelectChangeEvent) => {
    updateSelectedClient(JSON.parse(event.target.value))
  }

  const handleClickStart = () => {
    if (selectedClientInstalled) {
      console.log('aaa')
    } else {
      getClientManifest({ manifestUrl: selectedClient!.manifest }).then(
        (manifest) => {
          console.log('mnfst', manifest)
          pushDownload({
            url: manifest.artifacts,
            filename: manifest.name,
            id: manifest.slug,
            manifestPath: manifest.manifestPath,
          })
        },
      )
    }
  }

  return (
    <>
      <Image
        remoteUrl={Background}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(20%)',
        }}
      />
      <ProductWrapper>
        <Image
          sx={{
            marginTop: '10vh',
            maxWidth: '400px',
            justifySelf: 'center',
            marginBottom: '20px',
          }}
          remoteUrl={MinecraftLogo}
        />
        <Box>
          <Box
            sx={{
              display: 'flex',
              gap: '20px',
            }}
          >
            <Button
              sx={{
                padding: '0 35px',
                borderRadius: '12px',
              }}
              variant="contained"
              color="secondary"
              onClick={handleClickStart}
            >
              {selectedClientInstalled ? 'Play' : 'Download'}
            </Button>
            {!!clients.length && (
              <Paper>
                <StyledSelectVersion
                  value={JSON.stringify(selectedClient)}
                  onChange={handleChangeClient as any}
                  IconComponent={({ className }) => (
                    <ChevronLeftRounded className={className} />
                  )}
                >
                  {clients.map((product) => (
                    <MenuItem
                      key={`minecraft-product-${product.name}`}
                      value={JSON.stringify(product)}
                    >
                      {product.name}
                    </MenuItem>
                  ))}
                </StyledSelectVersion>
              </Paper>
            )}
          </Box>
        </Box>
        <Box
          sx={{
            width: '100%',
            height: 'min-content',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          <Carousel slidesPerView={1} autoPlay allowTouchMove>
            {activeClient?.screenshots?.map((screenshot) => (
              <Image
                sx={{
                  width: '100%',
                  height: '100% !important',
                }}
                localUrl={screenshot?.localUrl}
                remoteUrl={screenshot?.remoteUrl}
              />
            ))}
          </Carousel>
        </Box>
      </ProductWrapper>
    </>
  )
}

export default ClientView
