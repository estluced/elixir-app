import { useRef } from 'react'
import { Box, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import { Close } from '@mui/icons-material'
import { StyledPaper } from '../styles'
import { useDownloadCenter } from '../../providers/DownloadCenter'
import { DownloadCenterContainer } from './styles'
import useClickOutside from '../../hooks/useClickOutside'
import DownloadCard from './Card'

function DownloadCenterModal() {
  const downloadCenterRef = useRef(null)
  const { modalIsOpen, handleCloseDownloadCenter, downloadsList } =
    useDownloadCenter()

  useClickOutside(downloadCenterRef, handleCloseDownloadCenter)

  const animationVariants = {
    hidden: { x: '50%', opacity: 0 },
    visible: { x: '0%', opacity: 1 },
  }

  return (
    <DownloadCenterContainer
      ref={downloadCenterRef}
      animate={modalIsOpen ? 'visible' : 'hidden'}
      initial="hidden"
      variants={animationVariants}
      transition={{ duration: 0.2 }}
    >
      <StyledPaper
        sx={{
          padding: '6px 6px 0 6px',
          display: 'block',
          position: 'relative',
        }}
      >
        <Box
          onClick={handleCloseDownloadCenter}
          sx={{
            position: 'absolute',
            top: '0',
            right: '0',
            padding: '5px',
            width: '30%',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Button
            sx={{
              color: 'text.primary',
              minWidth: 'auto',
              height: 'auto',
              borderRadius: '100%',
              padding: '5px',
            }}
          >
            <Close sx={{ fontSize: '18px' }} />
          </Button>
        </Box>
        <Typography
          sx={{
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            marginTop: '5px',
            marginBottom: '10px',
          }}
        >
          Downloads
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gap: '5px',
            overflowY: 'scroll',
            maxHeight: '350px',
            paddingRight: '5px',
            paddingBottom: '5px',
          }}
        >
          {!downloadsList.length ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '50px',
              }}
            >
              <Typography
                sx={{
                  fontSize: '18px',
                  fontWeight: 800,
                }}
              >
                No downloads
              </Typography>
            </Box>
          ) : (
            downloadsList.map((download) => (
              <>
                {console.log(download, 'path')}
                <DownloadCard
                  key={download.id}
                  id={download.id}
                  filename={download.filename}
                  manifestPath={download.manifestPath}
                />
              </>
            ))
          )}
        </Box>
      </StyledPaper>
    </DownloadCenterContainer>
  )
}

export default DownloadCenterModal
