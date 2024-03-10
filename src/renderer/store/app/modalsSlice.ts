import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Client } from '../../../types/client'
import { StrapiAttributes } from '../../../types/strapi'

interface ModalsState {
  settings: boolean
}

const initialState: ModalsState = {
  settings: false,
}

export const clientsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    toggleSettingsModal: (store) => {
      store.settings = !store.settings
    },
  },
})

export const { toggleSettingsModal } = clientsSlice.actions

export default clientsSlice.reducer
