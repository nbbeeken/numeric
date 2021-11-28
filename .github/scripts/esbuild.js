const path = require('path')
const esbuild = require('esbuild');

esbuild.build({
	entryPoints: [path.join('src', 'extension.ts')],
	bundle: true,
	sourcemap: true,
	platform: 'node',
	format: 'cjs',
	external: ['vscode'],
	outfile: path.join('dist', 'numeric.js'),
	watch: process.argv.includes('--watch') || process.argv.includes('-w')
  })
  .catch(() => process.exit(1))
