import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { defineAltSelect, type AltSelectElementApi } from '../../src/components/select';

const createRect = (left: number, width: number, height: number): DOMRect =>
	({
		bottom: height,
		height,
		left,
		right: left + width,
		top: 0,
		width,
		x: left,
		y: 0,
	}) as DOMRect;

const flushUpdates = async (): Promise<void> => {
	await Promise.resolve();

	await Promise.resolve();
};

describe('alt-select SVG outline', () => {
	beforeAll(() => {
		defineAltSelect();
	});

	afterEach(() => {
		document.body.replaceChildren();

		vi.restoreAllMocks();
	});

	it('aligns the standard trigger notch with its value text', async () => {
		vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function getRect(
			this: HTMLElement,
		) {
			if (this.classList.contains('alt-select__trigger')) return createRect(100, 300, 48);

			if (this.classList.contains('alt-select__value')) return createRect(114, 260, 24);

			if (this.classList.contains('alt-select__label')) return createRect(0, 68, 20);

			return createRect(0, 0, 0);
		});

		vi.spyOn(window, 'getComputedStyle').mockReturnValue({
			borderTopLeftRadius: '8px',
			borderTopWidth: '1px',
			direction: 'ltr',
			paddingLeft: '4px',
			strokeWidth: '1px',
		} as CSSStyleDeclaration);

		const select = document.createElement('alt-select') as AltSelectElementApi;

		select.setAttribute('label', 'Channel');

		select.setAttribute('placeholder', 'Choose channel');

		document.body.append(select);

		await flushUpdates();

		const label = select.querySelector<HTMLElement>('.alt-select__label');

		const path = select.querySelector<SVGPathElement>('.alt-select__outline-path');

		expect(Number.parseFloat(label?.style.left ?? '') + 4).toBe(14);

		expect(path?.getAttribute('d')).toContain('M 8 0.5 H 10 M 78 0.5');
	});

	it('does not impose an outline on an authored trigger', async () => {
		const select = document.createElement('alt-select') as AltSelectElementApi;

		const trigger = document.createElement('button');

		trigger.dataset.altSelectTrigger = '';

		select.append(trigger);

		document.body.append(select);

		await flushUpdates();

		expect(trigger.querySelector('.alt-select__outline')).toBeNull();

		expect(select.triggerElement).toBe(trigger);
	});
});
