import { app, BrowserWindow } from 'electron'
import { join } from 'path'

declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string
declare const CONSOLE_WINDOW_WEBPACK_ENTRY: string

const createConsoleWindow = async () => {
  const { isPackaged } = app
  const allWindows = BrowserWindow.getAllWindows()

  const activeConsoleWindow = allWindows.find((w) => w.getTitle() === 'Console')

  if (activeConsoleWindow) {
    activeConsoleWindow.focus()
    return activeConsoleWindow
  }

  const consoleWindow = new BrowserWindow({
    width: 900,
    height: 600,
    show: true,
    backgroundColor: '#000',
    icon: join(process.cwd(), 'public', 'icon', 'icon.ico'),
    ...(isPackaged
      ? {
          autoHideMenuBar: true,
        }
      : {}),
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      webSecurity: true,
    },
  })

  await consoleWindow.loadURL(CONSOLE_WINDOW_WEBPACK_ENTRY)

  return consoleWindow
}

export default createConsoleWindow
