import { Box, Tooltip, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import { useEffect, useState } from 'react'
import { PickInstallationFolderField } from './styles'
import { bytesToSize } from '../../../utils'
import { StyledModal, StyledPaper } from '../styles'

interface SelectFolderModalProps {
  isOpen: boolean
  handleClose: () => void
}

const DEFAULT_INSTALLATION_FOLDER = {
  path: '',
  free: 0,
  size: 0,
}

function SelectFolderModal({ isOpen, handleClose }: SelectFolderModalProps) {
  const { ipcRenderer } = window.electron
  const [installationFolder, setInstallationFolder] = useState<{
    path: string
    free: number
    size: number
  }>(DEFAULT_INSTALLATION_FOLDER)

  const neededSpace = 9e10

  const finishDisabled =
    !installationFolder?.path?.length || installationFolder?.free < neededSpace

  useEffect(() => {
    ipcRenderer
      .sendMessage('helpers/get-default-installation-path')
      .on((path) => {
        setInstallationFolder(path)
      })
  }, [window])

  const handleOpenFolderPicker = () => {
    ipcRenderer.sendMessage('helpers/select-folder').on((path) => {
      setInstallationFolder(path)
    })
  }

  const handleFinish = () => {
    ipcRenderer
      .sendMessage('helpers/set-installation-path', installationFolder)
      .on((success) => {
        if (success) {
          handleClose()
        }
      })
  }

  return (
    <StyledModal open={isOpen}>
      <StyledPaper>
        <Typography p="0 40px" textAlign="center" variant="h5" fontWeight={600}>
          Select clients installation folder
        </Typography>
        <Box display="grid" gap="6px">
          <Typography sx={{ marginLeft: '8px' }} fontSize="12px">
            {bytesToSize(installationFolder.free || 0)} free of{' '}
            {bytesToSize(installationFolder.size || 0)} Needed:{' '}
            {bytesToSize(neededSpace)}
          </Typography>
          <Tooltip title={installationFolder.path} sx={{ cursor: 'pointer' }}>
            <PickInstallationFolderField onClick={handleOpenFolderPicker}>
              <Typography variant="body2">{installationFolder.path}</Typography>
              <Button variant="contained">Select folder</Button>
            </PickInstallationFolderField>
          </Tooltip>
        </Box>
        <Button
          variant="contained"
          onClick={handleFinish}
          disabled={finishDisabled}
        >
          Finish
        </Button>
      </StyledPaper>
    </StyledModal>
  )
}

export default SelectFolderModal
