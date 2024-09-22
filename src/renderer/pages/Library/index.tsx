import { Button, Container, Grid } from '@mui/material'
import { useEffect, useState } from 'react'
import usePreload from '../../hooks/usePreload'
import { LibraryClient } from '../../../types/client'
import ClientCard from '../../components/ClientCard'

const Library = () => {
	const { bridge } = usePreload()

	const [clients, setClients] = useState<LibraryClient[]>([])

	useEffect(() => {
		bridge.sendMessage('core/library/scan').on(setClients)
	}, [])

	return (
		<Grid
			container
			direction="column"
			height="100vh"
			sx={{
				padding: '55px 40px 70px 70px',
			}}
		>
			<h1>Library</h1>
			<Grid container gap="8px">
				{clients.map((client) => (
					<ClientCard key={client.client} {...client} />
				))}
			</Grid>
		</Grid>
	)
}

export default Library
