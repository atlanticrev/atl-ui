import { join } from 'node:path';

import { compile } from 'sass';
import { describe, expect, it } from 'vitest';

const packageRoot = process.cwd().endsWith('atl-ui-vanilla')
	? process.cwd()
	: join(process.cwd(), 'packages/atl-ui-vanilla');

const compileComponent = (name: string): string => {
	return compile(join(packageRoot, 'src/styles/components', `_${name}.scss`)).css;
};

describe('overlay and disclosure regression contracts', () => {
	it('uses the dynamic viewport for every native modal backdrop', () => {
		for (const name of ['dialog', 'drawer']) expect(compileComponent(name)).toContain('height: 100dvh');
	});

	it('overrides the browser popover scrollbar for tooltips', () => {
		expect(compileComponent('tooltip')).toContain('overflow: visible');
	});

	it('keeps collapse width stable and exposes one popup content surface', () => {
		expect(compileComponent('collapse')).toContain('width: 100%');

		expect(compileComponent('popup')).toContain('.alt-popup__content');
	});
});
