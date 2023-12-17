import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DownloadItem } from '../../../types/downloads'
import { DownloadListItem } from '../../providers/DownloadCenter'

interface DownloadsState {
  downloadsList: DownloadListItem[]
}

const initialState: DownloadsState = {
  downloadsList: [],
}

export const downloadsSlice = createSlice({
  name: 'downloads',
  initialState,
  reducers: {
    download: (store, action: PayloadAction<DownloadItem>) => {},
    removeDownload: (store, action: PayloadAction<number>) => {
      store.downloadsList = store.downloadsList.filter(
        (x) => x.id !== action.payload,
      )
    },
  },
})

export const { download, removeDownload } = downloadsSlice.actions

export default downloadsSlice.reducer
