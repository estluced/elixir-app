import { configureStore } from '@reduxjs/toolkit'
import downloadsReducer from './downloads/downloadsSlice'
import clientsSlice from './clients/clientsSlice'

export const store = configureStore({
  reducer: {
    downloads: downloadsReducer,
    clients: clientsSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
