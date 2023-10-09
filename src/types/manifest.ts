export interface ClientManifest {
  artifacts: string
  gameVersion: string
  name: string
  description: string
  slug: string
  private: boolean
  logo?: {
    localUrl: string
    remoteUrl: string
  }
  screenshots?: {
    localUrl: string
    remoteUrl: string
  }[]
  background?: {
    localUrl: string
    remoteUrl: string
  }
  type: 'client' | 'modify-client'
  manifestPath: string
}

export interface ManifestArrayElement {
  description: string
  name: string
  gameVersion: string
  logo: string
  manifest: string
  slug: string
  type: 'client' | 'modify-client'
  manifestPath: string
}

export type Manifest = ManifestArrayElement[]
