#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const outputFile = path.join(__dirname, '..', 'src', '5_backend', 'config', 'credentials.ts')

const stubContent = `// Auto-generated stub credentials for community builds
export function hasBuildTimeCredentials(): boolean {
    return false
}

export const BUILD_TIME_CREDENTIALS = Object.freeze({
    apiKey: "",
    apiSecret: "",
    injectedAt: "community-stub",
    buildEnvironment: "community"
})
`

fs.mkdirSync(path.dirname(outputFile), { recursive: true })
fs.writeFileSync(outputFile, stubContent, 'utf-8')

console.log('Generated stub credentials for community build')
console.log(`Output: ${path.relative(path.join(__dirname, '..'), outputFile)}`)
