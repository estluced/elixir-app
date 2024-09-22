import { connect } from 'react-redux'
import {
	ClientBackgroundContainer,
	ClientOverviewContainer,
	MainContainer,
} from './styles'
import { RootState } from '../../store'
import ClientsNavigation from '../../components/ClientsNavigation'
import ClientOverview from '../../components/ClientOverview'
import StrapiMedia from '../../components/StrapiMedia'
import { setActiveClient } from '../../store/clients/clientsSlice'
import { Client } from '../../../types/client'

interface MainPageProps {
	activeClient: Client
	setActiveClient: (clientId: number) => void
}

const MainPage = ({ activeClient, setActiveClient }: MainPageProps) => {
	const activeClientBackground = activeClient?.background.data

	const handleSetActiveClient = (clientId: number) => setActiveClient(clientId)

	return (
		<>
			{activeClientBackground && (
				<ClientBackgroundContainer enableGrayFilter={!activeClient.available}>
					<StrapiMedia {...activeClientBackground} />
				</ClientBackgroundContainer>
			)}
			<MainContainer>
				<ClientOverviewContainer>
					{activeClient && <ClientOverview />}
					<ClientsNavigation handleSetActiveClient={handleSetActiveClient} />
				</ClientOverviewContainer>
			</MainContainer>
		</>
	)
}

export default connect(
	(state: RootState) => ({
		activeClient: state.clients.activeClient?.attributes,
	}),
	(dispatch) => ({
		setActiveClient: (clientId: number) => dispatch(setActiveClient(clientId)),
	}),
)(MainPage)
