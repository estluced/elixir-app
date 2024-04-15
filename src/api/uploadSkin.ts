import getConfig from '../utils/getConfig'

interface UploadSkinPayload {
  skin: File | undefined
  cape: File | undefined
}

export const uploadSkinData = async (
  username: string,
  payload: UploadSkinPayload,
) => {
  const formData = new FormData()
  const promiseArray = []
  const config = getConfig()

  console.log(payload)

  if (payload.skin) {
    formData.append('skin', payload.skin)
    promiseArray.push(
      fetch(`${config.API_URL_V2}/skins/${username}/upload-skin`, {
        method: 'POST',
        body: formData,
      }),
    )
  }

  if (payload.cape) {
    formData.append('cape', payload.cape)
    promiseArray.push(
      fetch(`${config.API_URL_V2}/skins/${username}/upload-cape`, {
        method: 'POST',
        body: formData,
      }),
    )
  }

  return Promise.all(promiseArray)
}

export const clearSkinData = async (username: string) => {
  const config = getConfig()
  return fetch(`${config.API_URL_V2}/skins/${username}/clear`, {
    method: 'POST',
  })
}
