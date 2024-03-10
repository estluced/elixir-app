import request from './request'
import { StrapiAttributes, StrapiDataMultiple } from '../types/strapi'
import { Client } from '../types/client'
import { FileMetadata } from '../types/downloads'

export const getClientMetadata = async ({
  slug,
}: {
  slug: string
}): Promise<FileMetadata[]> =>
  request(`/downloads/client/metadata/${slug}`).then((res) => res.json())
