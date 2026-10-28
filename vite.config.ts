import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const sha = (): string => {
  const fromVercel = process.env.VERCEL_GIT_COMMIT_SHA
  if (fromVercel) return fromVercel.slice(0, 7)
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  } catch {
    return 'local'
  }
}

const BUILD_ID = sha()
const BUILD_TIME = new Date().toISOString()

/** Grava version.json e carimba o service worker, para o app detectar uma versão nova. */
const stamp = (): Plugin => ({
  name: 'livre-stamp',
  apply: 'build',
  closeBundle() {
    writeFileSync('dist/version.json', JSON.stringify({ id: BUILD_ID, time: BUILD_TIME }))
    if (existsSync('dist/sw.js')) {
      writeFileSync('dist/sw.js', readFileSync('dist/sw.js', 'utf8').replace(/__BUILD_ID__/g, BUILD_ID))
    }
  },
})

export default defineConfig({
  plugins: [react(), stamp()],
  define: {
    __BUILD_ID__: JSON.stringify(BUILD_ID),
    __BUILD_TIME__: JSON.stringify(BUILD_TIME),
  },
})
