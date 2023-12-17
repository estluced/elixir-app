import {
  StrapiAttributes,
  StrapiDataMultiple,
  StrapiDataSingle,
  StrapiFile,
  StrapiMedia,
} from './strapi'
import { MinecraftClient } from './minecraft'
import { Keyword } from './keyword'

export interface Client {
  title: string
  description: string
  shortDescription: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string
  slug: string
  screenshots: StrapiDataMultiple<StrapiMedia>
  background: StrapiDataSingle<StrapiMedia>
  poster: StrapiDataSingle<StrapiMedia>
  mainFile: StrapiDataSingle<StrapiFile>
  updateFile: StrapiDataSingle<StrapiFile>
  version: StrapiDataSingle<StrapiAttributes<MinecraftClient>>
  keywords: StrapiDataMultiple<StrapiAttributes<Keyword>>
  available: boolean
}
