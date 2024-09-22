import fs from 'fs'
import path from 'path'
import { IpcMainEvent } from 'electron'
import LauncherStore from '../../utils/store'
import ClientInfo from './clientInfo'

export const scanLibrary = async (event: IpcMainEvent) => {
	const store = LauncherStore.getInstance()
	const installationPath = String(store.get('installation-path'))

	fs.readdir(installationPath, (err, files) => {
		if (err) {
			event.reply('core/error', {
				message: 'Something went wrong when scanning the library',
			})
			return
		}

		const clients = files
			.map((file) => {
				try {
					const clientPath = path.join(installationPath, file)
					const clientInfo = new ClientInfo(clientPath)
					const clientExists = clientInfo.checkClientExists()

					if (!clientExists) {
						clientInfo.generate()
						return clientInfo.get()
					}

					if (clientExists) {
						return clientInfo.get()
					}

					return null
				} catch (error) {
					return null
				}
			})
			.filter(Boolean)

		event.reply('core/library/scan', clients)
	})
}
