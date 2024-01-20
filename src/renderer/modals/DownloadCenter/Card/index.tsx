import { useEffect, useState } from 'react'
import { Close, GamepadRounded, Pause, PlayArrow } from '@mui/icons-material'
import { Box, Paper, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import { DownloadCardWrapper, StyledProgress } from './styles'
import {
  DownloadListItem,
  useDownloadCenter,
} from '../../../providers/DownloadCenter'

function DownloadCard({
  id,
  filename = 'Download',
  manifestPath,
}: DownloadListItem) {
  const { ipcRenderer } = window.electron
  const { removeDownload } = useDownloadCenter()
  const [totalFiles, setTotalFiles] = useState<number>(2)
  const [downloadedFiles, setDownloadedFiles] = useState<number>(1)
  const [speed, setSpeed] = useState<string>('0 MB/s')
  const [isPaused, setIsPaused] = useState<boolean>(false)

  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  useEffect(() => {
    ipcRenderer.on(`core/download/${id}/start`, (downloadInfo) => {
      console.log('Download started', downloadInfo)
    })

    ipcRenderer.on(`core/download/${id}/complete`, (downloadInfo) => {
      removeDownload(downloadInfo.id)
      // ipcRenderer.sendMessage('core/library/check-client-exists', manifestPath)
    })

    ipcRenderer.on(`core/download/${id}/file:progress`, (progressData) => {
      setSpeed(progressData.speed)
    })

    ipcRenderer.on(`core/download/${id}/paused`, (bool) => {
      setIsPaused(bool)
    })

    ipcRenderer.on(`core/download/${id}/resumed`, (bool) => {
      setIsPaused(bool)
    })

    ipcRenderer.on(`core/download/${id}/total:progress`, (progress) => {
      setTotalFiles(progress.totalFiles)
      setDownloadedFiles(progress.downloadedFiles)
    })
  }, [])

  const handlePauseDownload = () => {
    ipcRenderer.sendMessage(`core/download/${id}/pause`)
  }

  const handleResumeDownload = () => {
    ipcRenderer.sendMessage(`core/download/${id}/resume`)
  }

  const handleCancelDownload = () => {
    ipcRenderer.sendMessage(`core/download/${id}/cancel`)
  }

  const triggerPauseResume = () => {
    if (isPaused) {
      handleResumeDownload()
    } else {
      handlePauseDownload()
    }
  }

  return (
    <DownloadCardWrapper
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      expanded={isExpanded}
    >
      <Box
        sx={{
          marginTop: '7px',
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: 'auto',
            gap: '6px',
          }}
        >
          <GamepadRounded
            sx={{ fontSize: '24px', position: 'relative', zIndex: 1 }}
          />
          <Typography
            sx={{
              position: 'relative',
              zIndex: 1,
              fontSize: '16px',
              fontWeight: 'bold',
              width: '120px',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {filename}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <Typography
            sx={{
              marginTop: '2px',
              marginRight: '5px',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            {speed}
          </Typography>
          <Button
            sx={{
              padding: 0,
              minWidth: 'auto',
              marginRight: '5px',
            }}
            onClick={triggerPauseResume}
          >
            {isPaused ? (
              <PlayArrow
                sx={{
                  fontSize: '16px',
                  color: 'text.primary',
                }}
              />
            ) : (
              <Pause
                sx={{
                  fontSize: '16px',
                  color: 'text.primary',
                }}
              />
            )}
          </Button>
          <Button
            sx={{
              padding: 0,
              minWidth: 'auto',
              marginRight: '5px',
            }}
            onClick={handleCancelDownload}
          >
            <Close
              sx={{
                fontSize: '16px',
                color: 'text.primary',
              }}
            />
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          marginTop: '22px',
          marginBottom: '5px',
          display: 'grid',
          gap: '5px',
          gridTemplateColumns: '1fr 1fr',
        }}
      >
        <Paper
          sx={{
            padding: '5px',
          }}
        >
          <Typography fontSize="14px" fontWeight={600}>
            Downloaded
          </Typography>
          <Typography fontSize="14px" fontWeight={600}>
            {downloadedFiles} files
          </Typography>
        </Paper>
        <Paper
          sx={{
            padding: '5px',
          }}
        >
          <Typography fontSize="14px" fontWeight={600}>
            Total
          </Typography>
          <Typography fontSize="14px" fontWeight={600}>
            {totalFiles} files
          </Typography>
        </Paper>
      </Box>
      <StyledProgress max={totalFiles} value={downloadedFiles} />
    </DownloadCardWrapper>
  )
}

export default DownloadCard
