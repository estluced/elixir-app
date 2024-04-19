import { IpcMainEvent } from 'electron'
import { launch } from '@xmcl/core'
import { join } from 'path'
import { spawn } from 'child_process'
import { Client, ClientStatusEnum } from '../../types/client'
import LauncherStore from '../utils/store'
import { Account } from '../../types/account'
import createConsoleWindow from '../windows/console'
import { Settings } from '../../types/settings'

const getLogStrokeWithStatus = (stroke: string) => {
  if (stroke.includes('/INFO]')) {
    return {
      stroke,
      status: 'info',
    }
  }
  if (stroke.includes('/WARN]')) {
    return {
      stroke,
      status: 'warning',
    }
  }
  if (stroke.includes('/ERROR]')) {
    return {
      stroke,
      status: 'error',
    }
  }
  return {
    stroke,
    status: 'info',
  }
}

const launchHandler = async (event: IpcMainEvent, client: Client) => {
  try {
    const { minecraftVersion, uuid } = client
    const version =
      minecraftVersion.data.attributes?.forge ||
      minecraftVersion.data.attributes.version
    const store = LauncherStore.getInstance()
    const account = JSON.parse(
      (store.get('account') as string) || '{}',
    ) as Account
    const settings = JSON.parse(
      (store.get('settings') as string) || '{}',
    ) as Settings

    const installationPath = String(store.get('installation-path'))
    const gamePath = join(installationPath, uuid)
    const javaPath = join(installationPath, uuid, 'runtime', 'bin', 'javaw.exe')

    await launch({
      gamePath,
      javaPath,
      version,
      gameProfile: {
        id: account.id,
        name: account.username,
      },
      resolution: {
        fullscreen: settings.fullscreen,
      },
      maxMemory: settings.maxRam || undefined,
      minMemory: settings.minRam || undefined,
      spawn: (command, args) => {
        event.reply(`core/launch/client/${uuid}`, {
          status: ClientStatusEnum.LAUNCHED,
        })

        const clientProcess = spawn(command, args, {
          detached: true,
          cwd: gamePath,
        })

        clientProcess.unref()

        if (settings.shell) {
          createConsoleWindow().then((win) => {
            win.on('ready-to-show', () => {
              if (!clientProcess.killed) {
                clientProcess.stdout?.setEncoding('utf-8')

                win?.webContents.send(
                  'core/console/stdout',
                  getLogStrokeWithStatus(
                    `Launched with command: ${command} ${args.join(' ')}`,
                  ),
                )

                clientProcess.stdout?.on('data', (data) => {
                  win?.webContents.send(
                    'core/console/stdout',
                    getLogStrokeWithStatus(data),
                  )
                })

                clientProcess.stderr?.setEncoding('utf-8')

                clientProcess.stderr?.on('data', (data) => {
                  win?.webContents.send(
                    'core/console/stderr',
                    getLogStrokeWithStatus(data),
                  )
                })

                clientProcess.on('error', (error) => {
                  win?.webContents.send('core/console/stderr', {
                    stroke: error.message,
                    status: 'error',
                  })
                })
              }
            })

            win.on('closed', () => {
              // eslint-disable-next-line no-param-reassign
              win = null
              clientProcess.kill()
            })
          })
        }

        clientProcess.on('close', () => {
          event.reply(`core/launch/client/${uuid}`, {
            status: ClientStatusEnum.INSTALLED,
          })
        })

        clientProcess.on('exit', () => {
          event.reply(`core/launch/client/${uuid}`, {
            status: ClientStatusEnum.INSTALLED,
          })
        })

        clientProcess.on('error', (error) => {
          event.reply(`core/launch/client/${uuid}`, {
            status: ClientStatusEnum.INSTALLED,
          })
          event.reply(`core/error`, {
            error,
          })
        })

        return clientProcess
      },
    })
  } catch (error) {
    console.error(error)
    event.reply(`core/error`, {
      message: error?.message || error,
    })
  }
}

export default launchHandler
