import { ipcMain } from 'electron'
import downloadHandler from '../handlers/download'
import {
	checkClientsStatuses,
	getClients,
	checkClientStatus,
	uninstallClient,
} from '../handlers/library'
import launchHandler from '../handlers/launch'
import { scanLibrary } from '../handlers/library/scan'

const CoreEvents = () => {
	ipcMain.on('core/download/start', downloadHandler)
	ipcMain.on('core/launch/client', launchHandler)
	ipcMain.on('core/library/get-clients-statuses', checkClientsStatuses)
	ipcMain.on('core/library/get-client-status', checkClientStatus)
	ipcMain.on('core/library/get-clients', getClients)
	ipcMain.on('core/library/uninstall', uninstallClient)
	ipcMain.on('core/library/scan', scanLibrary)
}

export default CoreEvents
