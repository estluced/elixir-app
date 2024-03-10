import { configureStore } from '@reduxjs/toolkit'
import downloadsReducer from './downloads/downloadsSlice'
import clientsSlice from './clients/clientsSlice'
import modalsSlice from './app/modalsSlice'

export const store = configureStore({
  reducer: {
    modals: modalsSlice,
    downloads: downloadsReducer,
    clients: clientsSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
