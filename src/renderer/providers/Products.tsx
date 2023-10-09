import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'
import { useLocation } from 'react-router-dom'
import {
  ClientManifest,
  Manifest,
  ManifestArrayElement,
} from '../../types/manifest'
import getClientsManifest from '../api/getClientsManifest'
import getClientManifest from '../api/getClientManifest'

interface ProductsContextType {
  clients: Manifest
  modifyClients: Manifest
  activeClient: ClientManifest | null
  updateSelectedClient: (value: ManifestArrayElement) => void
  selectedClient?: ManifestArrayElement
  selectedClientInstalled: boolean
}

const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined,
)

export const useProducts = () => {
  const context = useContext(ProductsContext)
  if (!context) {
    throw new Error('useProducts must be used within a DownloadCenterProvider')
  }
  return context
}

interface ProductsProviderProps {
  children: ReactNode
}

export const ProductsProvider: React.FC<ProductsProviderProps> = ({
  children,
}) => {
  const { ipcRenderer } = window.electron
  const [clients, setClients] = useState<Manifest>([])
  const [modifyClients, setModifyClients] = useState<Manifest>([])
  const [activeClient, setActiveClient] = useState<ClientManifest | null>(null)
  const [selectedClient, setSelectedClient] = useState<
    ManifestArrayElement | undefined
  >(undefined)
  const [selectedClientInstalled, setSelectedClientInstalled] = useState(false)
  const { search } = useLocation()

  const updateSelectedClient = (client: ManifestArrayElement) => {
    setSelectedClient(client)
  }

  const getActiveClient = (manifestUrl?: string) => {
    if (manifestUrl) {
      getClientManifest({ manifestUrl }).then(setActiveClient)
    } else {
      setActiveClient(null)
    }
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(search)
    const manifestUrl = searchParams?.get('manifestUrl') || ''
    getActiveClient(manifestUrl)
  }, [search])

  useEffect(() => {
    console.log('[DEBUG] Selected client', selectedClient)
    if (selectedClient?.manifestPath)
      ipcRenderer.sendMessage(
        'core/library/check-client-exists',
        selectedClient?.manifestPath,
      )
    ipcRenderer.on('core/library/check-client-exists', console.log)
  }, [selectedClient])

  useEffect(() => {
    getClientsManifest()
      .then((manifest) => {
        const clients = manifest.filter((item) => item.type === 'client')
        setSelectedClient(clients[0])
        const modifyClients = manifest.filter(
          (item) => item.type === 'modify-client',
        )
        setClients(clients)
        console.log(selectedClient)
        setModifyClients(modifyClients)
      })
      .catch(console.log)
  }, [ipcRenderer])

  return (
    <ProductsContext.Provider
      value={{
        clients,
        modifyClients,
        activeClient,
        selectedClient,
        updateSelectedClient,
        selectedClientInstalled,
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}
