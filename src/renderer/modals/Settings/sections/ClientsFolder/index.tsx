import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import SelectFolder from '../../../../components/SelectFolder'
import { toggleSettingsModal } from '../../../../store/app/modalsSlice'

const ClientsFolder = () => {
  const dispatch = useDispatch()

  const onChangeLocation = () => {
    toast('Clients location changed successfully', { type: 'success' })
    dispatch(toggleSettingsModal())
  }

  return (
    <SelectFolder
      containerSx={{
        minWidth: 'auto',
        width: 'auto',
        padding: '30px 20px',
      }}
      title="Change clients installation folder"
      selectButtonText="Change folder"
      finishButtonText="Save"
      onFinish={onChangeLocation}
    />
  )
}

export default ClientsFolder
