#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

function readVersion() {
    const pkgPath = join(projectRoot, 'package.json');
    if (existsSync(pkgPath)) {
        const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
        if (pkg?.version) return String(pkg.version);
    }

    // Fallback (shouldn't happen): read from source manifest
    const manifestPath = join(projectRoot, 'src', 'manifest.json');
    if (existsSync(manifestPath)) {
        const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
        if (manifest?.version) return String(manifest.version);
    }

    throw new Error('Unable to determine version from package.json or src/manifest.json');
}

async function packageSource(buildTarget = 'firefox') {
    const version = readVersion();

    const zipFileName = `source-v${version}.zip`;

    // Package from repo root, excluding build outputs, dependencies, temp dirs, and local secrets.
    // Keep configs + src so AMO can rebuild.
    const excludeGlobs = [
        '*.DS_Store',
        'dist/*',
        'node_modules/*',
        '.git/*',
        'tmp/*',
        'other/tmp/*',
        'other/笔记/*',
        'other/方案/*',
        '*.zip',
    ];

    const excludeArgs = excludeGlobs.map((g) => `-x '${g}'`).join(' ');

    try {
        console.log(`📦 Packaging source version: ${version}`);
        console.log(`🗜️  Creating ${zipFileName}...`);

        const { stdout, stderr } = await execAsync(
            `cd "${projectRoot}" && zip -r "${zipFileName}" . ${excludeArgs}`,
            { cwd: projectRoot }
        );

        if (stdout) process.stdout.write(stdout);
        if (stderr && !stderr.includes('zip warning')) process.stderr.write(stderr);

        console.log(`✅ Successfully created ${zipFileName}`);
        console.log(`📍 Location: ${join(projectRoot, zipFileName)}`);
    } catch (error) {
        console.error('❌ Source packaging failed:', error?.message || error);
        process.exit(1);
    }
}

packageSource();
