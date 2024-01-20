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
  screenshots: StrapiDataMultiple<StrapiAttributes<StrapiMedia>>
  background: StrapiDataSingle<StrapiAttributes<StrapiMedia>>
  poster: StrapiDataSingle<StrapiAttributes<StrapiMedia>>
  mainFile: StrapiDataSingle<StrapiAttributes<StrapiFile>>
  updateFile: StrapiDataSingle<StrapiAttributes<StrapiFile>>
  version: StrapiDataSingle<StrapiAttributes<MinecraftClient>>
  keywords: StrapiDataMultiple<StrapiAttributes<Keyword>>
  available: boolean
}
