import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { StrapiAttributes, StrapiFile } from '../../../types/strapi'
import { DownloadCardProgressWithUuid } from '../../components/DownloadCard'

interface DownloadsState {
  currentDownload: DownloadCardProgressWithUuid | null
}

const initialState: DownloadsState = {
  currentDownload: null,
}

export const downloadsSlice = createSlice({
  name: 'downloads',
  initialState,
  reducers: {
    addDownload: (
      store,
      action: PayloadAction<DownloadCardProgressWithUuid>,
    ) => {
      if (!store.currentDownload) {
        store.currentDownload = action.payload
      }
    },
    removeDownload: (
      store,
      action: PayloadAction<DownloadCardProgressWithUuid>,
    ) => {
      if (store.currentDownload?.uuid === action.payload.uuid) {
        store.currentDownload = null
      }
    },
  },
})

export const { addDownload, removeDownload } = downloadsSlice.actions

export default downloadsSlice.reducer
