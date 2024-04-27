import { Box, SxProps, Tooltip, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import { useEffect, useState } from 'react'
import { StyledPaper, PickInstallationFolderField } from './styles'
import { bytesToSize } from '../../../utils'
import usePreload from '../../hooks/usePreload'

const DEFAULT_INSTALLATION_FOLDER = {
  path: '',
  free: 0,
  size: 0,
  error: false,
}

interface SelectFolderProps {
  onFinish?: () => void
  title?: string
  selectButtonText?: string
  finishButtonText?: string
  containerSx?: SxProps
}

const SelectFolder = ({
  onFinish,
  title,
  finishButtonText,
  selectButtonText,
  containerSx,
}: SelectFolderProps) => {
  const { bridge, installPath } = usePreload()
  const [installationFolder, setInstallationFolder] = useState<{
    path: string
    free: number
    size: number
    error?: boolean
  }>(DEFAULT_INSTALLATION_FOLDER)

  const neededSpace = 5e9

  const finishDisabled =
    installationFolder?.error ??
    (!installationFolder?.path?.length ||
      installationFolder?.free < neededSpace ||
      installPath === installationFolder.path)

  useEffect(() => {
    bridge
      .sendMessage('helpers/get-installation-path', installPath)
      .on((path) => {
        setInstallationFolder(path)
      })
  }, [window])

  const handleOpenFolderPicker = () => {
    bridge.sendMessage('helpers/select-folder').on((path) => {
      setInstallationFolder(path)
    })
  }

  const handleFinish = () => {
    bridge
      .sendMessage('helpers/set-installation-path', installationFolder)
      .on((success) => {
        if (success && onFinish) {
          onFinish()
        }
      })
  }

  return (
    <StyledPaper sx={containerSx}>
      <Typography textAlign="center" p="0 20px" variant="h5" fontWeight={600}>
        {title || 'Select clients installation folder'}
      </Typography>
      <Box display="grid" gap="6px">
        {!installationFolder?.error && (
          <Typography sx={{ marginLeft: '8px' }} fontSize="12px">
            {bytesToSize(installationFolder.free || 0)} free of{' '}
            {bytesToSize(installationFolder.size || 0)} Needed:{' '}
            {bytesToSize(neededSpace)}
          </Typography>
        )}
        <Tooltip title={installationFolder.path} sx={{ cursor: 'pointer' }}>
          <PickInstallationFolderField onClick={handleOpenFolderPicker}>
            <Typography variant="body2">{installationFolder.path}</Typography>
            <Button variant="contained">
              {selectButtonText || 'Select folder'}
            </Button>
          </PickInstallationFolderField>
        </Tooltip>
      </Box>
      <Button
        variant="contained"
        onClick={handleFinish}
        disabled={finishDisabled}
      >
        {finishButtonText || 'Finish'}
      </Button>
    </StyledPaper>
  )
}

export default SelectFolder
