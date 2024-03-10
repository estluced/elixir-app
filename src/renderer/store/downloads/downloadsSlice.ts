import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { StrapiAttributes, StrapiFile } from '../../../types/strapi'

interface DownloadsState {
  downloadsList: string[]
}

const initialState: DownloadsState = {
  downloadsList: [],
}

export const downloadsSlice = createSlice({
  name: 'downloads',
  initialState,
  reducers: {
    addDownload: (store, action: PayloadAction<string>) => {
      store.downloadsList.push(action.payload)
    },
    removeDownload: (store, action: PayloadAction<string>) => {
      store.downloadsList = store.downloadsList.filter(
        (x) => x !== action.payload,
      )
    },
  },
})

export const { addDownload, removeDownload } = downloadsSlice.actions

export default downloadsSlice.reducer
