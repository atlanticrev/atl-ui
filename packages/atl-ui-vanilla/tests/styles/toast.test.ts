import { join } from 'node:path';

import { compile } from 'sass';
import { describe, expect, it } from 'vitest';

const packageRoot = process.cwd().endsWith('atl-ui-vanilla')
	? process.cwd()
	: join(process.cwd(), 'packages/atl-ui-vanilla');
const componentRoot = join(packageRoot, 'src/styles/components');
const toastCss = ['_toast.scss', '_toast-actions.scss', '_toast-motion.scss']
	.map((fileName) => compile(join(componentRoot, fileName)).css)
	.join('\n');

describe('toast CSS lifecycle', () => {
	it('animates content and stack height as separate phases', () => {
		expect(toastCss).toContain('alt-toast-expand');

		expect(toastCss).toContain('alt-toast-enter');

		expect(toastCss).toContain('alt-toast-exit');

		expect(toastCss).toContain('alt-toast-collapse');

		expect(toastCss).toContain('grid-template-rows: 0fr');
	});

	it('keeps close affordances visible for pointer and keyboard users', () => {
		expect(toastCss).toContain('.alt-toast__dismiss .alt-icon');

		expect(toastCss).not.toContain('.alt-toast__dismiss::before');

		expect(toastCss).toContain('.alt-toast__dismiss:hover:not(:disabled)');

		expect(toastCss).toContain('.alt-toast__dismiss:active:not(:disabled)');

		expect(toastCss).toContain('.alt-toast__dismiss:focus-visible');
	});

	it('does not render a translucent tail below the final toast', () => {
		expect(toastCss).toContain('padding-block-start: 0.75rem');

		expect(toastCss).toContain('--alt-toast-shadow, none');

		expect(toastCss).not.toContain('padding-block: 0.375rem');
	});
});
