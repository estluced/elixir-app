import { useProducts } from '../../providers/Products'
import ClientView from './Client'
import ModifyClientView from './ModifyClient'

function ProductScreen() {
  const { activeClient } = useProducts()

  return (
    <>
      {activeClient?.type === 'modify-client' && <ModifyClientView />}
      {!activeClient && <ClientView />}
    </>
  )
}

export default ProductScreen
