import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const repositoryRoot = fileURLToPath(new URL('..', import.meta.url));
const packageJsonPath = new URL('../packages/atl-ui-vanilla/package.json', import.meta.url);
const sourceIndexPath = new URL('../packages/atl-ui-vanilla/src/index.ts', import.meta.url);
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const registry = packageJson.publishConfig?.registry;

const fail = (message) => {
	console.error(`Release aborted: ${message}`);
	process.exit(1);
};

const run = (command, args, options = {}) => {
	const result = spawnSync(command, args, {
		cwd: repositoryRoot,
		encoding: 'utf8',
		env: process.env,
		stdio: options.capture ? 'pipe' : 'inherit',
	});

	if (result.error) {
		fail(`${command} could not start: ${result.error.message}`);
	}

	if (result.status !== 0 && !options.allowFailure) {
		fail(`${command} exited with status ${result.status ?? 'unknown'}`);
	}

	return result;
};

if (!process.env.GITHUB_TOKEN?.trim()) {
	fail('GITHUB_TOKEN is required; use a classic PAT with read:packages and write:packages.');
}

if (registry !== 'https://npm.pkg.github.com') {
	fail(`unexpected publish registry: ${registry ?? 'missing'}`);
}

const sourceIndex = readFileSync(sourceIndexPath, 'utf8');
const sourceVersion = sourceIndex.match(/ATL_UI_VANILLA_VERSION = '([^']+)'/)?.[1];

if (sourceVersion !== packageJson.version) {
	fail(`package version ${packageJson.version} does not match exported version ${sourceVersion ?? 'missing'}`);
}

const branch = run('git', ['branch', '--show-current'], { capture: true }).stdout.trim();

if (branch !== 'main') {
	fail(`publishing is only allowed from main; current branch is ${branch || 'detached HEAD'}`);
}

const worktree = run('git', ['status', '--porcelain'], { capture: true }).stdout.trim();

if (worktree) {
	fail('the working tree is not clean');
}

const head = run('git', ['rev-parse', 'HEAD'], { capture: true }).stdout.trim();
const originMain = run('git', ['rev-parse', 'origin/main'], { capture: true }).stdout.trim();

if (head !== originMain) {
	fail('main does not match origin/main; fetch and fast-forward before publishing');
}

run('npm', ['whoami', `--registry=${registry}`]);

const packageVersion = `${packageJson.name}@${packageJson.version}`;
const publishedVersion = run('npm', ['view', packageVersion, 'version', `--registry=${registry}`], {
	allowFailure: true,
	capture: true,
});

if (publishedVersion.status === 0) {
	fail(`${packageVersion} is already published`);
}

if (!publishedVersion.stderr.includes('E404')) {
	fail(`could not confirm that ${packageVersion} is unpublished`);
}

console.log(`Publishing ${packageVersion} to ${registry}`);
run('npm', ['run', 'release:vanilla:check']);

// The release gate ends with a fresh build and a packed-consumer check. Skip duplicate lifecycle scripts here;
// direct npm publish calls still retain the package-level prepublishOnly safeguard.
run('npm', ['publish', '--ignore-scripts', '--workspace', packageJson.name]);
