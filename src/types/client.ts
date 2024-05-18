import {
  StrapiAttributes,
  StrapiDataMultiple,
  StrapiDataSingle,
  StrapiMedia,
} from './strapi'
import { MinecraftClient, MinecraftVersion } from './minecraft'
import { Keyword } from './keyword'

export enum ClientStatusEnum {
  INSTALLED = 'installed',
  NOT_INSTALLED = 'not-installed',
  OUTDATED = 'outdated',
  ERROR = 'error',
  DOWNLOADING = 'downloading',
  LAUNCHED = 'launched',
}

export type ClientStatus =
  (typeof ClientStatusEnum)[keyof typeof ClientStatusEnum]

export interface Client {
  title: string
  description: string
  shortDescription: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string
  slug: string
  screenshots: StrapiDataMultiple<StrapiAttributes<StrapiMedia>>
  background: StrapiDataSingle<StrapiAttributes<StrapiMedia>>
  poster: StrapiDataSingle<StrapiAttributes<StrapiMedia>>
  minecraftVersion: StrapiDataSingle<StrapiAttributes<MinecraftVersion>>
  keywords: StrapiDataMultiple<StrapiAttributes<Keyword>>
  available: boolean
  uuid: string
  metadataUrl: string
  versionHashUrl: string
  status: ClientStatus
  servers?: string[]
  titleImage?: StrapiDataSingle<StrapiAttributes<StrapiMedia>>
}
