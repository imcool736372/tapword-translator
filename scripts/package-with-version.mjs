#!/usr/bin/env node

import { readFileSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

async function packageExtension(buildTarget = 'chromium') {
    try {
        // Read version from manifest.json (the source of truth for Chrome extensions)
        const manifestPath = join(projectRoot, 'dist', 'manifest.json');
        const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
        const version = manifest.version;

        console.log(`📦 Packaging extension version: ${version} (${buildTarget})`);

        // Create zip file with version number and target suffix
        const zipFileName = `extension-v${version}-${buildTarget}.zip`;
        const distPath = join(projectRoot, 'dist');

        console.log(`🗜️  Creating ${zipFileName}...`);

        const { stdout, stderr } = await execAsync(
            `cd "${distPath}" && zip -r "../${zipFileName}" . -x '*.DS_Store'`,
            { cwd: projectRoot }
        );

        if (stderr && !stderr.includes('zip warning')) {
            console.error('⚠️  Warnings:', stderr);
        }

        console.log(`✅ Successfully created ${zipFileName}`);
        console.log(`📍 Location: ${join(projectRoot, zipFileName)}`);
    } catch (error) {
        console.error('❌ Packaging failed:', error.message);
        process.exit(1);
    }
}

// Optional CLI arg: build target (chromium | firefox | community)
const targetArg = process.argv[2] || 'chromium';
packageExtension(targetArg);
