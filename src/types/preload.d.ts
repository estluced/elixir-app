import { ElectronHandler } from '../main/preload'

type WEBPACK_PATHS = {
  PRELOADER_WINDOW_WEBPACK_ENTRY: string
  CONSOLE_WINDOW_WEBPACK_ENTRY: string
  MAIN_WINDOW_WEBPACK_ENTRY: string
  MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string
}

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler
    store: {
      // eslint-disable-next-line no-unused-vars
      get: (key: string) => any
      // eslint-disable-next-line no-unused-vars
      set: (key: string, val: any) => void
      clear: () => void
    }
  }

  module NodeJS {
    interface Global {
      WEBPACK_PATHS: WEBPACK_PATHS
    }
  }
}

export {}
