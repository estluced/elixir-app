import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'
import LauncherStore from './store'

const initPaths = (installPath: string | null = null) => {
  const store = LauncherStore.getInstance()
  const installationPath = installPath || String(store.get('installation-path'))

  const userDataPath = join(installationPath, 'user-data')

  const skinsDir = join(userDataPath, 'skins')

  const capesDir = join(userDataPath, 'capes')

  const logsDir = join(installationPath, 'logs')

  const cacheDir = join(installationPath, '.cache')

  const paths = [
    installationPath,
    userDataPath,
    skinsDir,
    capesDir,
    logsDir,
    cacheDir,
  ]

  paths.forEach((path) => {
    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true })
    }
  })
}

export default initPaths
