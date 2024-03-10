import React, { createContext, useContext, ReactNode } from 'react'
import usePreload from '../hooks/usePreload'
import { Client } from '../../types/client'

interface DownloadCenterContextType {
  addDownload: ({ metadataUrl, slug }: Client) => void
}

const DownloadCenterContext = createContext<
  DownloadCenterContextType | undefined
>(undefined)

export const useDownloadCenter = () => {
  const context = useContext(DownloadCenterContext)
  if (!context) {
    throw new Error(
      'useDownloadCenter must be used within a DownloadCenterProvider',
    )
  }
  return context
}

interface DownloadCenterProviderProps {
  children: ReactNode
}

export const DownloadCenterProvider: React.FC<DownloadCenterProviderProps> = ({
  children,
}) => {
  const { bridge } = usePreload()

  const addDownload = (client: Client) => {
    bridge.sendMessage('core/download/start', client)
  }

  return (
    <DownloadCenterContext.Provider
      value={{
        addDownload,
      }}
    >
      {children}
    </DownloadCenterContext.Provider>
  )
}
