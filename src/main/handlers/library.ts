import { IpcMainEvent } from 'electron'
import fs from 'fs'
import path from 'path'
import isEqual from 'lodash/isEqual'
import strapiRequest from '../../api/request'
import LauncherStore from '../utils/store'
import { StrapiAttributes, StrapiDataMultiple } from '../../types/strapi'
import { Client, ClientStatusEnum } from '../../types/client'
import getClientsFromApi from '../../api/getClients'

const getClientStatus = async (client: Client) => {
  try {
    const store = LauncherStore.getInstance()
    const installationPath = String(store.get('installation-path'))
    const clientPath = path.join(installationPath, client.uuid)
    const versionHashPath = path.join(clientPath, 'version-hash')
    const exists = fs.existsSync(versionHashPath)
    if (exists) {
      const remoteVersionHash = await strapiRequest(client.versionHashUrl).then(
        (res) => res.text(),
      )
      const localVersionHash = fs.readFileSync(versionHashPath, 'utf-8')
      if (remoteVersionHash !== localVersionHash) {
        return ClientStatusEnum.OUTDATED
      }
    } else {
      return ClientStatusEnum.NOT_INSTALLED
    }
    return ClientStatusEnum.INSTALLED
  } catch (error) {
    return ClientStatusEnum.ERROR
  }
}

export const checkClientsStatuses = async (
  event: IpcMainEvent,
  clients: StrapiDataMultiple<StrapiAttributes<Client>>,
) => {
  const clientsPromises = clients.data.map(async ({ id, attributes }) => {
    const status = await getClientStatus(attributes)
    return {
      id,
      attributes: {
        ...attributes,
        status,
      },
    }
  })

  const clientsWithStatuses = await Promise.all(clientsPromises)

  event.reply('core/library/get-clients-statuses', clientsWithStatuses)
}

export const getClients = (event: IpcMainEvent) => {
  const store = LauncherStore.getInstance()
  const installationPath = String(store.get('installation-path'))
  const localClientsPath = path.join(installationPath, 'clients.json')
  const getLocalClients = () => {
    try {
      const clientsJson = fs.readFileSync(localClientsPath, 'utf-8')
      return JSON.parse(clientsJson) as StrapiDataMultiple<
        StrapiAttributes<Client>
      >
    } catch (e) {
      return { data: [] }
    }
  }

  const writeLocalClients = (
    clients: StrapiDataMultiple<StrapiAttributes<Client>>,
  ) => {
    try {
      fs.writeFileSync(localClientsPath, JSON.stringify(clients))
      return clients
    } catch (e) {
      return { data: [] }
    }
  }

  getClientsFromApi()
    .then((clients) => {
      const localClients = getLocalClients()
      if (
        localClients?.data?.length === 0 ||
        localClients?.data?.length !== clients?.data?.length ||
        !isEqual(localClients, clients)
      ) {
        const newLocalClients = writeLocalClients(clients)
        event.reply('core/library/get-clients', newLocalClients)
      } else {
        event.reply('core/library/get-clients', localClients)
      }
    })
    .catch(() => {
      event.reply('core/library/get-clients', getLocalClients())
    })
}
