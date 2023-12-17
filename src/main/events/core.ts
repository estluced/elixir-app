import { ipcMain } from 'electron'
import downloadHandler from '../handlers/download'
import {
  checkClientIsInstalled,
  getClients,
  getClientManifest,
} from '../handlers/library'

const CoreEvents = () => {
  ipcMain.on('core/download', downloadHandler)
  ipcMain.on('core/library/check-client-exists', checkClientIsInstalled)
  ipcMain.on('core/library/get-clients', getClients)
  ipcMain.on('core/library/get-client-manifest', getClientManifest)
}

export default CoreEvents
