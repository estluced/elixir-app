import { ClientManifest } from '../../types/manifest'
import getConfig from '../../utils/getConfig'

const { API_URL } = getConfig()

const getClientManifest = async ({
  manifestUrl,
}: {
  manifestUrl: string
}): Promise<ClientManifest> => {
  return fetch(manifestUrl).then((res) => res.json())
}

export default getClientManifest
