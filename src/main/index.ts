import { app, BrowserWindow, ipcMain } from 'electron'
import CoreEvents from './events/core'
import HelpersEvents from './events/helpers'
import LauncherStore from './utils/store'

const store = LauncherStore.getInstance()

declare const PRELOADER_WINDOW_WEBPACK_ENTRY: string

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

if (require('electron-squirrel-startup')) {
  app.quit()
}

const createPreloaderWindow = async () => {
  const preloaderWindow = new BrowserWindow({
    width: 300,
    height: 400,
    resizable: false,
    show: true,
    webPreferences: {
      webSecurity: false,
    },
    titleBarStyle: 'hidden',
  })
  await preloaderWindow.loadURL(PRELOADER_WINDOW_WEBPACK_ENTRY)
  return preloaderWindow
}

const createWindow = async () => {
  const { isPackaged } = app
  const preloaderWindow = await createPreloaderWindow()

  const mainWindow = new BrowserWindow({
    minWidth: 1000,
    minHeight: 600,
    show: false,
    ...(isPackaged ? { titleBarStyle: 'hidden' } : {}),
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      webSecurity: false,
    },
  })
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
  if (!isPackaged) {
    mainWindow.webContents.openDevTools()
  }
  mainWindow.once('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined')
    }
    if (isPackaged) {
      setTimeout(() => {
        preloaderWindow.close()
        mainWindow.show()
      }, 5000)
    } else {
      preloaderWindow.close()
      mainWindow.show()
    }
  })

  return mainWindow
}

CoreEvents()

ipcMain.on('electron-store-get', async (event, val) => {
  event.returnValue = store.get(val)
})
ipcMain.on('electron-store-set', async (event, key, val) => {
  store.set(key, val)
})

ipcMain.on('electron-store-clear', async () => {
  store.clear()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.whenReady().then(async () => {
  const win = await createWindow()
  HelpersEvents(win)
  ipcMain.on('app', (event, data) => {
    switch (data[0]) {
      case 'minimize':
        win?.minimize()
        break
      case 'quit':
        app.quit()
        break
      default:
        break
    }
  })
})

app.on('activate', async () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    await createWindow()
  }
})
