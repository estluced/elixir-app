import React, { createContext, useContext, useState, ReactNode } from 'react'

interface DownloadItem {
  id: number | string
  filename: string
  url: string
  manifestPath: string
}

export interface DownloadListItem {
  id: number | string
  filename: string
  manifestPath: string
}

interface DownloadCenterContextType {
  state: DownloadItem[]
  modalIsOpen: boolean
  downloadsList: DownloadListItem[]
  handleCloseDownloadCenter: () => void
  handleOpenDownloadCenter: () => void
  pushDownload: (download: DownloadItem) => void
  removeDownload: (id: number | string) => void
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
  const { ipcRenderer } = window.electron
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
  const [state, setState] = useState<DownloadItem[]>([])
  const [downloadsList, setDownloadsList] = useState<DownloadListItem[]>([])

  const pushDownload = (download: DownloadItem) => {
    ipcRenderer
      .sendMessage('core/download', download)
      .on((downloadItem: DownloadListItem) => {
        console.log(downloadItem)
        setDownloadsList([...downloadsList, downloadItem])
      })
  }

  const removeDownload = (id: number | string) => {
    const newDownloadsList = downloadsList.filter(
      (download) => download.id !== id,
    )
    setDownloadsList(newDownloadsList)
  }

  const handleCloseDownloadCenter = () => setModalIsOpen(false)

  const handleOpenDownloadCenter = () => setModalIsOpen(true)

  return (
    <DownloadCenterContext.Provider
      value={{
        state,
        modalIsOpen,
        downloadsList,
        handleCloseDownloadCenter,
        handleOpenDownloadCenter,
        pushDownload,
        removeDownload,
      }}
    >
      {children}
    </DownloadCenterContext.Provider>
  )
}
