import React from 'react'
import { SxProps } from '@mui/material'
import { StyledImage } from './styles'
import getConfig from '../../../utils/getConfig'

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
  return (
    <StyledImage
      src={`${disableApi ? '' : API_URL_V2}${src}`}
      alt={alt}
      sx={sx}
    />
  )
}

export default ImageComponent
