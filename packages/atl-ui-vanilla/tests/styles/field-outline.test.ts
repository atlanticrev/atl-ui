import { join } from 'node:path';

import { compile } from 'sass';
import { describe, expect, it } from 'vitest';

const packageRoot = process.cwd().endsWith('atl-ui-vanilla')
	? process.cwd()
	: join(process.cwd(), 'packages/atl-ui-vanilla');
const componentRoot = join(packageRoot, 'src/styles/components');
const compileComponent = (name: string): string => compile(join(componentRoot, `_${name}.scss`)).css;

describe('field focus styles', () => {
	it('thickens and recolors the input SVG instead of drawing an outer ring', () => {
		const css = compileComponent('input');

		expect(css).toContain('--alt-input-outline-width: 2px');

		expect(css).not.toContain('box-shadow: var(--alt-shadow-sm), var(--alt-focus-ring)');
	});

	it('uses an SVG notch for the standard select trigger', () => {
		const css = [compileComponent('select-outline'), compileComponent('select-states')].join('\n');

		expect(css).toContain('.alt-select__outline-path');

		expect(css).toContain('--alt-select-outline-width: 2px');

		expect(css).not.toContain('box-shadow: var(--alt-shadow-sm), var(--alt-focus-ring)');
	});

	it('does not draw an outer focus ring around a native autocomplete input', () => {
		const css = compileComponent('autocomplete');

		expect(css).toContain('box-shadow: inset 0 0 0 1px var(--alt-color-accent), var(--alt-shadow-sm)');

		expect(css).not.toContain(
			'input.alt-autocomplete__input:focus-visible {\n  border-color:' +
				' var(--alt-color-accent);\n  outline: 0;\n  box-shadow: var(--alt-focus-ring)',
		);
	});

	it('uses the same accent border and compact shadow for search and date-picker focus', () => {
		const styles = [compileComponent('search'), compileComponent('date-picker')];

		expect(styles[0]).toContain('.alt-search__root:focus-within');

		expect(styles[1]).toContain('.alt-date-picker__trigger:focus-visible');

		for (const css of styles) {
			expect(css).toContain('border-color: var(--alt-color-accent)');

			expect(css).toContain('box-shadow: inset 0 0 0 1px var(--alt-color-accent), var(--alt-shadow-sm)');

			expect(css).not.toContain('box-shadow: var(--alt-focus-ring)');
		}
	});

	it('centers the shared SVG clear icon without font metrics', () => {
		const css = compileComponent('search');

		expect(css).toContain('display: inline-grid');

		expect(css).toContain('place-items: center');

		expect(css).not.toContain('.alt-search__clear::before');
	});
});
