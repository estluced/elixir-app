import { BrowserWindow, ipcMain } from 'electron'
import {
  selectFolderHandler,
  getDefaultInstallationPath,
  setInstallationPath,
  getDiskSpaceByPath,
  storeImage,
} from '../handlers/helpers'

const HelpersEvents = (window: BrowserWindow) => {
  ipcMain.on('helpers/select-folder', (event) =>
    selectFolderHandler(event, window),
  )

  ipcMain.on('helpers/cache-image', storeImage)

  ipcMain.on('helpers/get-default-installation-path', async (event) => {
    event.reply(
      'helpers/get-default-installation-path',
      await getDefaultInstallationPath(),
    )
  })

  ipcMain.on('helpers/set-installation-path', setInstallationPath)

  ipcMain.on('helpers/get-disk-space', getDiskSpaceByPath)

  ipcMain.on('dev-reload', () => {
    window.webContents.reloadIgnoringCache()
  })
}

export default HelpersEvents
