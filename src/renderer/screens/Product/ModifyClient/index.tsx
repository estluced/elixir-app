import { Box, Paper, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import { useEffect } from 'react'
import { useProducts } from '../../../providers/Products'
import Image from '../../../components/Image'
import { ProductWrapper } from './styles'
import { Carousel } from '../../../components/Carousel'

function ModifyClientView() {
  const { activeClient } = useProducts()
  const { store } = window.electron
  useEffect(() => {
    console.log('[DEBUG] Active client 234 P{', activeClient?.logo?.localUrl)
  }, [activeClient])
  // const installationPath = store.get('installation-path');
  // const { pushDownload } = useDownloadCenter();

  // const handleButtonClick = () => {
  //   getClientManifest({
  //     manifestUrl: 'http://localhost:8000/manifest/server',
  //   }).then((manifest) => {
  //     console.log(manifest);
  //     pushDownload({
  //       id: manifest.slug,
  //       filename: manifest.name,
  //       url: manifest.artifacts,
  //     });
  //   });
  // };

  return (
    <>
      <Image
        remoteUrl={activeClient?.background?.remoteUrl}
        localUrl={activeClient?.background?.localUrl}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(10%)',
        }}
      />
      <ProductWrapper>
        <Image
          sx={{
            marginTop: '10vh',
            maxWidth: '400px',
            justifySelf: 'center',
          }}
          localUrl={activeClient?.logo?.localUrl}
          remoteUrl={activeClient?.logo?.remoteUrl}
        />
        <Box>
          <Box
            sx={{
              display: 'flex',
              gap: '20px',
            }}
          >
            <Paper
              sx={{
                padding: '5px',
                width: '100%',
              }}
            />
            <Button variant="outlined">Play</Button>
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
          <Carousel slidesPerView={1} autoPlay autoHeight allowTouchMove>
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

export default ModifyClientView
