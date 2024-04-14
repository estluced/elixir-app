import SelectFolder from '../../../../components/SelectFolder'
import usePreload from '../../../../hooks/usePreload'

const ClientsFolder = () => {
  const { bridge } = usePreload()

  const onChangeLocation = () => {
    bridge.sendMessage('app', ['reload'])
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
