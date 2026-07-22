import { join } from 'node:path';

import { compile } from 'sass';
import { describe, expect, it } from 'vitest';

const packageRoot = process.cwd().endsWith('atl-ui-vanilla')
	? process.cwd()
	: join(process.cwd(), 'packages/atl-ui-vanilla');
const componentRoot = join(packageRoot, 'src/styles/components');
const compileComponent = (name: string): string => compile(join(componentRoot, `_${name}.scss`)).css;

describe('notched field focus styles', () => {
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

		expect(css).not.toContain(
			'input.alt-autocomplete__input:focus-visible {\n  border-color:' +
				' var(--alt-color-accent);\n  outline: 0;\n  box-shadow: var(--alt-focus-ring)',
		);
	});
});
