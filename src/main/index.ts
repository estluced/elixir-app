import { app, BrowserWindow, ipcMain } from 'electron'
import { updateElectronApp } from 'update-electron-app'
import CoreEvents from './events/core'
import HelpersEvents from './events/helpers'
import LauncherStore from './utils/store'
import createRendererWindow from './windows/renderer'
import initPaths from './utils/initPaths'

const store = LauncherStore.getInstance()

if (require('electron-squirrel-startup')) {
  app.quit()
}

CoreEvents()

console.log('Updating test')

ipcMain.on('check-for-updates', async (event, { shouldInform = true }) => {
  updateElectronApp({
    logger: {
      log: (msg) => {
        if (msg.includes('update-not-available')) {
          if (shouldInform)
            event.reply('core/info', {
              message: 'Update not available',
            })
        }

        if (msg.includes('update-available')) {
          event.reply('core/app-update-in-progress')
        }

        if (msg.includes('error')) {
          event.reply('core/error', {
            message: `Error in auto-updater. ${msg}`,
          })
        }
      },
      warn: console.warn,
      info: console.info,
      error: console.error,
    },
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
