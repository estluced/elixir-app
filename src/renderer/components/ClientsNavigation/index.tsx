import { useSelector } from 'react-redux'
import { Box } from '@mui/material'
import { RootState } from '../../store'
import { ClientsNavigationContainer } from './styles'
import ClientListCard from '../ClientListCard'

interface ClientNavigationProps {
	handleSetActiveClient: (clientId: number) => void
}

const ClientsNavigation = ({
	handleSetActiveClient,
}: ClientNavigationProps) => {
	const clients = useSelector((state: RootState) => state.clients.clients)
	return (
		<ClientsNavigationContainer>
			{clients.map((client) => (
				<Box
					key={`client-${client.id}`}
					onClick={() => handleSetActiveClient(client.id)}
				>
					<ClientListCard {...client.attributes} />
				</Box>
			))}
		</ClientsNavigationContainer>
	)
}

export default ClientsNavigation
