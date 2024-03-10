export interface MinecraftClient {
  title: string
  version: string
}

interface File {
  id: string
  sha1: string
  size: number
  url: string
}

interface Os {
  name: string
}

interface Os2 {
  name: string
}

interface Os3 {
  name: string
  version: string
}

interface Os4 {
  arch: string
}

interface Rule2 {
  action: string
  os: Os2
}

interface Rule {
  action: string
  os: Os
}

interface Jvm2 {
  rules: Rule2[]
  value: string
}

interface Rule3 {
  action: string
  os: Os3
}

interface Rule4 {
  action: string
  os: Os4
}

interface Jvm3 {
  rules: Rule3[]
  value: string[]
}

interface Jvm {
  rules: Rule[]
  value: string[]
}

interface Jvm4 {
  rules: Rule4[]
  value: string
}

interface AssetIndex {
  id: string
  sha1: string
  size: number
  totalSize: number
  url: string
}

interface Client {
  sha1: string
  size: number
  url: string
}

interface ClientMappings {
  sha1: string
  size: number
  url: string
}

interface Server {
  sha1: string
  size: number
  url: string
}

interface ServerMappings {
  sha1: string
  size: number
  url: string
}

interface JavaVersion {
  component: string
  majorVersion: number
}

interface VersionDownloads {
  client: Client
  client_mappings: ClientMappings
  server: Server
  server_mappings: ServerMappings
}

interface Arguments {
  game: any[]
  jvm: [Jvm, Jvm2, Jvm3, Jvm4, string, string, string, string, string]
}

interface Client2 {
  argument: string
  file: File
  type: string
}

interface Logging {
  client: Client2
}

interface Artifact {
  path: string
  sha1: string
  size: number
  url: string
}

interface NativesOsx {
  path: string
  sha1: string
  size: number
  url: string
}

interface NativesLinux {
  path: string
  sha1: string
  size: number
  url: string
}

interface NativesWindows {
  path: string
  sha1: string
  size: number
  url: string
}

interface NativesMacos {
  path: string
  sha1: string
  size: number
  url: string
}

interface Classifiers {
  'natives-osx'?: NativesOsx
  'natives-linux'?: NativesLinux
  'natives-windows'?: NativesWindows
  'natives-macos'?: NativesMacos
}

interface Downloads2 {
  artifact: Artifact
  classifiers?: Classifiers
}

interface Os5 {
  name: string
}

interface Rule5 {
  action: string
  os?: Os5
}

interface Natives {
  osx?: string
  linux?: string
  windows?: string
}

interface Extract {
  exclude: string[]
}

interface Library {
  downloads: Downloads2
  name: string
  rules?: Rule5[]
  natives?: Natives
  extract?: Extract
}

export interface MinecraftManifest {
  arguments: Arguments
  assetIndex: AssetIndex
  assets: string
  complianceLevel: number
  downloads: VersionDownloads
  id: string
  javaVersion: JavaVersion
  libraries: Library[]
  logging: Logging
  mainClass: string
  minimumLauncherVersion: number
  releaseTime: string
  time: string
  type: string
  minecraftArguments?: string
}
