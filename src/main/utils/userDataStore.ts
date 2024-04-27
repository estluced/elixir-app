import { join } from 'path'
import { app } from 'electron'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'

export interface IUserDataStore {
  userDataPath: string
  get: (key: string) => any
  set: (key: string, value: any) => void
  clear: () => void
  delete: (key: string) => void
}

class UserDataStore implements IUserDataStore {
  public userDataPath: string

  constructor() {
    this.userDataPath = join(app.getPath('userData'), 'user-data.json')
  }

  private readStoreData() {
    try {
      return JSON.parse(readFileSync(this.userDataPath, 'utf-8'))
    } catch (e) {
      return {}
    }
  }

  private writeStoreData(data: { [key: string]: any }) {
    try {
      if (!existsSync(this.userDataPath)) {
        mkdirSync(app.getPath('userData'), { recursive: true })
      }
      writeFileSync(this.userDataPath, JSON.stringify(data))
    } catch (e) {
      throw new Error(e)
    }
  }

  public get(key: string) {
    const storeData = this.readStoreData()
    return storeData[key]
  }

  public set(key: string, value: any) {
    const storeData = this.readStoreData()
    storeData[key] = value
    this.writeStoreData(storeData)
  }

  public clear() {
    this.writeStoreData({})
  }

  public delete(key: string) {
    const storeData = this.readStoreData()
    delete storeData[key]
    this.writeStoreData(storeData)
  }
}

export default UserDataStore
