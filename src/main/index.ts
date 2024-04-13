import { app, BrowserWindow, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import CoreEvents from './events/core'
import HelpersEvents from './events/helpers'
import LauncherStore from './utils/store'
import createRendererWindow from './windows/renderer'
import initPaths from './utils/initPaths'

const store = LauncherStore.getInstance()

if (require('electron-squirrel-startup')) {
  app.quit()
}

autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'estluced',
  repo: 'elixir-app',
})

CoreEvents()

ipcMain.on('check-for-updates', async (event, { shouldInform = true }) => {
  autoUpdater.checkForUpdates()

  event.reply('core/info', {
    message: 'Test info',
  })

  event.reply('core/error', {
    message: 'Test error',
  })

  event.reply('core/warning', {
    message: 'Test warning',
  })

  event.reply('core/success', {
    message: 'Test success',
  })

  autoUpdater.autoDownload = false

  autoUpdater.on('update-available', () => {
    if (shouldInform)
      event.reply('core/info', {
        message: 'Update available',
      })

    autoUpdater
      .downloadUpdate()
      .then(() => {
        autoUpdater.quitAndInstall()
      })
      .catch(() =>
        event.reply('core/error', {
          message: 'Error downloading update',
        }),
      )

    autoUpdater.on('download-progress', (progressObj) => {
      event.reply('core/app-update-progress', progressObj)
    })

    autoUpdater.on('error', (err) => {
      event.reply('core/error', {
        message: `Error in auto-updater. ${err}`,
      })
    })
  })

  if (shouldInform)
    autoUpdater.on('update-not-available', () => {
      event.reply('core/info', {
        message: 'Update not available',
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
  initPaths()
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
