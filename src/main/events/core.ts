import { ipcMain } from 'electron'
import downloadHandler from '../handlers/download'
import { checkClientIsInstalled } from '../handlers/library'

const CoreEvents = () => {
  ipcMain.on('core/download', downloadHandler)
  ipcMain.on('core/library/check-client-exists', checkClientIsInstalled)
}

export default CoreEvents
