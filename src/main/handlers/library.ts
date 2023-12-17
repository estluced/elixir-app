import { IpcMainEvent } from 'electron'
import fs from 'fs'
import { request } from 'undici'
import path from 'path'
import isEqual from 'lodash/isEqual'
import { ManifestArrayElement, Manifest } from '../../types/manifest'
import LauncherStore from '../utils/store'
import { StrapiAttributes, StrapiDataMultiple } from '../../types/strapi'
import { Client } from '../../types/client'
import getClientsFromApi from '../../api/getClients'

export const checkClientIsInstalled = (
  event: IpcMainEvent,
  manifestPath: string,
) => {
  try {
    const store = LauncherStore.getInstance()
    const installationPath = String(store.get('installation-path'))
    const clientPath = path.join(installationPath, manifestPath)
    const exists = fs.existsSync(clientPath)
    event.reply('core/library/check-client-exists', exists)
  } catch (e) {
    event.reply('core/library/check-client-exists', false)
  }
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

export const getClientManifest = (
  event: IpcMainEvent,
  manifestInfo: ManifestArrayElement,
) => {
  if (manifestInfo) {
    const store = LauncherStore.getInstance()
    const installationPath = String(store.get('installation-path'))
    const localManifestPath = path.join(
      installationPath,
      manifestInfo.manifestPath,
    )
    const getLocalManifest = () => {
      try {
        const manifestJson = fs.readFileSync(localManifestPath, 'utf-8')
        const manifest = JSON.parse(manifestJson) as Manifest
        return manifest
      } catch (e) {
        return {}
      }
    }
    const writeLocalManifest = (manifest: Manifest) => {
      try {
        fs.writeFileSync(localManifestPath, JSON.stringify(manifest))
        return manifest
      } catch (e) {
        return {}
      }
    }
    request(manifestInfo.manifest)
      .then(async ({ body }) => {
        const remoteManifest = (await body.json()) as Manifest
        const localManifest = getLocalManifest()
        const isEquals =
          JSON.stringify(remoteManifest) === JSON.stringify(localManifest)
        if (isEquals) {
          event.reply('core/library/get-client-manifest', localManifest)
        } else {
          const newLocalManifest = writeLocalManifest(remoteManifest)
          event.reply('core/library/get-client-manifest', newLocalManifest)
        }
      })
      .catch(() => {
        event.reply('core/library/get-client-manifest', getLocalManifest())
      })
  } else {
    event.reply('core/library/get-client-manifest', {})
  }
}
