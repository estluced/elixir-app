import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Client, ClientStatus, ClientStatusEnum } from '../../../types/client'
import { StrapiAttributes } from '../../../types/strapi'

interface ClientsState {
  clients: StrapiAttributes<Client>[]
  activeClient: StrapiAttributes<Client> | null
}

const initialState: ClientsState = {
  clients: [],
  activeClient: null,
}

export const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    setClients: (store, action: PayloadAction<StrapiAttributes<Client>[]>) => {
      store.clients = action.payload
    },
    setActiveClient: (store, action: PayloadAction<number>) => {
      store.activeClient =
        store.clients.find((client) => client.id === action.payload) || null
    },
    setClientStatus: (
      store,
      action: PayloadAction<{
        status: ClientStatus
        id: number
      }>,
    ) => {
      if (store.activeClient?.attributes) {
        store.activeClient.attributes.status = action.payload.status
      }
      if (store.clients.length) {
        store.clients = store.clients.map((client) => {
          if (client.id === action.payload.id) {
            client.attributes.status = action.payload.status
          }
          return client
        })
      }
    },
  },
})

export const { setClients, setActiveClient, setClientStatus } =
  clientsSlice.actions

export default clientsSlice.reducer
