let downloadPlatform

switch (process.platform) {
  case 'darwin':
    downloadPlatform = 'darwin'
    break
  case 'win32':
    downloadPlatform = 'win32-archive'
    break
  default:
    downloadPlatform = 'linux-x64'
}

const url = `https://update.code.visualstudio.com/latest/${downloadPlatform}/stable`

import * as https from 'https'
import * as fs from 'fs'
import * as path from 'path'
import * as cp from 'child_process'

const extensionRoot = process.cwd()
const vscodeTestDir = path.resolve(extensionRoot, '.vscode-test')
const vscodeExecutableDir = path.resolve(extensionRoot, '.vscode-test/stable')

function downloadVSCode(): Promise<string> {
  fs.mkdirSync(vscodeTestDir, { recursive: true })

  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode !== 302) {
        reject('Failed to get VS Code archive location')
      }
      const archiveUrl = res.headers.location
      if (!archiveUrl) {
        reject('Failed to get VS Code archive location')
        return
      }

      if (archiveUrl.endsWith('.zip')) {
        const archivePath = path.resolve(vscodeTestDir, 'vscode.zip')
        const outStream = fs.createWriteStream(archivePath)
        outStream.on('close', () => {
          resolve(archivePath)
        })
        https.get(archiveUrl, res => {
          res.pipe(outStream)
        })
      } else {
        const zipPath = path.resolve(vscodeTestDir, 'vscode.tgz')
        const outStream = fs.createWriteStream(zipPath)
        https.get(archiveUrl, res => {
          res.pipe(outStream)
        })
        outStream.on('close', () => {
          resolve(zipPath)
        })
      }
    })
  })
}

function unzipVSCode(vscodeArchivePath: string) {
  if (vscodeArchivePath.endsWith('.zip')) {
    if (process.platform === 'win32') {
      cp.spawnSync('powershell.exe', [
        '-Command',
        `Expand-Archive -Path ${vscodeArchivePath} -DestinationPath ${vscodeExecutableDir}`
      ])
    } else {
      cp.spawnSync('unzip', [vscodeArchivePath, '-d', `${vscodeExecutableDir}`])
    }
  } else {
    cp.spawnSync('tar', ['-xzf', vscodeArchivePath, '-C', vscodeExecutableDir])
  }
}

export async function downloadAndUnzipVSCode(): Promise<string> {
  if (!fs.existsSync(vscodeTestDir)) {
    const vscodeArchivePath = await downloadVSCode()
    unzipVSCode(vscodeArchivePath)
    fs.unlinkSync(vscodeArchivePath)
  }

  if (process.platform === 'win32') {
    return path.resolve(vscodeExecutableDir, 'Code.exe')
  } else if (process.platform === 'darwin') {
    return path.resolve(vscodeExecutableDir, 'Visual Studio Code.app/Contents/MacOS/Electron')
  } else {
    return path.resolve(vscodeExecutableDir, 'VSCode-linux-x64/code')
  }
}
