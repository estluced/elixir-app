import Store from 'electron-store'

export class LauncherStore {
  private static instance: Store

  public static getInstance(): Store {
    if (!LauncherStore.instance) {
      LauncherStore.instance = new Store()
    }

    return LauncherStore.instance
  }
}

export default LauncherStore
