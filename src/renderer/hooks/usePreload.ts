import { Account } from '../../types/account'

const usePreload = () => {
  const { store: localStore, ipcRenderer: bridge } = window.electron
  const installPath = localStore.get('installation-path')
  const accountJwt = localStore.get('_jwt')
  const account: Account = JSON.parse(localStore.get('account') || undefined)

  if (!account) {
    localStore.set('_jwt', undefined)
    window.location.reload()
  }

  return {
    localStore,
    installPath,
    bridge,
    accountJwt,
    account,
  }
}

export default usePreload
