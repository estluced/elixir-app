import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

export type Channels = string

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, args?: any) {
      ipcRenderer.send(channel, args)
      return {
        on: (func: (...args: any[]) => void) => {
          const subscription = (_event: IpcRendererEvent, ...args: any[]) =>
            func(...args)
          ipcRenderer.on(channel, subscription)

          return () => {
            ipcRenderer.removeListener(channel, subscription)
          }
        },
      }
    },
    on(channel: Channels, func: (...args: any[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: any[]) =>
        func(...args)
      ipcRenderer.on(channel, subscription)

      return () => {
        ipcRenderer.removeListener(channel, subscription)
      }
    },
    once(channel: Channels, func: (...args: any[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args))
    },
  },
  store: {
    get(key: string) {
      return ipcRenderer.sendSync('electron-store-get', key)
    },
    set(property: string, val: any) {
      ipcRenderer.send('electron-store-set', property, val)
    },
    clear() {
      ipcRenderer.send('electron-store-clear')
    },
  },
}

contextBridge.exposeInMainWorld('electron', electronHandler)

export type ElectronHandler = typeof electronHandler
