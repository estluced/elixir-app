import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../index'
import usePreload from '../../hooks/usePreload'

const DownloadsHOC = () => {
  const downloads = useSelector(
    (state: RootState) => state.downloads.downloadsList,
  )
  const { bridge } = usePreload()

  useEffect(() => {
    downloads.forEach((download) => {
      bridge.sendMessage('core/download', download)
    })
  }, [downloads.length])

  return <div />
}

export default DownloadsHOC
