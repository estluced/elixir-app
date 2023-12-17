import { useEffect } from 'react'
import { MemoryRouter as Router, Route, Routes } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Main from './Main'
import { setClients } from '../store/clients/clientsSlice'
import { StrapiAttributes, StrapiDataMultiple } from '../../types/strapi'
import { Client } from '../../types/client'
import Auth from './Auth'
import usePreload from '../hooks/usePreload'

const Pages = () => {
  const dispatch = useDispatch()
  const { bridge, accountJwt, installPath } = usePreload()

  useEffect(() => {
    bridge
      .sendMessage('core/library/get-clients')
      .on((clients: StrapiDataMultiple<StrapiAttributes<Client>>) => {
        dispatch(setClients(clients.data))
      })
  }, [])

  return (
    <Router>
      <Routes>
        {accountJwt?.length ? (
          <Route path="/" element={<Main />} />
        ) : (
          <Route path="/" element={<Auth />} />
        )}
      </Routes>
    </Router>
  )
}

export default Pages
