import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { compile } from 'sass';
import { describe, expect, it } from 'vitest';

const packageRoot = process.cwd().endsWith('atl-ui-vanilla')
	? process.cwd()
	: join(process.cwd(), 'packages/atl-ui-vanilla');
const componentRoot = join(packageRoot, 'src/styles/components');
const compileComponent = (name: string): string => compile(join(componentRoot, `_${name}.scss`)).css;

describe('visual regression contracts', () => {
	it('uses readable white ink on the darker filled warning surface', () => {
		const tones = compileComponent('alert-tones');
		const variants = compileComponent('alert-variants');
		expect(tones).toContain('--alt-alert-warning-filled-bg: #b54708');
		expect(tones).toContain('--alt-alert-warning-filled-ink: #ffffff');
		expect(variants).toContain('--alt-alert-state-bg: var(--alt-alert-filled-bg)');
	});

	it('gives checked radio dots explicit dimensions for every size', () => {
		const css = compileComponent('radio');
		expect(css).toContain('--alt-radio-dot-size: 10px');
		expect(css).toContain('width: var(--alt-radio-dot-size)');
		expect(css).toContain('height: var(--alt-radio-dot-size)');
	});

	it('makes collapsed sidebar items centered squares', () => {
		const css = compileComponent('sidebar');
		expect(css).toContain('justify-content: center');
		expect(css).toContain('width: 40px');
		expect(css).toContain('padding: 0');
	});

	it('keeps tab icons and labels together', () => {
		const css = compileComponent('tabs');
		expect(css).toContain('display: inline-flex');
		expect(css).toContain('white-space: nowrap');
		expect(css).toContain('.alt-tabs__tab > :where(svg, .alt-icon)');
	});

	it('colors a focused floating label with the notched outline', () => {
		const css = compileComponent('input');
		expect(css).toContain('--alt-input-border-color: var(--alt-color-accent)');
		expect(css).toContain('--alt-input-state-color: var(--alt-color-accent)');
	});

	it('uses alt-input instead of a native search field in the catalog', () => {
		const html = readFileSync(join(packageRoot, 'demo/storybook.html'), 'utf8');
		expect(html).toContain('<alt-input');
		expect(html).toContain('id="catalog-search"');
		expect(html).not.toContain('type="search"');
	});
});
