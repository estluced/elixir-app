import { ipcMain, IpcMainEvent } from 'electron'
import { Downloader } from '../utils/downloader'
import LauncherStore from '../utils/store'
import { StrapiAttributes, StrapiFile } from '../../types/strapi'

const downloadHandler = async (
  event: IpcMainEvent,
  downloadFile: StrapiAttributes<StrapiFile>,
) => {
  const store = LauncherStore.getInstance()
  const { id } = downloadFile
  const installationPath = String(store.get('installation-path'))
  const downloader = new Downloader({
    downloadId: id,
    installPath: installationPath,
  })
  downloader.addDownloads([downloadFile.attributes])
  downloader.startDownload()

  downloader.on(`${id}:start`, () => {
    event.reply(`core/download/${id}/start`, downloadFile.attributes)
  })

  downloader.on(`${id}:complete`, () => {
    event.reply(`core/download/${id}/complete`, downloadFile.attributes)
  })

  downloader.on(`${id}:file:progress`, (progressData) => {
    console.log(progressData)
    event.reply(`core/download/${id}/file:progress`, progressData)
  })

  downloader.on(`${id}:total:progress`, (progress) => {
    console.log(progress)
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

  event.reply('core/download', downloadFile.attributes)
}

export default downloadHandler
