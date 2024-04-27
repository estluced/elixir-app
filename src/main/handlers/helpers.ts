import {
  IpcMainEvent,
  dialog,
  BrowserWindow,
  ipcMain,
  shell,
  app,
} from 'electron'
import checkDiskSpace, { DiskSpace } from 'check-disk-space'
import { request } from 'undici'
import { existsSync, mkdirSync, writeFileSync, rmdirSync } from 'fs'
import { join } from 'path'
import LauncherStore from '../utils/store'
import { StrapiMedia } from '../../types/strapi'
import getConfig from '../../utils/getConfig'
import { Client } from '../../types/client'
import initAppData from '../utils/initAppData'
import { getRAMRange } from '../utils/system'

interface DiskSpaceInfo extends DiskSpace {
  error?: boolean
}

const LAUNCHER_DIRNAME = 'Elixir'
const DEFAULT_PATH = app.getPath('userData')

const getDefaultInstallationPath = async (
  event: IpcMainEvent,
  path: string | undefined,
) => {
  const installPath = path || DEFAULT_PATH
  const diskSpace = await checkDiskSpace(installPath)
  event.reply('helpers/get-installation-path', {
    ...diskSpace,
    path: installPath,
  })
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
    ipcMain.on('client/set-installation-path', (_, path) => {
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
    initAppData(installationPathInfo.path)
    event.reply('helpers/set-installation-path', true)
  } catch (error) {
    event.reply('helpers/set-installation-path', false)
  }
}

const selectFolderHandler = async (
  event: IpcMainEvent,
  window: BrowserWindow,
) => {
  try {
    const result = await dialog.showOpenDialog(window, {
      properties: ['openDirectory'],
    })
    if (!result.canceled) {
      let diskSpace: DiskSpaceInfo
      try {
        diskSpace = await checkDiskSpace(result.filePaths[0])
      } catch (error) {
        diskSpace = {
          diskPath: '',
          free: 0,
          size: 0,
          error: true,
        }
      }
      const candidatePath = result.filePaths[0]
      const installPath = candidatePath.includes(LAUNCHER_DIRNAME)
        ? candidatePath
        : join(result.filePaths[0], LAUNCHER_DIRNAME)
      event.reply('helpers/select-folder', {
        ...diskSpace,
        path: installPath,
      })
    }
  } catch (error) {
    event.reply('core/error', {
      message: error?.message || error,
    })
  }
}

const openClientFolder = async (_: IpcMainEvent, client: Client) => {
  const store = LauncherStore.getInstance()
  const installationPath = store.get('installation-path')
  const clientPath = join(String(installationPath), client.uuid)
  await shell.openPath(clientPath)
}

const storeImage = async (_: IpcMainEvent, image: StrapiMedia) => {
  const config = getConfig()
  const imageUrl = `${config.API_URL_V2}${image.url}`

  try {
    const store = LauncherStore.getInstance()
    const installationPath = store.get('installation-path')
    const outputDirectory = `${installationPath}/.cache`
    const fileName = `${image.hash}${image.ext}`
    const filePath = `${outputDirectory}/${fileName}`

    if (existsSync(filePath)) {
      return
    }

    if (!existsSync(outputDirectory)) {
      mkdirSync(outputDirectory)
    }

    const { body } = await request(imageUrl)
    const imageData: Uint8Array[] = []

    // eslint-disable-next-line no-restricted-syntax
    for await (const chunk of body) {
      imageData.push(chunk)
    }

    const buffer = Buffer.concat(imageData)

    writeFileSync(filePath, buffer)
  } catch (error) {
    throw new Error(error)
  }
}

const getSkinInfo = async (event: IpcMainEvent) => {
  try {
    const store = LauncherStore.getInstance()
    const userName = store.get('userName')
    const config = getConfig()

    const skin = `${config.SKINS_SERVER}/skins/${userName}.png`
    const cape = `${config.SKINS_SERVER}/skins/${userName}_cape.png`

    event.reply(`helpers/account/skin`, {
      skin,
      cape,
    })
  } catch (error) {
    event.reply(`core/error`, {
      error,
    })
  }
}

const getRAMRangeArray = (event: IpcMainEvent) => {
  const rangeArray = getRAMRange()

  event.reply('helpers/get-ram-range-array', rangeArray)
}

const clearCache = async (event: IpcMainEvent) => {
  try {
    const store = LauncherStore.getInstance()
    const installationPath = String(store.get('installation-path'))
    const cachePath = join(installationPath, '.cache')

    if (existsSync(cachePath)) {
      rmdirSync(cachePath, { recursive: true })
    }

    event.reply('helpers/clear-cache', true)
  } catch (error) {
    event.reply('helpers/clear-cache', false)
  }
}

export {
  selectFolderHandler,
  getInstallationPath,
  setInstallationPath,
  getDefaultInstallationPath,
  getDiskSpaceByPath,
  storeImage,
  openClientFolder,
  getSkinInfo,
  getRAMRangeArray,
  clearCache,
}
