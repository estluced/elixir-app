import { BrowserWindow } from 'electron'

declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string
declare const CONSOLE_WINDOW_WEBPACK_ENTRY: string

const createConsoleWindow = async () => {
  const consoleWindow = new BrowserWindow({
    width: 900,
    height: 600,
    show: true,
    autoHideMenuBar: true,
    backgroundColor: '#000',
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      webSecurity: true,
    },
  })

  await consoleWindow.loadURL(CONSOLE_WINDOW_WEBPACK_ENTRY)

  return consoleWindow
}

export default createConsoleWindow
