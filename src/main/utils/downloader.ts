import { AsyncResultCallback, queue, QueueObject } from 'async'
import { request } from 'undici'
import { createWriteStream, promises, existsSync, statSync } from 'fs'
import { dirname } from 'path'
import crypto from 'crypto'
import { EventEmitter } from 'events'
import { FileMetadata } from '../../types/downloads'

export interface DownloaderProps {
  downloadId?: number | string
}

export interface DownloadFile extends FileMetadata {
  afterDirCreate?: (destination: string) => void
}

class Downloader extends EventEmitter {
  private queue: QueueObject<DownloadFile>

  private readonly downloadId?: number | string

  private downloadSpeed: number = 0

  public totalFiles: number = 0

  constructor({ downloadId }: DownloaderProps = {}) {
    super()

    this.downloadId = downloadId

    this.queue = queue(this.downloadWorker.bind(this), 1)

    this.queue.drain(() => {
      this.emitEvent('complete', {
        totalFiles: this.totalFiles,
        downloadedFiles: this.totalFiles,
        speed: 0,
      })
      this.downloadSpeed = 0
      this.queue.kill()
    })

    this.queue.error((err) => {
      this.emitEvent('error', {
        error: err,
      })
      this.queue.kill()
    })

    this.queue.saturated(() => {
      const queueLength = this.queue.length()
      this.emitEvent('progress', {
        totalFiles: this.totalFiles,
        downloadedFiles: this.totalFiles - queueLength,
        speed: this.downloadSpeed,
      })
    })
  }

  private emitEvent(event: string, ...args: any[]) {
    this.emit(
      `${this.downloadId ? `${this.downloadId}:` : ''}${event}`,
      ...args,
    )
  }

  public addDownloads(files: DownloadFile[]) {
    this.totalFiles = files.length
    files.forEach((file) => {
      this.queue.push(file)
    })
    this.emitEvent('start')
  }

  public pause() {
    this.queue.pause()
    this.downloadSpeed = 0
  }

  public resume() {
    this.queue.resume()
  }

  public cancel() {
    this.queue.kill()
    this.downloadSpeed = 0
  }

  private async downloadWorker(
    file: DownloadFile,
    cb: AsyncResultCallback<() => void>,
  ) {
    try {
      const { url, path, sha256, isDir, afterDirCreate } = file
      const startTime = Date.now()
      let downloadedBytes = 0

      if (isDir) {
        await promises.mkdir(path, { recursive: true })
        if (afterDirCreate) afterDirCreate(path)
        cb()
        return
      }

      if (existsSync(path)) {
        const fileStat = statSync(path)
        const fileHash = crypto
          .createHash('sha256')
          .update(String(fileStat.size))
          .digest('hex')
        if (fileHash === sha256) {
          cb()
          return
        }
      } else {
        await promises.mkdir(dirname(path), { recursive: true })
      }

      const { body, statusCode } = await request(
        url.replace('localhost', '127.0.0.1'),
        {
          method: 'GET',
        },
      )

      if (statusCode === 200) {
        const writer = createWriteStream(path)

        body.on('data', (chunk) => {
          writer.write(chunk)
          downloadedBytes += chunk.length

          const currentTime = Date.now()
          const elapsedTime = (currentTime - startTime) / 1000

          this.downloadSpeed = downloadedBytes / elapsedTime
        })

        body.on('error', (err) => {
          writer.end()
          writer.close()
          cb(err)
        })

        body.on('end', () => {
          writer.end()
          writer.close()
        })

        writer.on('finish', () => {
          cb()
        })

        writer.on('error', (err) => {
          writer.end()
          writer.close()
          cb(err)
        })
      } else {
        cb(new Error(`${statusCode} - ${url}`))
      }
    } catch (e) {
      this.emitEvent('error', e)
      this.queue.kill()
      cb(e)
    }
  }
}

export default Downloader
