import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { defineAltInput } from '../../src/components/input';
import { calculateInputNotch } from '../../src/components/input/input-outline';
import { buildInputOutlinePath } from '../../src/components/input/input-outline-path';
import type { AltInputElementApi } from '../../src/components/input/types';

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

describe('alt-input SVG outline', () => {
	beforeAll(() => {
		defineAltInput();
	});

	beforeEach(() => {
		document.body.replaceChildren();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('builds a rounded outline with a real top gap', () => {
		const path = buildInputOutlinePath({
			height: 40,
			notchStart: 8,
			notchWidth: 20,
			radius: 4,
			strokeWidth: 2,
			width: 100,
		});

		expect(path).toBe(
			'M 4 1 H 8 M 28 1 H 96 A 3 3 0 0 1 99 4 V 36 ' +
				'A 3 3 0 0 1 96 39 H 4 A 3 3 0 0 1 1 36 V 4 A 3 3 0 0 1 4 1',
		);
	});

	it('accounts for the transparent layout border when positioning the label', () => {
		expect(calculateInputNotch({
			direction: 'ltr',
			fieldLeft: 114,
			fieldRight: 374,
			floatingPadding: 4,
			labelWidth: 68,
			rootClientLeft: 1,
			rootLeft: 100,
		})).toEqual({
			labelLeft: 9,
			start: 10,
			width: 68,
		});
	});

	it('aligns floated label text with the native input text', async () => {
		vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function getRect(
			this: HTMLElement,
		) {
			if (this.classList.contains('alt-input__root')) return createRect(100, 300, 48);
			if (this.classList.contains('alt-input__field')) return createRect(114, 260, 24);
			if (this.classList.contains('alt-input__label')) return createRect(0, 68, 20);
			return createRect(0, 0, 0);
		});
		vi.spyOn(window, 'getComputedStyle').mockReturnValue({
			borderTopLeftRadius: '8px',
			borderTopWidth: '1px',
			direction: 'ltr',
			paddingLeft: '4px',
		} as CSSStyleDeclaration);
		const host = document.createElement('alt-input') as AltInputElementApi;
		host.setAttribute('label', 'Search');
		host.setAttribute('placeholder', 'Find posts');
		document.body.append(host);
		await updateComplete();

		const label = host.querySelector<HTMLElement>('.alt-input__label');
		const path = host.querySelector<SVGPathElement>('.alt-input__outline-path');
		expect(Number.parseFloat(label?.style.left ?? '') + 4).toBe(14);
		expect(path?.getAttribute('d')).toContain('M 8 0.5 H 10 M 78 0.5');
	});
});
