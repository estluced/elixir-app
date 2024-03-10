import getConfig from '../utils/getConfig'

const config = getConfig()

const request = async (url: string, method?: string, payload?: any) =>
  fetch(`${config.API_URL_V2}${url}`, {
    method: method || 'GET',
    body: payload ? JSON.stringify(payload) : undefined,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.API_TOKEN}`,
    },
  })

export default request
