export interface FileMetadata {
  path: string
  sha256: string
  size: number
  url: string
  isDir: boolean
  name: string
}

export interface FilesMetadata {
  [key: string]: FileMetadata[]
}

export interface DownloadProgress {
  totalFiles: number
  downloadedFiles: number
  speed: number
}

export interface DownloadFileProgress {
  progress: number
  size: number
  speed: string
}
