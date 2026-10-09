// Build plug-and-play Linux + Windows: pasta que roda sem Node/npm/internet no destino.
// Uso (uma vez nesta máquina): npm run build:portatil
// Saída: release/OrientaIF/ -> copiar para pendrive.
//   Linux: duplo clique em INICIAR.sh | Windows: duplo clique em INICIAR.bat
// Contém: runtimes Node oficiais (node + node.exe), servidor empacotado, front dist/, banco local.
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const NODE_VERSION = '22.22.0'
const releaseDir = path.join(root, 'release', 'OrientaIF')
fs.mkdirSync(releaseDir, { recursive: true })

console.log('1/4 Compilando front...')
execSync('npm run build', { stdio: 'inherit', cwd: root })

console.log('2/4 Empacotando backend (express+cors) em 1 arquivo...')
const bundlePath = path.join(releaseDir, 'servidor.cjs')
execSync(
  `npx --yes esbuild server/server.js --bundle --platform=node --format=cjs --outfile=${bundlePath} --external:node:sqlite --log-level=warning`,
  { stdio: 'inherit', cwd: root },
)

console.log('3/4 Baixando runtimes Node oficiais (uma vez, ficam no pendrive)...')

// --- Linux ---
const tarName = `node-v${NODE_VERSION}-linux-x64.tar.xz`
const tarPath = path.join(root, 'release', tarName)
if (!fs.existsSync(path.join(releaseDir, 'node'))) {
  if (!fs.existsSync(tarPath)) {
    execSync(`curl -L -o ${tarPath} https://nodejs.org/dist/v${NODE_VERSION}/${tarName}`, {
      stdio: 'inherit',
      cwd: root,
    })
  }
  execSync(`tar -xf ${tarPath} -C /tmp && cp /tmp/node-v${NODE_VERSION}-linux-x64/bin/node ${releaseDir}/node`, {
    stdio: 'inherit',
  })
  fs.chmodSync(path.join(releaseDir, 'node'), 0o755)
} else {
  console.log('Runtime Linux já existe, pulando.');
}

// --- Windows ---
const zipName = `node-v${NODE_VERSION}-win-x64.zip`
const zipPath = path.join(root, 'release', zipName)
if (!fs.existsSync(path.join(releaseDir, 'node.exe'))) {
  if (!fs.existsSync(zipPath)) {
    execSync(`curl -L -o ${zipPath} https://nodejs.org/dist/v${NODE_VERSION}/${zipName}`, {
      stdio: 'inherit',
      cwd: root,
    })
  }
  execSync(`unzip -o -j ${zipPath} node-v${NODE_VERSION}-win-x64/node.exe -d ${releaseDir}`, {
    stdio: 'inherit',
  })
} else {
  console.log('Runtime Windows já existe, pulando.');
}

console.log('4/4 Copiando front + lançadores...')
const distSrc = path.join(root, 'dist')
const distDst = path.join(releaseDir, 'dist')
fs.rmSync(distDst, { recursive: true, force: true })
fs.cpSync(distSrc, distDst, { recursive: true })

// Versão HTML puro (abre com duplo clique, sem servidor)
const vanillaSrc = path.join(root, 'vanilla')
if (fs.existsSync(path.join(vanillaSrc, 'index.html'))) {
  const vanillaDst = path.join(releaseDir, 'vanilla');
  fs.rmSync(vanillaDst, { recursive: true, force: true });
  fs.cpSync(vanillaSrc, vanillaDst, { recursive: true });
}

fs.writeFileSync(
  path.join(releaseDir, 'INICIAR.sh'),
  `#!/bin/sh\ncd "$(dirname "$0")"\n./node servidor.cjs\n`,
  { mode: 0o755 },
)
fs.writeFileSync(
  path.join(releaseDir, 'INICIAR.bat'),
  `@echo off\r\ncd /d "%~dp0"\r\nnode.exe servidor.cjs\r\npause\r\n`,
)
fs.writeFileSync(
  path.join(releaseDir, 'COMO-USAR.txt'),
  `ORIENTA IF - plug and play (Linux + Windows)\n\n1. Copie esta pasta para o computador/pendrive.\n2. Linux: duplo clique em INICIAR.sh (ou ./node servidor.cjs).\n   Windows: duplo clique em INICIAR.bat.\n3. Abra o navegador em http://localhost:3001\n\nNao precisa instalar Node, npm nem internet.\nO banco orienta.db e criado sozinho nesta pasta.\n`,
)

const size = execSync(`du -sh ${releaseDir} | cut -f1`).toString().trim()
console.log(`\nPronto em ${releaseDir} (${size}). Leve a pasta inteira no pendrive.`)
