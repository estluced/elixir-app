import { ipcMain, IpcMainEvent } from 'electron'
import { join } from 'path'
import { existsSync, promises, readFileSync, symlinkSync, rmSync } from 'fs'
import Downloader, { DownloadFile } from '../utils/downloader'
import LauncherStore from '../utils/store'
import request from '../../api/request'
import { FilesMetadata } from '../../types/downloads'
import { Client, ClientStatusEnum } from '../../types/client'

const initSkinsSymlink = (destination: string) => {
  const store = LauncherStore.getInstance()
  const installationPath = String(store.get('installation-path'))
  const userDataPath = join(installationPath, 'user-data')

  const skinsDir = join(userDataPath, 'skins')

  rmSync(destination, { recursive: true, force: true })
  symlinkSync(skinsDir, destination, 'junction')
}

const initCapesSymlink = (destination: string) => {
  const store = LauncherStore.getInstance()
  const installationPath = String(store.get('installation-path'))
  const userDataPath = join(installationPath, 'user-data')

  const capesDir = join(userDataPath, 'capes')

  rmSync(destination, { recursive: true, force: true })
  symlinkSync(capesDir, destination, 'junction')
}

const downloadHandler = async (event: IpcMainEvent, client: Client) => {
  const store = LauncherStore.getInstance()

  try {
    event.reply(`core/download/${client.uuid}/start`, {
      status: ClientStatusEnum.DOWNLOADING,
    })

    const clientMetadata: FilesMetadata = await request(
      client.metadataUrl,
      null,
      null,
      false,
    ).then((res) => res.json())

    const installationPath = String(store.get('installation-path'))
    const installPath = join(installationPath, client.uuid)

    const localMetadataPath = join(installPath, 'artifacts.json')

    const files = Object.values(clientMetadata)
      .flat()
      .map((downloadFile: DownloadFile) => {
        const path = join(installPath, downloadFile.path)

        if (downloadFile.path.includes('CustomSkinLoader/LocalSkin/skins')) {
          return {
            ...downloadFile,
            path,
            afterDirCreate: (destination: string) =>
              initSkinsSymlink(destination),
          }
        }

        if (downloadFile.path.includes('CustomSkinLoader/LocalSkin/capes')) {
          return {
            ...downloadFile,
            path,
            afterDirCreate: (destination: string) =>
              initCapesSymlink(destination),
          }
        }

        return {
          ...downloadFile,
          path,
        }
      })

    if (existsSync(localMetadataPath)) {
      const localMetadata = JSON.parse(
        readFileSync(localMetadataPath, 'utf-8') || '{}',
      ) as FilesMetadata

      const localFiles = Object.values(localMetadata)
        .flat()
        .map((downloadFile) => ({
          ...downloadFile,
          path: join(installPath, downloadFile.path),
        }))

      const filesPaths = files.map((file) => file.path)

      const filesToRemove = localFiles.filter(
        (file) => !filesPaths.includes(file.path),
      )

      filesToRemove
        .sort((a, b) => {
          if (a.isDir && !b.isDir) return 1
          if (!a.isDir && b.isDir) return -1
          return 0
        })
        .forEach((file) => {
          if (existsSync(file.path)) {
            rmSync(file.path, {
              recursive: true,
              force: true,
            })
          }
        })
    }

    const downloader = new Downloader({
      downloadId: client.uuid,
    })

    downloader.addDownloads(files)

    downloader.on(`${client.uuid}:progress`, (progress) => {
      event.reply(`core/download/${client.uuid}/total:progress`, {
        status: ClientStatusEnum.DOWNLOADING,
        progress,
      })
    })

    downloader.on(`${client.uuid}:complete`, () => {
      event.reply(`core/download/${client.uuid}/complete`, {
        status: ClientStatusEnum.INSTALLED,
      })
      downloader.removeAllListeners()
    })

    downloader.on(`${client.uuid}:error`, (error) => {
      event.reply(`core/error`, {
        error,
      })
      event.reply(`core/download/${client.uuid}/complete`, {
        status: ClientStatusEnum.NOT_INSTALLED,
      })
      downloader.removeAllListeners()
    })

    ipcMain.on(`core/download/${client.uuid}/pause`, () => {
      downloader.pause()
      event.reply(`core/download/${client.uuid}/paused`, true)
    })

    ipcMain.on(`core/download/${client.uuid}/resume`, () => {
      downloader.resume()
      event.reply(`core/download/${client.uuid}/resumed`, false)
    })

    ipcMain.on(`core/download/${client.uuid}/cancel`, () => {
      downloader.cancel()
      event.reply(`core/download/${client.uuid}/complete`, {
        status: ClientStatusEnum.NOT_INSTALLED,
      })
      downloader.removeAllListeners()
      promises.rmdir(installPath, { recursive: true })
    })
  } catch (error) {
    event.reply(`core/error`, {
      error,
    })
    event.reply(`core/download/${client.uuid}/complete`, {
      status: ClientStatusEnum.NOT_INSTALLED,
    })
    event.reply(`core/download/${client.uuid}/error`, {
      status: ClientStatusEnum.ERROR,
      error,
    })
  }
}

export default downloadHandler
