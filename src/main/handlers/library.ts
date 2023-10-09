import { IpcMainEvent } from 'electron'
import fs from 'fs'
import path from 'path'
import LauncherStore from '../utils/store'

export const checkClientIsInstalled = (
  event: IpcMainEvent,
  manifestPath: string,
) => {
  try {
    const store = LauncherStore.getInstance()
    const installationPath = String(store.get('installation-path'))
    const clientPath = path.join(installationPath, manifestPath)
    const exists = fs.existsSync(clientPath)
    event.reply('core/library/check-client-exists', exists)
  } catch (e) {
    console.log(e)
    event.reply('core/library/check-client-exists', false)
  }
}
