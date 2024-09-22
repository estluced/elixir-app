import fs from 'fs'
import path from 'path'
import { LibraryClient } from '../../../types/client'

class ClientInfo {
	private clientPath: string

	private clientMetadataPath: string

	private clientInfoPath: string

	constructor(clientPath: string) {
		this.clientPath = clientPath
		this.clientMetadataPath = path.join(clientPath, 'artifacts.json')
		this.clientInfoPath = path.join(clientPath, 'info.json')
	}

	public checkClientExists(): boolean {
		return fs.existsSync(this.clientInfoPath)
	}

	public get(): LibraryClient {
		const { clientInfoPath } = this

		if (!fs.existsSync(clientInfoPath)) {
			throw new Error('Client info not found')
		}

		return JSON.parse(fs.readFileSync(clientInfoPath, 'utf-8'))
	}

	private getVersions(): string[] {
		const { clientPath } = this
		const clientVersionsPath = path.join(clientPath, 'versions')

		if (!fs.existsSync(clientVersionsPath)) {
			throw new Error('Client versions not found')
		}

		const versions = fs.readdirSync(clientVersionsPath)

		if (versions.length === 0) {
			throw new Error('Client versions not found')
		}

		return versions.filter((version) =>
			fs.lstatSync(path.join(clientVersionsPath, version)).isDirectory(),
		)
	}

	public generate(): LibraryClient {
		const { clientPath } = this

		const clientInfoPath = path.join(clientPath, 'info.json')
		const clientBasename = path.basename(clientPath)
		const clientName = clientBasename
			.replace(/-/g, ' ')
			.replace(/\b\w/g, (l) => l.toUpperCase())

		if (fs.existsSync(clientInfoPath)) {
			throw new Error('Client info already exists')
		}

		if (fs.existsSync(clientInfoPath)) {
			return this.get()
		}

		if (!fs.existsSync(clientInfoPath)) {
			const clientInfo: LibraryClient = {
				title: clientName,
				client: clientBasename,
				versions: this.getVersions(),
				logo: null,
			}

			fs.writeFileSync(clientInfoPath, JSON.stringify(clientInfo))

			return clientInfo
		}

		throw new Error('Client not found')
	}
}

export default ClientInfo
