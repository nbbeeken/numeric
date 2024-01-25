const path = require('path')
const esbuild = require('esbuild');

// watch: process.argv.includes('--watch') || process.argv.includes('-w'),

esbuild.build({
	entryPoints: [path.join('src', 'extension.ts')],
	bundle: true,
	platform: 'node',
	format: 'cjs',
	external: ['vscode'],
	outfile: path.join('dist', 'numeric.js'),
	sourcemap: process.argv.includes('--sourcemap'),
	minify: process.argv.includes('--minify') || process.argv.includes('-m')
  })
  .catch(() => process.exit(1))
