import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { compile } from 'sass';
import { describe, expect, it } from 'vitest';

const packageRoot = process.cwd().endsWith('atl-ui-vanilla')
	? process.cwd()
	: join(process.cwd(), 'packages/atl-ui-vanilla');
const demoPath = join(packageRoot, 'demo/index.html');
const buttonStyles = [
	'_button.scss',
	'_button-tones.scss',
	'_button-variants.scss',
	'_button-support.scss',
	'_button-loading.scss',
	'_button-group.scss',
];
const buttonCss = buttonStyles
	.map((fileName) => compile(join(packageRoot, 'src/styles/components', fileName)).css)
	.join('\n');
const demoHtml = readFileSync(demoPath, 'utf8');

describe('button CSS recipe', () => {
	it('publishes the variants, tones and layout contracts', () => {
		const publicSelectors = [
			'[data-variant=filled]',
			'[data-variant=tonal]',
			'[data-variant=outlined]',
			'[data-variant=text]',
			'[data-variant=elevated]',
			'[data-tone=danger]',
			'[data-tone=success]',
			'[data-full-width]',
			'[data-elevation=none]',
			'.alt-button-group',
		];

		for (const selector of publicSelectors) {
			expect(buttonCss).toContain(selector);
		}
	});

	it('keeps hover touch-safe and exposes explicit disabled state tokens', () => {
		expect(buttonCss).toContain('@media (hover: hover)');
		expect(buttonCss).toContain('--alt-button-disabled-bg');
		expect(buttonCss).toContain('--alt-button-disabled-border');
		expect(buttonCss).toContain('--alt-button-disabled-color');
		expect(buttonCss).not.toContain('opacity: 0.38');
	});

	it('keeps loading content accessible and renders a real indicator slot', () => {
		expect(buttonCss).toContain('.alt-button__loading-indicator');
		expect(buttonCss).toContain('.alt-button__loading-indicator:empty::before');
		expect(buttonCss).toContain('.alt-button__loading-indicator > :where(svg, img)');
		expect(buttonCss).toContain('opacity: 0');
		expect(buttonCss).toContain('@media (prefers-reduced-motion: reduce)');
		expect(buttonCss).not.toContain('visibility: hidden');
	});
});

describe('button demo contract', () => {
	it('uses native disabled loading markup with a decorative spinner', () => {
		const demo = new DOMParser().parseFromString(demoHtml, 'text/html');
		const button = demo.querySelector<HTMLButtonElement>('.alt-button[data-loading]');
		const indicator = button?.querySelector('.alt-button__loading-indicator');

		expect(button?.disabled).toBe(true);
		expect(button?.getAttribute('aria-busy')).toBe('true');
		expect(indicator?.getAttribute('aria-hidden')).toBe('true');
		expect(indicator?.getAttribute('role')).toBeNull();
		expect(button?.querySelector('.alt-button__content')?.textContent).toContain('Publish');
	});

	it('gives icon-only buttons and grouped buttons accessible names', () => {
		const demo = new DOMParser().parseFromString(demoHtml, 'text/html');
		const iconButton = demo.querySelector('.alt-button[data-icon-only]');
		const group = demo.querySelector('.alt-button-group');

		expect(iconButton?.getAttribute('aria-label')).toBeTruthy();
		expect(group?.getAttribute('role')).toBe('group');
		expect(group?.getAttribute('aria-label')).toBeTruthy();
	});
});
