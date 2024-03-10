import { IpcMainEvent, dialog, BrowserWindow, ipcMain, shell } from 'electron'
import { homedir, totalmem } from 'os'
import checkDiskSpace from 'check-disk-space'
import { request } from 'undici'
import { existsSync, mkdirSync, unlinkSync, writeFileSync, rmdirSync } from 'fs'
import { join } from 'path'
import LauncherStore from '../utils/store'
import { StrapiMedia } from '../../types/strapi'
import getConfig from '../../utils/getConfig'
import { Client } from '../../types/client'
import { Account } from '../../types/account'

const DEFAULT_PATH = `${homedir()}\\Elixir`

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

const openClientFolder = async (event: IpcMainEvent, client: Client) => {
  const store = LauncherStore.getInstance()
  const installationPath = store.get('installation-path')
  const clientPath = join(String(installationPath), client.uuid)
  await shell.openPath(clientPath)
}

const storeImage = async (event: IpcMainEvent, image: StrapiMedia) => {
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

const saveSkinInfo = async (
  event: IpcMainEvent,
  skinInfo: {
    skin: string
    cape: string
  },
) => {
  try {
    const store = LauncherStore.getInstance()
    const { skin, cape } = skinInfo
    const { username } = JSON.parse(
      (store.get('account') as string) || '{}',
    ) as Account
    const installationPath = String(store.get('installation-path'))
    const userDataPath = join(installationPath, 'user-data')

    const skinsDir = join(userDataPath, 'skins')
    const capeDir = join(userDataPath, 'capes')

    if (!existsSync(skinsDir)) {
      mkdirSync(skinsDir, { recursive: true })
    }

    if (!existsSync(capeDir)) {
      mkdirSync(capeDir, { recursive: true })
    }

    const skinPath = join(skinsDir, `${username}.png`)
    const capePath = join(capeDir, `${username}.png`)

    if (skin) {
      writeFileSync(
        skinPath,
        skin.replace(/^data:image\/png;base64,/, ''),
        'base64',
      )
    }

    if (cape) {
      writeFileSync(
        capePath,
        cape.replace(/^data:image\/png;base64,/, ''),
        'base64',
      )
    }

    event.reply(`helpers/account/skin/save`, {
      skin,
      cape,
    })
  } catch (error) {
    event.reply(`core/error`, {
      error,
    })
  }
}

const resetSkinInfo = async (event: IpcMainEvent) => {
  try {
    const store = LauncherStore.getInstance()
    const { username } = JSON.parse(
      (store.get('account') as string) || '{}',
    ) as Account
    const installationPath = String(store.get('installation-path'))
    const userDataPath = join(installationPath, 'user-data')

    const skinsDir = join(userDataPath, 'skins')
    const capeDir = join(userDataPath, 'capes')

    const skinPath = join(skinsDir, `${username}.png`)
    const capePath = join(capeDir, `${username}.png`)

    const paths = [skinPath, capePath]

    paths.forEach((path) => {
      if (existsSync(path)) {
        unlinkSync(path)
      }
    })

    event.reply(`helpers/account/skin/reset`, {
      skin: undefined,
      cape: undefined,
    })
  } catch (error) {
    event.reply(`core/error`, {
      error,
    })
  }
}

const getSkinInfo = async (event: IpcMainEvent) => {
  try {
    const store = LauncherStore.getInstance()
    const { username } = JSON.parse(
      (store.get('account') as string) || '{}',
    ) as Account
    const installationPath = String(store.get('installation-path'))
    const userDataPath = join(installationPath, 'user-data')

    const skinsDir = join(userDataPath, 'skins')
    const capeDir = join(userDataPath, 'capes')

    const skinPath = join(skinsDir, `${username}.png`)
    const capePath = join(capeDir, `${username}.png`)

    const skin = existsSync(skinPath) ? skinPath : undefined
    const cape = existsSync(capePath) ? capePath : undefined

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
  const totalMemoryMB = Math.floor(totalmem() / 1024 / 1024)

  const start = 2024
  const end = totalMemoryMB % 2 === 0 ? totalMemoryMB : totalMemoryMB - 1
  const step = 2000

  const rangeArray = []

  for (let i = start; i <= end; i += step) {
    if (i % 2 === 0) {
      rangeArray.push(i)
    }
  }

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
  saveSkinInfo,
  getSkinInfo,
  resetSkinInfo,
  getRAMRangeArray,
  clearCache,
}
