import { BrowserWindow } from 'electron'

declare const PRELOADER_WINDOW_WEBPACK_ENTRY: string

const createPreloaderWindow = async () => {
  const preloaderWindow = new BrowserWindow({
    width: 300,
    height: 400,
    resizable: false,
    backgroundColor: '#111',
    show: true,
    webPreferences: {
      webSecurity: true,
    },
    titleBarStyle: 'hidden',
  })

  await preloaderWindow.loadURL(PRELOADER_WINDOW_WEBPACK_ENTRY)

  return preloaderWindow
}

export default createPreloaderWindow
