import { StyledModal } from '../styles'
import SelectFolder from '../../components/SelectFolder'

interface SelectFolderModalProps {
  isOpen: boolean
  handleClose: () => void
}

function SelectFolderModal({ isOpen, handleClose }: SelectFolderModalProps) {
  return (
    <StyledModal open={isOpen}>
      <SelectFolder onFinish={handleClose} />
    </StyledModal>
  )
}

export default SelectFolderModal
