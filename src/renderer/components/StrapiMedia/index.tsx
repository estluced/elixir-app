import { useEffect, useState } from 'react'
import { SxProps } from '@mui/material'
import { StyledImage } from './styles'
import usePreload from '../../hooks/usePreload'
import { StrapiAttributes, StrapiMedia } from '../../../types/strapi'
import getConfig from '../../../utils/getConfig'

interface StrapiMediaComponentProps extends StrapiAttributes<StrapiMedia> {
  sx?: SxProps
  alt?: string
}

const StrapiMediaComponent = ({
  alt,
  sx,
  attributes,
}: StrapiMediaComponentProps) => {
  const config = getConfig()
  const [source, setSource] = useState('')
  const { bridge, cachePath } = usePreload()
  const imageFromCache = `${cachePath}/${attributes.hash}${attributes.ext}`
  const imageFromUrl = `${config.API_URL_V2}${attributes.url}`

  useEffect(() => {
    console.log(imageFromCache, imageFromUrl)
    const imgFromCache = new Image()
    imgFromCache.src = imageFromCache
    imgFromCache.onload = () => {
      setSource(imageFromCache)
    }
    imgFromCache.onerror = () => {
      bridge.sendMessage('helpers/cache-image', attributes)
      setSource(imageFromUrl)
    }
  }, [attributes])

  return <StyledImage src={source} alt={alt} sx={sx} />
}

export default StrapiMediaComponent
