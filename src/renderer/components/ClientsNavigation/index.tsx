import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { ClientsNavigationContainer } from './styles'
import ClientListCard from '../ClientListCard'

const ClientsNavigation = () => {
  const clients = useSelector((state: RootState) => state.clients.clients)
  console.log(clients)
  return (
    <ClientsNavigationContainer>
      {clients.map((client) => (
        <ClientListCard {...client.id} {...client.attributes} />
      ))}
    </ClientsNavigationContainer>
  )
}

export default ClientsNavigation
