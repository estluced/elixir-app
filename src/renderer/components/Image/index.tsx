import { useEffect, useState } from 'react'
import { SxProps } from '@mui/material'
import { StyledImage } from './styles'
import getConfig from '../../../utils/getConfig'
import usePreload from '../../hooks/usePreload'

const FallbackImage = ''

const { API_URL_V2 } = getConfig()

interface ImageProps {
  src: string
  sx?: SxProps
  fallback?: string
  alt?: string
  disableApi?: boolean
}

const ImageComponent = ({ src, sx, alt, disableApi }: ImageProps) => {
  const [source, setSource] = useState('')
  const { bridge } = usePreload()

  useEffect(() => {
    if (src && !disableApi) {
      const source = `${API_URL_V2}${src}`
      bridge.sendMessage('helpers/cache-image', source).on(setSource)
    } else {
      setSource(`${disableApi ? '' : API_URL_V2}${src}`)
    }
  }, [src])

  return <StyledImage src={source} alt={alt} sx={sx} />
}

export default ImageComponent
