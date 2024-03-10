import { ipcMain } from 'electron'
import downloadHandler from '../handlers/download'
import { checkClientIsInstalled, getClients } from '../handlers/library'
import launchHandler from '../handlers/launch'

const CoreEvents = () => {
  ipcMain.on('core/download/start', downloadHandler)
  ipcMain.on('core/launch/client', launchHandler)
  ipcMain.on('core/library/check-client-exists', checkClientIsInstalled)
  ipcMain.on('core/library/get-clients', getClients)
}

export default CoreEvents
