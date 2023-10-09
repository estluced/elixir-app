import React, { useState, useEffect } from 'react'
import { SxProps } from '@mui/material'
import { StyledImage } from './styles'

interface ImageProps {
  remoteUrl?: string
  localUrl?: string
  sx?: SxProps
}

const FallbackImage = ''

const ImageComponent: React.FC<ImageProps> = ({ remoteUrl, localUrl, sx }) => {
  const { store } = window.electron
  const installationPath = store.get('installation-path')
  const localPath = `file://${installationPath}/${localUrl}`

  const [currentImageUrl, setCurrentImageUrl] = useState<string | undefined>(
    localPath,
  )

  useEffect(() => {
    const checkImage = (
      imageSrc: string,
      good: () => void,
      bad: () => void,
    ) => {
      const img = new Image()
      img.onload = good
      img.onerror = bad
      img.src = imageSrc
    }

    checkImage(
      localPath || '',
      () => setCurrentImageUrl(localPath),
      () => {
        checkImage(
          remoteUrl || '',
          () => setCurrentImageUrl(remoteUrl),
          () => setCurrentImageUrl(FallbackImage),
        )
      },
    )
  }, [localPath, remoteUrl])

  return (
    <StyledImage src={currentImageUrl || FallbackImage} alt="img" sx={sx} />
  )
}

export default ImageComponent
