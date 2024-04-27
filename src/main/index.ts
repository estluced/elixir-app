import { app, BrowserWindow, ipcMain, autoUpdater } from 'electron'
import CoreEvents from './events/core'
import HelpersEvents from './events/helpers'
import LauncherStore from './utils/store'
import createRendererWindow from './windows/renderer'
import getConfig from '../utils/getConfig'
import initAppData from './utils/initAppData'

const config = getConfig()
const store = LauncherStore.getInstance()

if (require('electron-squirrel-startup')) {
  app.quit()
}

CoreEvents()

ipcMain.on('check-for-updates', async (event, { shouldInform = true }) => {
  autoUpdater.setFeedURL({
    url: `${config.RELEASE_SERVER}/update/${process.platform}${
      process.arch
    }/${app.getVersion()}/stable`,
  })

  try {
    autoUpdater.checkForUpdates()
  } catch (err) {
    event.reply('core/error', {
      message: `Error in auto-updater. ${err}`,
    })
  }

  autoUpdater.on('update-available', () => {
    event.reply('core/app-update-in-progress')
  })

  autoUpdater.on('update-downloaded', () => {
    autoUpdater.quitAndInstall()
  })

  if (shouldInform)
    autoUpdater.on('update-not-available', () => {
      event.reply('core/info', {
        message: 'No updates found',
      })
    })

  autoUpdater.on('error', (err) => {
    event.reply('core/error', {
      message: `Error in auto-updater. ${err}`,
    })
  })
})

ipcMain.on('electron-store-get', async (event, val) => {
  event.returnValue = store.get(val)
})

ipcMain.on('electron-store-remove', async (_event, key) => store.delete(key))

ipcMain.on('electron-store-set', async (_event, key, val) => {
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
  initAppData()
  const win = await createRendererWindow()
  HelpersEvents(win)
  ipcMain.on('app', (_event, data) => {
    switch (data[0]) {
      case 'minimize':
        win?.minimize()
        break
      case 'quit':
        app.quit()
        break
      case 'reload': {
        app.relaunch()
        app.quit()
        break
      }
      default:
        break
    }
  })
})

app.on('activate', async () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    await createRendererWindow()
  }
})
