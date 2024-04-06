import { Account } from '../../types/account'

const usePreload = () => {
  const { store: localStore, ipcRenderer: bridge } = window.electron
  const installPath = localStore.get('installation-path')
  const lang = localStore.get('language')
  const accountJwt = localStore.get('_jwt')
  const account: Account = JSON.parse(localStore.get('account') || '{}')
  const cachePath = `${installPath}/.cache`

  const setupIsComplete = installPath?.length && lang?.length

  return {
    localStore,
    installPath,
    bridge,
    accountJwt,
    account,
    cachePath,
    lang,
    setupIsComplete,
  }
}

export default usePreload
