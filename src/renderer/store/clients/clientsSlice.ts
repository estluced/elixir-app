import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Client } from '../../../types/client'
import { StrapiAttributes } from '../../../types/strapi'

interface ClientsState {
  clients: StrapiAttributes<Client>[]
}

const initialState: ClientsState = {
  clients: [],
}

export const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    setClients: (store, action: PayloadAction<StrapiAttributes<Client>[]>) => {
      store.clients = [...store.clients, ...action.payload]
    },
  },
})

export const { setClients } = clientsSlice.actions

export default clientsSlice.reducer
