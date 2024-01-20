import { Downloader } from './src/main/utils/downloader'

const downloader = new Downloader({
  installPath: 'D:\\test-servers',
  downloadId: 1,
})

downloader.addDownloads([
  {
    name: 'test.zip',
    hash: 'test_52eafe7b4d',
    ext: '.zip',
    mime: 'application/x-zip-compressed',
    size: 827991.69,
    url: '/uploads/test_52eafe7b4d.zip',
    createdAt: '2023-12-16T23:41:58.687Z',
    updatedAt: '2023-12-16T23:41:58.687Z',
  },
  {
    name: 'test.zip',
    hash: 'test_52eafe7b4d',
    ext: '.zip',
    mime: 'application/x-zip-compressed',
    size: 827991.69,
    url: '/uploads/test_52eafe7b4d.zip',
    createdAt: '2023-12-16T23:41:58.687Z',
    updatedAt: '2023-12-16T23:41:58.687Z',
  },
  {
    name: 'test.zip',
    hash: 'test_52eafe7b4d',
    ext: '.zip',
    mime: 'application/x-zip-compressed',
    size: 827991.69,
    url: '/uploads/test_52eafe7b4d.zip',
    createdAt: '2023-12-16T23:41:58.687Z',
    updatedAt: '2023-12-16T23:41:58.687Z',
  },
])

downloader.startDownload()

// downloader.on('download-event:progress', (progress) => console.log(progress))
// downloader.on('download-event:total-progress', (progress) =>
//   console.log(progress),
// )
// downloader.on('download-event:end', (file) => console.log(file))
// downloader.on('download-event:error', (err) => console.log(err))

downloader.on(`1:start`, () => {})

downloader.on(`1:complete`, () => {})

// downloader.on(`1:file:progress`, (progressData) => {
//   console.log(progressData)
// })

downloader.on(`1:total:progress`, (progress) => {
  console.log(progress)
})

downloader.on(`1:decompress:started`, () => {
  console.log('распакоука нахуй')
})
