import UserDataStore from './userDataStore'

export class LauncherStore {
  private static instance: UserDataStore

  public static getInstance(): UserDataStore {
    if (!LauncherStore.instance) {
      LauncherStore.instance = new UserDataStore()
    }

    return LauncherStore.instance
  }
}

export default LauncherStore
