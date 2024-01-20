import { createWriteStream, promises, createReadStream } from 'fs'
import { basename, dirname, join } from 'path'
import { EventEmitter } from 'events'
import { request } from 'undici'
import unzipper from 'unzipper'
import { StrapiFile } from '../../types/strapi'
import getConfig from '../../utils/getConfig'

const config = getConfig()

export interface DownloadFile {
  path: string
  sha256: string
  size: number
  url: string
  func?: (file: DownloadFile) => void
}

export interface DownloadProgress {
  totalFiles: number
  downloadedFiles: number
  progress: number
}

export interface DownloadFileProgress {
  progress: number
  size: number
  speed: string
}

export class Downloader extends EventEmitter {
  private fileDownloads: StrapiFile[]

  private readonly downloadProgress: DownloadProgress

  private isPaused: boolean

  private isError: boolean

  private readonly downloadId?: number | string

  public readonly installPath?: string

  private speedTracker: {
    startTime: number
    startBytes: number
    speed: string
  } | null

  constructor(props?: { downloadId?: number | string; installPath: string }) {
    super()
    this.installPath = props?.installPath
    this.downloadId = props?.downloadId
    this.fileDownloads = []
    this.downloadProgress = {
      totalFiles: 0,
      downloadedFiles: 0,
      progress: 0,
    }
    this.speedTracker = {
      startTime: Date.now(),
      startBytes: 0,
      speed: '0 B/s',
    }
    this.isPaused = false
    this.isError = false
  }

  public addDownloads(files: StrapiFile[]) {
    this.downloadProgress.totalFiles = files.length
    this.fileDownloads = [...this.fileDownloads, ...files]
  }

  private async createPath(location: string): Promise<string> {
    const dir = dirname(location)
    await promises.mkdir(dir, { recursive: true })
    return dir
  }

  private async createFile(dir: string, fileName: string): Promise<void> {
    const filePath = join(dir, fileName)
    await promises.writeFile(filePath, '')
  }

  private formatBytes(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes.toFixed(0)} B`
    }
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(0)} KB`
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  private updateSpeed(downloadedBytes: number): void {
    if (this.speedTracker != null) {
      const currentTime = Date.now()
      const elapsedTime = (currentTime - this.speedTracker.startTime) / 1000
      const bytesPerSecond =
        (downloadedBytes - this.speedTracker.startBytes) / elapsedTime
      this.speedTracker.speed = `${this.formatBytes(bytesPerSecond)}/s`
    }
  }

  private async downloadFile(downloadFile: StrapiFile): Promise<void> {
    const { url, size, hash, ext } = downloadFile
    const location = join(this.installPath, hash + ext)
    this.speedTracker = {
      startTime: Date.now(),
      startBytes: 0,
      speed: '0 B/s',
    }
    let downloadedBytes = 0

    try {
      const { body, headers } = await request(config.API_URL_V2 + url, {
        method: 'GET',
      })

      const writer = createWriteStream(location)
      const contentLength = size ?? headers['content-length']

      body.on('data', (chunk: any) => {
        writer.write(chunk)
        downloadedBytes += chunk.length
        this.updateSpeed(downloadedBytes)
        const progress = (downloadedBytes / Number(contentLength)) * 100
        const downloadFileProgressData: DownloadFileProgress = {
          progress,
          size: Number(contentLength),
          speed: this.speedTracker?.speed ?? '0 B/s',
        }
        this.emit(
          `${this.downloadId ? `${this.downloadId}:` : ''}file:progress`,
          downloadFileProgressData,
        )
      })

      body.on('end', () => {
        writer.end()
      })

      const nextStep = () => {
        this.updateTotalProgress()
        if (
          this.downloadProgress.downloadedFiles ===
          this.downloadProgress.totalFiles
        ) {
          this.emit(`${this.downloadId ? `${this.downloadId}:` : ''}complete`)
        } else {
          this.downloadNextFile()
        }
      }

      writer.on('finish', () => {
        if (ext.includes('zip')) {
          this.emit(
            `${this.downloadId ? `${this.downloadId}:` : ''}decompress:started`,
          )
          const zipFile = createReadStream(location).pipe(
            unzipper.Extract({
              path: this.installPath,
            }),
          )
          zipFile.on('close', () => {
            nextStep()
          })
        } else {
          nextStep()
        }
      })
    } catch (error) {
      this.emit('error', error)
      this.updateTotalProgress()
    }
  }

  private updateTotalProgress(): void {
    // eslint-disable-next-line no-plusplus
    this.downloadProgress.downloadedFiles++
    this.emit(
      `${this.downloadId ? `${this.downloadId}:` : ''}total:progress`,
      this.downloadProgress,
    )
  }

  private async downloadNextFile(): Promise<void> {
    if (this.isPaused || this.isError) {
      return
    }

    if (
      this.downloadProgress.downloadedFiles === this.downloadProgress.totalFiles
    ) {
      this.emit(`${this.downloadId ? `${this.downloadId}:` : ''}complete`)
      return
    }

    const fileDownload =
      this.fileDownloads[this.downloadProgress.downloadedFiles]

    const location = join(
      this.installPath,
      fileDownload.hash + fileDownload.ext,
    )

    try {
      if (fileDownload) {
        const dir = await this.createPath(location)
        const fileName = basename(location)
        await this.createFile(dir, fileName)
        await this.downloadFile(fileDownload)
      } else {
        this.updateTotalProgress()
        this.downloadNextFile()
      }
    } catch (error) {
      this.isError = true
      this.emit('error', error)
    }
  }

  public startDownload(): void {
    this.emit(`${this.downloadId ? `${this.downloadId}:` : ''}start`)
    this.downloadNextFile()
  }

  public pauseDownload(): void {
    this.isPaused = true
    this.emit(`${this.downloadId ? `${this.downloadId}:` : ''}paused`)
  }

  public cancelDownload(): void {
    this.fileDownloads = []
    this.isPaused = false
    this.isError = false
    this.downloadProgress.downloadedFiles = 0
    this.downloadProgress.progress = 0
    this.downloadProgress.totalFiles = 0
    this.emit(`${this.downloadId ? `${this.downloadId}:` : ''}complete`)
  }

  public resumeDownload(): void {
    this.isPaused = false
    this.emit(`${this.downloadId ? `${this.downloadId}:` : ''}resumed`)
    this.downloadNextFile()
  }

  public getEventListener() {
    return this.on
  }
}
