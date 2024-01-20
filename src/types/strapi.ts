export interface StrapiResponse<T> {
  data: T
  error?: any
}

export interface StrapiDataSingle<T> {
  data: T
}

export interface StrapiDataMultiple<T> {
  data: T[]
}

export interface StrapiAttributes<T> {
  id: number
  attributes: T
}

export type StrapiMedia = {
  url: string
  ext: string
  width: number
  height: number
  size: number
  name: string
  hash: string
  createdAt: string
  updatedAt: string
  formats: {
    thumbnail?: StrapiMedia
    large?: StrapiMedia
    medium?: StrapiMedia
    small?: StrapiMedia
  }
}

export type StrapiFile = {
  url: string
  name: string
  ext: string
  size: number
  mime: string
  createdAt: string
  updatedAt: string
  hash: string
}
