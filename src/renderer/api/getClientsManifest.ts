import { Manifest } from '../../types/manifest'
import getConfig from '../../utils/getConfig'

const { API_URL } = getConfig()

const getClientsManifest = async (): Promise<Manifest> =>
  fetch(`${API_URL}/manifest`).then((res) => res.json())

export default getClientsManifest
