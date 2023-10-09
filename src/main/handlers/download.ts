import { ipcMain, IpcMainEvent } from 'electron'
import { request } from 'undici'
import path from 'path'
import { Downloader, DownloadFile } from '../utils/downloader'
import LauncherStore from '../utils/store'

interface DownloadInfo {
  id: number | string
  filename: string
  url: string
}

const downloadHandler = async (
  event: IpcMainEvent,
  downloadInfo: DownloadInfo,
) => {
  const store = LauncherStore.getInstance()
  request(downloadInfo.url)
    .then(async ({ body }) => {
      const installationPath = String(store.get('installation-path'))
      const filesResponse = (await body.json()) as DownloadFile[]
      const files = filesResponse.filter((file: any) => !file.isDir)
      const { id } = downloadInfo
      const downloader = new Downloader({ downloadId: id })
      const downloads = files.map((file) => ({
        ...file,
        path: path.join(installationPath, file.path),
      }))
      downloader.addDownloads(downloads)
      downloader.startDownload()

      downloader.on(`${id}:start`, () => {
        event.reply(`core/download/${id}/start`, downloadInfo)
      })

      downloader.on(`${id}:complete`, () => {
        event.reply(`core/download/${id}/complete`, downloadInfo)
      })

      downloader.on(`${id}:file:progress`, (progressData) => {
        event.reply(`core/download/${id}/file:progress`, progressData)
      })

      downloader.on(`${id}:total:progress`, (progress) => {
        event.reply(`core/download/${id}/total:progress`, progress)
      })

      downloader.on(`${id}:paused`, () => {
        event.reply(`core/download/${id}/paused`, true)
      })

      downloader.on(`${id}:resumed`, () => {
        event.reply(`core/download/${id}/resumed`, false)
      })

      ipcMain.on(`core/download/${id}/pause`, () => {
        downloader.pauseDownload()
      })

      ipcMain.on(`core/download/${id}/resume`, () => {
        downloader.resumeDownload()
      })

      ipcMain.on(`core/download/${id}/cancel`, () => {
        downloader.cancelDownload()
      })

      event.reply('core/download', downloadInfo)
    })
    .catch(console.log)
}

export default downloadHandler
