import { useEffect } from 'react'
import { useProducts } from '../../providers/Products'
import ClientView from './Client'
import ModifyClientView from './ModifyClient'

function ProductScreen() {
  const { activeClient } = useProducts()

  useEffect(() => {
    console.log('[DEBUG] Active client 234', activeClient)
  }, [activeClient])

  return (
    <>
      {activeClient?.type === 'modify-client' && <ModifyClientView />}
      {!activeClient && <ClientView />}
    </>
  )
}

export default ProductScreen
