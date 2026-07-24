import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { defineAltTextarea } from '../../src/components/textarea';
import { calculateTextareaNotch } from '../../src/components/textarea/textarea-outline';
import type { AltTextareaElementApi } from '../../src/components/textarea/types';

const createRect = (left: number, width: number, height: number): DOMRect => {
	return {
		bottom: height,
		height,
		left,
		right: left + width,
		top: 0,
		width,
		x: left,
		y: 0,
	} as DOMRect;
};

const updateComplete = async (): Promise<void> => {
	await Promise.resolve();

	await Promise.resolve();
};

describe('alt-textarea SVG outline', () => {
	beforeAll(() => {
		defineAltTextarea();
	});

	beforeEach(() => {
		document.body.replaceChildren();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('accounts for the transparent layout border when positioning the static label', () => {
		expect(
			calculateTextareaNotch({
				direction: 'ltr',
				fieldLeft: 114,
				fieldRight: 374,
				floatingPadding: 4,
				labelWidth: 68,
				rootClientLeft: 1,
				rootLeft: 100,
			}),
		).toEqual({
			labelLeft: 9,
			start: 10,
			width: 68,
		});
	});

	it('keeps an empty unfocused label aligned with a real top gap', async () => {
		vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function getRect(
			this: HTMLElement,
		) {
			if (this.classList.contains('alt-textarea__root')) return createRect(100, 300, 160);

			if (this.classList.contains('alt-textarea__field')) return createRect(114, 272, 120);

			if (this.classList.contains('alt-textarea__label')) return createRect(0, 68, 20);

			return createRect(0, 0, 0);
		});

		vi.spyOn(window, 'getComputedStyle').mockReturnValue({
			borderTopLeftRadius: '8px',
			borderTopWidth: '1px',
			direction: 'ltr',
			paddingLeft: '4px',
		} as CSSStyleDeclaration);

		const host = document.createElement('alt-textarea') as AltTextareaElementApi;

		host.setAttribute('label', 'Caption');

		document.body.append(host);

		await updateComplete();

		const label = host.querySelector<HTMLElement>('.alt-textarea__label');

		const path = host.querySelector<SVGPathElement>('.alt-textarea__outline-path');

		expect(document.activeElement).not.toBe(host.textareaElement);

		expect(Number.parseFloat(label?.style.left ?? '') + 4).toBe(14);

		expect(path?.getAttribute('d')).toContain('M 8 0.5 H 10 M 78 0.5');
	});
});
