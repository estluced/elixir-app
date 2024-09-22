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

const getImageSource = (attributes: StrapiMedia) => {
	const { formats } = attributes
	return formats.medium || formats.large
}

const StrapiMediaComponent = ({
	alt,
	sx,
	attributes,
}: StrapiMediaComponentProps) => {
	const config = getConfig()
	const [source, setSource] = useState('')
	const { bridge, cachePath } = usePreload()
	const imageSource = getImageSource(attributes)
	const imageFromCache = `${cachePath}/${imageSource.hash}${imageSource.ext}`
	const imageFromUrl = `${config.API_URL_V2}${imageSource.url}`

	useEffect(() => {
		const imgFromCache = new Image()
		imgFromCache.src = imageFromCache
		imgFromCache.onload = () => {
			setSource(imageFromCache)
		}
		imgFromCache.onerror = () => {
			bridge.sendMessage('helpers/cache-image', imageSource)
			setSource(imageFromUrl)
		}
	}, [imageSource])

	return <StyledImage src={source} alt={alt} sx={sx} />
}

export default StrapiMediaComponent
