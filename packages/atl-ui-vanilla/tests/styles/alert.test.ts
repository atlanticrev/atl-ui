import { join } from 'node:path';

import { compile } from 'sass';
import { describe, expect, it } from 'vitest';

const packageRoot = process.cwd().endsWith('atl-ui-vanilla')
	? process.cwd()
	: join(process.cwd(), 'packages/atl-ui-vanilla');
const componentRoot = join(packageRoot, 'src/styles/components');
const alertCss = ['_alert.scss', '_alert-tones.scss', '_alert-variants.scss', '_alert-actions.scss']
	.map((fileName) => compile(join(componentRoot, fileName)).css)
	.join('\n');

describe('alert styles', () => {
	it('covers every MUI-compatible severity and visual variant', () => {
		for (const color of ['info', 'success', 'warning', 'error']) {
			expect(alertCss).toContain(`[data-color=${color}]`);
		}
		for (const variant of ['filled', 'outlined', 'standard']) {
			expect(alertCss).toContain(`[data-variant=${variant}]`);
		}
	});

	it('centers SVG actions and exposes explicit hover, active and focus states', () => {
		expect(alertCss).toContain('place-items: center');
		expect(alertCss).toContain('.alt-alert__close, .alt-alert__action-button):hover');
		expect(alertCss).toContain('.alt-alert__close, .alt-alert__action-button):active');
		expect(alertCss).toContain('.alt-alert__close, .alt-alert__action-button):focus-visible');
	});

	it('supports dark and forced color modes', () => {
		expect(alertCss).toContain('[data-alt-theme=dark]');
		expect(alertCss).toContain('@media (forced-colors: active)');
	});
});
