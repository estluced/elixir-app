import { Grid, Modal, Paper, Typography } from '@mui/material'
import { useState } from 'react'
import { LaunchOpts, LibraryClient } from '../../../types/client'
import ClientLogo from '../../assets/client-logo.png'
import usePreload from '../../hooks/usePreload'

const ClientCard = ({ title, versions, client, logo }: LibraryClient) => {
	const { bridge } = usePreload()
	const [clientModalOpen, setClientModalOpen] = useState(false)

	const handleToggleClientModal = () => {
		setClientModalOpen(!clientModalOpen)
	}

	const launchClient = (version: string) => {
		bridge.sendMessage('core/launch/client', {
			client,
			version,
		} as LaunchOpts)
	}

	return (
		<>
			<Grid
				component={Paper}
				width="auto"
				container
				onClick={handleToggleClientModal}
				wrap="nowrap"
				alignItems="center"
				gap="12px"
				sx={{
					padding: '8px',
					paddingRight: '16px',
					transition: 'transform 0.2s',
					'&:hover': {
						transform: 'scale(1.05)',
					},
					'&:active': {
						transform: 'scale(0.95)',
					},
				}}
			>
				<img width={42} height={42} src={logo || ClientLogo} alt={title} />
				<Typography fontWeight={700}>{title}</Typography>
			</Grid>
			<Modal
				open={clientModalOpen}
				onClose={handleToggleClientModal}
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Paper
					component={Grid}
					container
					direction="column"
					gap="8px"
					sx={{
						width: 'auto',
						minWidth: '260px',
						padding: '20px',
					}}
				>
					<Typography fontWeight={600}>Select version</Typography>
					{versions.map((version) => (
						<Paper
							key={version}
							onClick={() => {
								launchClient(version)
								handleToggleClientModal()
							}}
							sx={{
								padding: '8px',
								transition: 'transform 0.2s',
								'&:hover': {
									transform: 'scale(1.05)',
								},
								'&:active': {
									transform: 'scale(0.95)',
								},
							}}
						>
							<Typography fontWeight={600}>{version}</Typography>
						</Paper>
					))}
				</Paper>
			</Modal>
		</>
	)
}

export default ClientCard
