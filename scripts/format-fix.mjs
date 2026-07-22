import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, extname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const vanillaRoot = resolve(projectRoot, 'packages/atl-ui-vanilla');
const requestedTargets = process.argv.slice(2).map((file) => resolve(projectRoot, file));
const hasRequestedTargets = requestedTargets.length > 0;
const executableExtension = process.platform === 'win32' ? '.cmd' : '';

const isInside = (root, file) => {
	const path = relative(root, file);

	return path !== '..' && !path.startsWith(`..${sep}`) && !isAbsolute(path);
};

const relativeTo = (root, file) => {
	const path = relative(root, file);

	if (!isInside(root, file)) {
		throw new Error(`Formatter target is outside the repository: ${file}`);
	}

	return path || '.';
};

const run = (command, args, cwd) => {
	const result = spawnSync(`${command}${executableExtension}`, args, {
		cwd,
		env: process.env,
		stdio: 'inherit',
	});

	if (result.error) throw result.error;

	if (result.status !== 0) process.exit(result.status ?? 1);
};

for (const file of requestedTargets) relativeTo(projectRoot, file);

const requestedFiles = requestedTargets.filter((file) => existsSync(file));
const biomeTargets = hasRequestedTargets ? requestedFiles.map((file) => relativeTo(projectRoot, file)) : ['.'];

if (biomeTargets.length) {
	run('biome', ['check', '--write', '--no-errors-on-unmatched', ...biomeTargets], projectRoot);
}

const atlExtensions = new Set(['.js', '.jsx', '.ts', '.tsx']);
const atlTargets = hasRequestedTargets
	? requestedFiles
			.filter((file) => atlExtensions.has(extname(file)) && isInside(vanillaRoot, file))
			.map((file) => relativeTo(vanillaRoot, file))
	: ['{src,tests,demo}/**/*.{js,jsx,ts,tsx}', '*.{js,jsx,ts,tsx}'];

if (atlTargets.length) run('atl-formatter', ['--write', ...atlTargets], vanillaRoot);
