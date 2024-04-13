import { app, BrowserWindow } from 'electron'
import { join } from 'path'
import createPreloaderWindow from './preloader'

declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_WEBPACK_ENTRY: string

const createRendererWindow = async () => {
  const { isPackaged } = app
  const preloaderWindow = await createPreloaderWindow()

  const mainWindow = new BrowserWindow({
    minWidth: 1000,
    minHeight: 624,
    width: 1000,
    height: 624,
    backgroundColor: '#111',
    show: false,
    icon: join(process.cwd(), 'public', 'icon', 'icon.ico'),
    ...(isPackaged ? { titleBarStyle: 'hidden', resizable: false } : {}),
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      webSecurity: false,
    },
  })

  // eslint-disable-next-line promise/valid-params
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY).then()

  if (!isPackaged) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.once('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined')
    }
    if (isPackaged) {
      preloaderWindow.close()
      mainWindow.show()
    } else {
      preloaderWindow.close()
      mainWindow.show()
    }
  })

  return mainWindow
}

export default createRendererWindow
