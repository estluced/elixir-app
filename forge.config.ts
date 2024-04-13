import type { ForgeConfig } from '@electron-forge/shared-types'
import { MakerSquirrel } from '@electron-forge/maker-squirrel'
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives'
import { WebpackPlugin } from '@electron-forge/plugin-webpack'
import { join, resolve } from 'path'

import { mainConfig } from './webpack.main.config'
import { rendererConfig } from './webpack.renderer.config'
import getConfig from './src/utils/getConfig'

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    icon: resolve(process.cwd(), join('public', 'icon', 'icon')),
    extraResource: [resolve(process.cwd(), join('public', 'icon', 'icon.ico'))],
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      iconUrl: resolve(process.cwd(), join('public', 'icon', 'icon.ico')),
      setupIcon: resolve(process.cwd(), join('public', 'icon', 'icon.ico')),
    }),
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      devContentSecurityPolicy:
        "default-src * self blob: data: gap: file:; style-src * self 'unsafe-inline' blob: data: gap:; script-src * 'self' 'unsafe-eval' 'unsafe-inline' blob: data: gap: file:; object-src * 'self' blob: data: gap:; img-src * self 'unsafe-inline' blob: data: gap: file:; connect-src self * 'unsafe-inline' blob: data: gap: file:; frame-src * self blob: data: gap: file:;",
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/preloader/index.html',
            js: './src/preloader/index.ts',
            name: 'preloader_window',
          },
          {
            html: './src/console/index.html',
            js: './src/console/index.ts',
            name: 'console_window',
            preload: {
              js: './src/main/preload.ts',
            },
          },
          {
            html: './src/renderer/index.html',
            js: './src/renderer/index.tsx',
            name: 'main_window',
            preload: {
              js: './src/main/preload.ts',
            },
          },
        ],
      },
    }),
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-electron-release-server',
      config: {
        baseUrl: process.env.RELEASE_SERVER_URL,
        username: process.env.RELEASE_SERVER_USER,
        password: process.env.RELEASE_SERVER_PASSWORD,
      },
    },
  ],
}

export default config
