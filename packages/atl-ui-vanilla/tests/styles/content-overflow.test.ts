import { join } from 'node:path';

import { compile } from 'sass';
import { describe, expect, it } from 'vitest';

const packageRoot = process.cwd().endsWith('atl-ui-vanilla')
	? process.cwd()
	: join(process.cwd(), 'packages/atl-ui-vanilla');
const componentRoot = join(packageRoot, 'src/styles/components');

const compileComponent = (name: string): string => compile(join(componentRoot, `_${name}.scss`)).css;

describe('content overflow contracts', () => {
	it('keeps table columns scrollable and explicitly configurable', () => {
		const css = compileComponent('table');

		expect(css).toContain('overflow-x: auto');

		expect(css).toContain('--alt-table-min-width');

		expect(css).toContain('[data-overflow=ellipsis]');

		expect(css).toContain('text-overflow: ellipsis');
	});

	it('ellipsizes chip labels without shrinking their actions', () => {
		const css = compileComponent('chip');

		expect(css).toContain('.alt-chip__label');

		expect(css).toContain('text-overflow: ellipsis');

		expect(css).toContain('flex: 0 0 auto');
	});

	it('keeps long field metadata and action labels readable', () => {
		const uploadCss = compileComponent('file-upload');

		const buttonCss = compileComponent('button');

		expect(uploadCss).toContain('overflow-wrap: anywhere');

		expect(uploadCss).toContain('text-overflow: ellipsis');

		expect(buttonCss).toContain('white-space: normal');

		expect(buttonCss).toContain('overflow-wrap: anywhere');
	});
});
