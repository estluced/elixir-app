import { Grid, Paper } from '@mui/material'
import { Close, Pause, PlayArrow } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { DownloadProgress } from '../../../types/downloads'
import { ActionButton, StyledProgress } from './styles'
import usePreload from '../../hooks/usePreload'
import formatBytes from '../../utils/formatBytes'
import { ClientStatusEnum } from '../../../types/client'

interface DownloadCardProps {
  uuid: string
}

interface DownloadCardProgress extends DownloadProgress {
  formattedSpeed: string
}

const DownloadCard = ({ uuid }: DownloadCardProps) => {
  const { bridge } = usePreload()
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [downloadProgress, setDownloadProgress] =
    useState<DownloadCardProgress>({
      totalFiles: 0,
      downloadedFiles: 0,
      formattedSpeed: '0 B/s',
      speed: 0,
    })

  useEffect(() => {
    console.log(uuid)

    bridge.on(
      `core/download/${uuid}/total:progress`,
      (e: { status: ClientStatusEnum; progress: DownloadProgress }) => {
        const { progress } = e
        setDownloadProgress({
          ...progress,
          formattedSpeed: formatBytes(progress.speed),
        })
      },
    )

    bridge.on(`core/download/${uuid}/paused`, (bool) => {
      setIsPaused(bool)
    })

    bridge.on(`core/download/${uuid}/resumed`, (bool) => {
      setIsPaused(bool)
    })
  }, [uuid])

  const handlePauseDownload = () => {
    bridge.sendMessage(`core/download/${uuid}/pause`)
  }

  const handleResumeDownload = () => {
    bridge.sendMessage(`core/download/${uuid}/resume`)
  }

  const handleCancelDownload = () => {
    bridge.sendMessage(`core/download/${uuid}/cancel`)
  }

  const triggerPauseResume = () => {
    if (isPaused) {
      handleResumeDownload()
    } else {
      handlePauseDownload()
    }
  }

  return (
    <Grid container direction="row" wrap="nowrap" gap="8px" width="340px">
      <StyledProgress
        max={downloadProgress.totalFiles}
        value={downloadProgress.downloadedFiles}
      />
      <Grid
        component={Paper}
        container
        maxWidth="70px"
        justifyContent="center"
        px="8px"
        gap="16px"
        fontWeight={700}
        whiteSpace="nowrap"
        fontSize="14px"
        alignItems="center"
      >
        {downloadProgress.formattedSpeed}
      </Grid>
      <ActionButton onClick={triggerPauseResume}>
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
      </ActionButton>
      <ActionButton onClick={handleCancelDownload}>
        <Close
          sx={{
            fontSize: '16px',
            color: 'text.primary',
          }}
        />
      </ActionButton>
    </Grid>
  )
}

export default DownloadCard
