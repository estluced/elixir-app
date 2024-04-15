import { BrowserWindow, ipcMain } from 'electron'
import {
  selectFolderHandler,
  getDefaultInstallationPath,
  setInstallationPath,
  getDiskSpaceByPath,
  storeImage,
  openClientFolder,
  getSkinInfo,
  getRAMRangeArray,
  clearCache,
} from '../handlers/helpers'

const HelpersEvents = (window: BrowserWindow) => {
  ipcMain.on('helpers/select-folder', (event) =>
    selectFolderHandler(event, window),
  )

  ipcMain.on('helpers/cache-image', storeImage)

  ipcMain.on('helpers/get-installation-path', getDefaultInstallationPath)

  ipcMain.on('helpers/set-installation-path', setInstallationPath)

  ipcMain.on('helpers/get-disk-space', getDiskSpaceByPath)

  ipcMain.on('dev-reload', () => {
    window.webContents.reloadIgnoringCache()
  })

  ipcMain.on('helpers/open-client-folder', openClientFolder)

  ipcMain.on('helpers/account/skin', getSkinInfo)

  ipcMain.on('helpers/get-ram-range-array', getRAMRangeArray)

  ipcMain.on('helpers/clear-cache', clearCache)
}

export default HelpersEvents
