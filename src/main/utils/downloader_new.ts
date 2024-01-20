import { basename, dirname, join } from 'path'
import fs from 'fs'
import { request } from 'undici'
import { EventEmitter } from 'events'
import { StrapiFile } from '../../types/strapi'

interface DownloaderProps {
  installPath?: string
  apiUrl: string
}

class Downloader {
  public readonly installPath?: string

  private eventEmitter: EventEmitter

  private downloadList: StrapiFile[] = []

  private readonly apiUrl: string

  constructor({ installPath, apiUrl }: DownloaderProps) {
    this.installPath = installPath
    this.eventEmitter = new EventEmitter()
    this.apiUrl = apiUrl
  }

  public addDownload(file: StrapiFile) {
    this.downloadList.push(file)
  }

  private checkInstallPathExists() {
    const { installPath } = this
    return fs.existsSync(installPath!)
  }

  private emit(event: string, data: any) {
    this.eventEmitter.emit(`download-event:${event}`, data)
  }

  private async download(index: number) {
    const { installPath, downloadList } = this
    const file = downloadList[index]
    const { hash, size, url, ext } = file
    const path = join(installPath!, `${hash}.${ext}`)

    if (this.checkInstallPathExists()) {
      const stream = fs.createWriteStream(path)
      const { body, headers, statusCode } = await request(
        `${this.apiUrl}${url}`,
      )
      if (statusCode === 200) {
        this.emit('total-progress', {
          total: downloadList.length,
          loaded: index + 1,
        })
        let loadedBytes = 0
        const totalBytes = Number(size ?? headers['content-length'])
        body.pipe(stream)
        body.on('error', (err) => {
          this.emit('error', err)
        })
        body.on('data', (chunk) => {
          loadedBytes += chunk.length

          const progress = {
            loaded: loadedBytes,
            total: totalBytes,
            percent: ((loadedBytes / totalBytes) * 10).toFixed(0),
          }

          this.emit('progress', progress)
        })
        body.on('end', () => {
          this.emit('end', file)
          this.download(index + 1)
        })
      } else {
        this.emit('error', new Error('Download failed'))
      }
    } else {
      fs.mkdirSync(installPath!, { recursive: true })
      await this.download(index)
    }
  }

  public on(event: string, callback: (...args: any[]) => void) {
    this.eventEmitter.on(event, callback)
  }

  public async startDownload(index?: number) {
    await this.download(index || 0)
  }
}

export default Downloader
