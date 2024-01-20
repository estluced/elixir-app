import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { StrapiAttributes, StrapiFile } from '../../../types/strapi'

interface DownloadsState {
  downloadsList: StrapiAttributes<StrapiFile>[]
}

const initialState: DownloadsState = {
  downloadsList: [],
}

export const downloadsSlice = createSlice({
  name: 'downloads',
  initialState,
  reducers: {
    addDownload: (
      store,
      action: PayloadAction<StrapiAttributes<StrapiFile>>,
    ) => {
      store.downloadsList.push(action.payload)
    },
    removeDownload: (store, action: PayloadAction<number>) => {
      store.downloadsList = store.downloadsList.filter(
        (x) => x.id !== action.payload,
      )
    },
  },
})

export const { addDownload, removeDownload } = downloadsSlice.actions

export default downloadsSlice.reducer
