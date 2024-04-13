import { BrowserWindow } from 'electron'
import { join } from 'path'

declare const PRELOADER_WINDOW_WEBPACK_ENTRY: string

const createPreloaderWindow = async () => {
  const preloaderWindow = new BrowserWindow({
    width: 300,
    height: 400,
    resizable: false,
    backgroundColor: '#111',
    show: true,
    icon: join(process.cwd(), 'public', 'icon', 'icon.ico'),
    webPreferences: {
      webSecurity: true,
    },
    titleBarStyle: 'hidden',
  })

  await preloaderWindow.loadURL(PRELOADER_WINDOW_WEBPACK_ENTRY)

  return preloaderWindow
}

export default createPreloaderWindow
