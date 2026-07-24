import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const PACKAGE_NAME = '@atlanticrev/atl-ui-vanilla';
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const temporaryRoot = mkdtempSync(join(tmpdir(), 'atl-ui-vanilla-consumer-'));
const packDirectory = join(temporaryRoot, 'pack');
const consumerDirectory = join(temporaryRoot, 'consumer');

const run = (command, args, cwd) => {
	execFileSync(command, args, {
		cwd,
		env: process.env,
		stdio: 'inherit',
	});
};

const write = (path, content) => {
	writeFileSync(path, content, 'utf8');
};

const createConsumerFiles = () => {
	mkdirSync(join(consumerDirectory, 'src'), { recursive: true });

	write(
		join(consumerDirectory, 'package.json'),
		`${JSON.stringify({ name: 'atl-ui-vanilla-consumer-check', private: true, type: 'module' }, null, 2)}\n`,
	);

	write(
		join(consumerDirectory, 'index.html'),
		'<div id="app"></div><script type="module" src="/src/main.js"></script>\n',
	);

	write(
		join(consumerDirectory, 'src/main.js'),
		`import '${PACKAGE_NAME}/default.css';
import { defineAltTextarea } from '${PACKAGE_NAME}/textarea';

defineAltTextarea();

document.querySelector('#app').innerHTML = '<alt-textarea label="Caption"></alt-textarea>';
`,
	);
};

const createImportVerifier = () => {
	write(
		join(consumerDirectory, 'verify-imports.mjs'),
		`import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageName = '${PACKAGE_NAME}';
const packageJsonPath = fileURLToPath(import.meta.resolve(packageName + '/package.json'));
const packageRoot = dirname(packageJsonPath);
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

assert.deepEqual(packageJson.dependencies ?? {}, {}, 'The vanilla package must not have runtime dependencies');
assert.equal(readFileSync(packageJsonPath, 'utf8').includes('workspace:'), false, 'Packed metadata must be publishable');

for (const key of Object.keys(packageJson.exports)) {
	if (key === './package.json') continue;

	const specifier = key === '.' ? packageName : packageName + '/' + key.slice(2);

	if (key.endsWith('.css')) {
		const css = readFileSync(fileURLToPath(import.meta.resolve(specifier)), 'utf8');
		assert.ok(css.length > 0, specifier + ' must resolve to non-empty CSS');
		continue;
	}

	const module = await import(specifier);
	assert.ok(Object.keys(module).length > 0, specifier + ' must expose public symbols');
}

const rootModule = await import(packageName);
const definitions = rootModule.defineAllAltElements();

assert.ok(Object.values(definitions).every((value) => value === undefined));
assert.equal(globalThis.customElements, undefined, 'Imports must not create or require a custom element registry');
assert.equal(globalThis.HTMLElement, undefined, 'Imports must remain safe without browser globals');
assert.equal(existsSync(packageRoot + '/src'), false, 'The tarball must not contain source files');
assert.equal(existsSync(packageRoot + '/demo'), false, 'The tarball must not contain demo files');
assert.equal(existsSync(packageRoot + '/tests'), false, 'The tarball must not contain test files');

console.log('Verified packed JS, CSS, SSR safety and zero runtime dependencies.');
`,
	);
};

const verifyBundleBoundary = () => {
	const assetsDirectory = join(consumerDirectory, 'dist', 'assets');
	const assets = readdirSync(assetsDirectory);
	const javascript = assets
		.filter((file) => file.endsWith('.js'))
		.map((file) => readFileSync(join(assetsDirectory, file), 'utf8'))
		.join('\n');

	assert.ok(
		assets.some((file) => file.endsWith('.css')),
		'The consumer build must contain bundled CSS',
	);
	assert.match(javascript, /alt-textarea/, 'The imported Textarea entry point must be present');
	assert.doesNotMatch(
		javascript,
		/alt-input-field|alt-input__root|data-alt-owned="input"/,
		'A Textarea-only build must not contain the Input implementation',
	);
	assert.doesNotMatch(javascript, /alt-calendar/, 'A Textarea-only build must not contain Calendar registration');
};

try {
	mkdirSync(packDirectory, { recursive: true });

	const packOutput = execFileSync(
		npmCommand,
		['pack', '--workspace', PACKAGE_NAME, '--ignore-scripts', '--json', '--pack-destination', packDirectory],
		{ cwd: projectRoot, encoding: 'utf8', env: process.env },
	);

	const packResults = JSON.parse(packOutput);

	assert.equal(packResults.length, 1, 'npm pack must create exactly one tarball');

	const tarball = join(packDirectory, packResults[0].filename);

	assert.ok(existsSync(tarball), 'npm pack did not create the expected tarball');

	createConsumerFiles();
	createImportVerifier();

	run(npmCommand, ['install', '--ignore-scripts', '--no-audit', '--no-fund', tarball], consumerDirectory);

	run(process.execPath, ['verify-imports.mjs'], consumerDirectory);

	const vite = join(projectRoot, 'node_modules', 'vite', 'bin', 'vite.js');

	assert.ok(existsSync(vite), 'The repository Vite binary is required for the consumer build check');

	run(process.execPath, [vite, 'build'], consumerDirectory);

	verifyBundleBoundary();

	console.log('Clean consumer installation and production build passed.');
} finally {
	rmSync(temporaryRoot, { force: true, recursive: true });
}
