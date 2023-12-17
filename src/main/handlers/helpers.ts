import { IpcMainEvent, dialog, BrowserWindow, ipcMain } from 'electron'
import { homedir } from 'os'
import checkDiskSpace from 'check-disk-space'
import { request } from 'undici'
import { createHash } from 'crypto'
import fs from 'fs'
import LauncherStore from '../utils/store'

const DEFAULT_PATH = `${homedir()}\\Elixir`

const getDefaultInstallationPath = async () => {
  const diskSpace = await checkDiskSpace(DEFAULT_PATH)
  return {
    ...diskSpace,
    path: DEFAULT_PATH,
  }
}

const getDiskSpaceByPath = async (event: IpcMainEvent, path: string) => {
  checkDiskSpace(path)
    .then((diskSpace) => {
      event.reply('helpers/get-disk-space-by-path', diskSpace)
    })
    .catch(console.log)
}

const getInstallationPath = () => {
  const store = LauncherStore.getInstance()
  let installationPath = store.get('installation-path')
  if (!installationPath) {
    ipcMain.emit('client/open-installation-path-dialog')
    ipcMain.on('client/set-installation-path', (event, path) => {
      installationPath = path
    })
  }
  return installationPath
}

const setInstallationPath = (
  event: IpcMainEvent,
  installationPathInfo: {
    path: string
  },
) => {
  try {
    const store = LauncherStore.getInstance()
    store.set('installation-path', installationPathInfo.path)
    event.reply('helpers/set-installation-path', true)
  } catch (error) {
    event.reply('helpers/set-installation-path', false)
  }
}

const selectFolderHandler = async (
  event: IpcMainEvent,
  window: BrowserWindow,
) => {
  const result = await dialog.showOpenDialog(window, {
    properties: ['openDirectory'],
  })
  if (!result.canceled) {
    const diskSpace = await checkDiskSpace(result.filePaths[0])
    event.reply('helpers/select-folder', {
      ...diskSpace,
      path: result.filePaths[0],
    })
  }
}

const storeImage = async (event: IpcMainEvent, imageUrl: string) => {
  try {
    const store = LauncherStore.getInstance()
    const installationPath = store.get('installation-path')
    const outputDirectory = `${installationPath}/.cache`
    if (!fs.existsSync(outputDirectory)) {
      fs.mkdirSync(outputDirectory)
    }

    const { body } = await request(
      imageUrl.replace('http://localhost', 'http://127.0.0.1'),
    )
    const imageData: Uint8Array[] = []

    // eslint-disable-next-line no-restricted-syntax
    for await (const chunk of body) {
      imageData.push(chunk)
    }

    const buffer = Buffer.concat(imageData)
    const hash = createHash('sha256').update(buffer).digest('hex')
    const fileName = `${hash}.png`
    const filePath = `${outputDirectory}/${fileName}`

    fs.writeFileSync(filePath, buffer)

    event.reply('helpers/cache-image', filePath)
  } catch (error) {
    console.log(error)
    event.reply('helpers/cache-image', imageUrl)
  }
}

export {
  selectFolderHandler,
  getInstallationPath,
  setInstallationPath,
  getDefaultInstallationPath,
  getDiskSpaceByPath,
  storeImage,
}
