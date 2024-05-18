import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'
import LauncherStore from './store'
import { getRAMRange } from './system'

const initAppData = (installPath: string | null = null) => {
  const store = LauncherStore.getInstance()
  const installationPath = installPath || String(store.get('installation-path'))

  // init RAM if not set
  const minRamFromStore = store.get('minRam')
  const maxRamFromStore = store.get('maxRam')
  const ramRange = getRAMRange()
  if (!minRamFromStore || !maxRamFromStore) {
    const thirdRamLength = Math.floor(ramRange.length / 3)

    const firstRamThird = ramRange.slice(0, thirdRamLength)

    const minRam = Math.min(...firstRamThird)
    const maxRam = Math.max(...firstRamThird)
    store.set('minRam', minRam)
    store.set('maxRam', maxRam)
  }

  const logsDir = join(installationPath, 'logs')

  const cacheDir = join(installationPath, '.cache')

  const paths = [installationPath, logsDir, cacheDir]

  paths.forEach((path) => {
    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true })
    }
  })
}

export default initAppData
