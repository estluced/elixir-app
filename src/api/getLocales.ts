import request from './request'
import { Locale } from '../types/strapi'

const getLocales = async (): Promise<Locale[]> =>
  request('/api/i18n/locales').then((res) => res.json())

export default getLocales
