import request from './request'
import { StrapiAttributes, StrapiDataMultiple } from '../types/strapi'
import { Client } from '../types/client'

const getClients = async (): Promise<
  StrapiDataMultiple<StrapiAttributes<Client>>
> => request('/clients?populate=*').then((res) => res.json())

export default getClients
