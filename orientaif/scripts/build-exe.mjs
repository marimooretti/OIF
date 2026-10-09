// Gera o executável plug-and-play do Orienta IF (Node SEA).
// Uso (uma vez, nesta máquina): npm run build:exe
// Saída: release/OrientaIF/orienta-if (Linux) — roda sem Node/npm/internet.
// Para Windows: rode este script no Windows ou ajuste --target via pkg.
// O banco orienta.db é criado ao lado do executável no primeiro uso.
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const releaseDir = path.join(root, 'release', 'OrientaIF')
fs.mkdirSync(releaseDir, { recursive: true })

console.log('1/4 Compilando front (vite build)...')
execSync('npm run build', { stdio: 'inherit', cwd: root })

console.log('2/4 Empacotando backend em arquivo único (esbuild)...')
const bundlePath = path.join(root, 'release', 'sea-bundle.cjs')
execSync(
  `npx --yes esbuild server/server.js --bundle --platform=node --format=cjs --outfile=${bundlePath} --external:node:sqlite`,
  { stdio: 'inherit', cwd: root },
)

console.log('3/4 Gerando blob SEA...')
const seaConfigPath = path.join(root, 'sea-config.json')
fs.writeFileSync(
  seaConfigPath,
  JSON.stringify(
    {
      main: bundlePath,
      output: path.join(root, 'release', 'sea.blob'),
      disableExperimentalSEAWarning: true,
      useSnapshot: false,
    },
    null,
    2,
  ),
)
execSync(`node --experimental-sea-config ${seaConfigPath}`, { stdio: 'inherit', cwd: root })

console.log('4/4 Injetando blob no binário Node...')
const nodeBin = process.execPath
const outBin = path.join(releaseDir, 'orienta-if')
fs.copyFileSync(nodeBin, outBin)
execSync(
  `npx --yes postject ${outBin} NODE_SEA_BLOB ${path.join(root, 'release', 'sea.blob')} --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e068b9faffaedb98`,
  { stdio: 'inherit', cwd: root },
)
fs.chmodSync(outBin, 0o755)

// Copia o front para ao lado do executável
const distSrc = path.join(root, 'dist')
const distDst = path.join(releaseDir, 'dist')
fs.rmSync(distDst, { recursive: true, force: true })
fs.cpSync(distSrc, distDst, { recursive: true })

// Lançadores plug-and-play
fs.writeFileSync(
  path.join(releaseDir, 'INICIAR.sh'),
  `#!/bin/sh\ncd "$(dirname "$0")"\n./orienta-if\n`,
  { mode: 0o755 },
)
fs.writeFileSync(
  path.join(releaseDir, 'INICIAR.bat'),
  `start "" "%~dp0orienta-if.exe"\r\n`,
)

console.log(`\nPronto em ${releaseDir}:\n - orienta-if (duplo clique ou ./orienta-if)\n - dist/ (front)\n - orienta.db (criado no 1o uso)\nAcesse http://localhost:3001`)
