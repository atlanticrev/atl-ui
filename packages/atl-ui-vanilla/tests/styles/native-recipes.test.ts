import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { compile } from 'sass';
import { describe, expect, it } from 'vitest';

const packageRoot = process.cwd().endsWith('atl-ui-vanilla')
	? process.cwd()
	: join(process.cwd(), 'packages/atl-ui-vanilla');
const componentRoot = join(packageRoot, 'src/styles/components');
const recipeFiles = [
	'_breadcrumbs.scss',
	'_card.scss',
	'_checkbox.scss',
	'_chip.scss',
	'_utility-components.scss',
	'_radio.scss',
	'_sidebar.scss',
	'_skeleton.scss',
	'_switcher.scss',
];
const css = recipeFiles.map((fileName) => compile(join(componentRoot, fileName)).css).join('\n');
const baseCss = compile(join(packageRoot, 'src/styles/foundation/_base.scss')).css;
const showcase = readFileSync(join(packageRoot, 'demo/components.html'), 'utf8');

describe('native component recipes', () => {
	it('publishes every namespaced recipe selector', () => {
		for (const selector of [
			'.alt-breadcrumbs',
			'.alt-card',
			'.alt-checkbox',
			'.alt-chip',
			'.alt-divider',
			'.alt-radio',
			'.alt-sidebar',
			'.alt-skeleton',
			'.alt-switcher',
			'.alt-spinner',
			'.alt-stepper',
		])
			expect(css).toContain(selector);
	});

	it('uses native inputs, navigation and links in the showcase', () => {
		const document = new DOMParser().parseFromString(showcase, 'text/html');

		expect(document.querySelector('.alt-checkbox input[type="checkbox"]')).not.toBeNull();

		expect(document.querySelector('.alt-radio input[type="radio"]')).not.toBeNull();

		expect(document.querySelector('.alt-switcher input[role="switch"]')).not.toBeNull();

		expect(document.querySelector('nav.alt-breadcrumbs[aria-label]')).not.toBeNull();

		expect(document.querySelector('.alt-sidebar a[aria-current="page"]')).not.toBeNull();
	});

	it('keeps the native hidden contract above component display declarations', () => {
		expect(baseCss).toContain('[hidden]');

		expect(baseCss).toContain('display: none !important');
	});

	it('supports native buttons as accessible action chips', () => {
		expect(css).toContain('button.alt-chip');

		expect(css).toContain('cursor: pointer');

		expect(css).toContain('box-shadow: var(--alt-focus-ring)');
	});

	it('publishes content-backed skeleton geometry, radius and motion contracts', () => {
		expect(css).toContain('.alt-skeleton-host');

		expect(css).toContain('.alt-skeleton-host__content');

		expect(css).toContain('[aria-busy=true]');

		expect(css).toContain('border-radius: inherit');

		expect(css).toContain('--alt-skeleton-fade-duration');

		expect(css).toContain('prefers-reduced-motion: reduce');
	});
});
