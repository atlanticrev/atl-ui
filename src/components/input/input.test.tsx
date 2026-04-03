import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AtlInput } from './input';

type MockRectParams = {
	height?: number;
	width?: number;
	x?: number;
	y?: number;
};

const createRect = ({ height = 0, width = 0, x = 0, y = 0 }: MockRectParams = {}): DOMRect =>
	({
		bottom: y + height,
		height,
		left: x,
		right: x + width,
		top: y,
		width,
		x,
		y,
	}) as DOMRect;

const createRootStyles = (): CSSStyleDeclaration =>
	({
		borderTopLeftRadius: '4px',
		getPropertyValue: (propertyName: string) =>
			propertyName === '--atl-input-label-floating-padding-inline' ? '4px' : '',
		paddingLeft: '14px',
	}) as CSSStyleDeclaration;

const EXPECTED_OUTLINE_PATH = [
	'M 4 0.5 H 10',
	'M 38 0.5 H 96',
	'A 3.5 3.5 0 0 1 99.5 4',
	'V 36',
	'A 3.5 3.5 0 0 1 96 39.5',
	'H 4',
	'A 3.5 3.5 0 0 1 0.5 36',
	'V 4',
	'A 3.5 3.5 0 0 1 4 0.5',
].join(' ');

describe('AtlInput', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('aligns the outline gap with the floated label box', () => {
		vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function mockRect(
			this: HTMLElement,
		) {
			if (this.classList.contains('atl-input__label-measure')) {
				return createRect({
					height: 16,
					width: 28,
				});
			}

			if (this.classList.contains('atl-input__root')) {
				return createRect({
					height: 40,
					width: 100,
				});
			}

			if (this.classList.contains('atl-input__field')) {
				return createRect({
					height: 16,
					width: 60,
					x: 14,
				});
			}

			return createRect();
		});
		vi.spyOn(window, 'getComputedStyle').mockImplementation((element: Element) => {
			if (element instanceof HTMLElement && element.classList.contains('atl-input__root')) {
				return createRootStyles();
			}

			return {
				borderTopLeftRadius: '',
				getPropertyValue: () => '',
			} as unknown as CSSStyleDeclaration;
		});

		render(
			<AtlInput
				label="Search"
				testId="search"
				value="Figma"
			/>,
		);

		const outlinePath = document.querySelector<SVGPathElement>('.atl-input__outline-path');
		expect(outlinePath).not.toBeNull();

		if (!outlinePath) {
			return;
		}

		expect(outlinePath.getAttribute('d')).toBe(EXPECTED_OUTLINE_PATH);
	});
});
