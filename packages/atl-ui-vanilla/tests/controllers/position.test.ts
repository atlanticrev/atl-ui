import { describe, expect, it } from 'vitest';

import type { RectLike } from '../../src/controllers/position';
import { calculateOverlayPosition } from '../../src/controllers/position';

type RectOptions = {
	height?: number;
	width?: number;
	x?: number;
	y?: number;
};

const rect = ({ height = 0, width = 0, x = 0, y = 0 }: RectOptions = {}): RectLike => ({
	bottom: y + height,
	height,
	left: x,
	right: x + width,
	top: y,
	width,
});

describe('calculateOverlayPosition', () => {
	it('places an overlay below its anchor', () => {
		const position = calculateOverlayPosition(
			rect({
				height: 40,
				width: 120,
				x: 20,
				y: 100,
			}),
			rect({
				height: 80,
				width: 150,
			}),
			{
				height: 400,
				width: 500,
			},
		);

		expect(position).toEqual({
			left: 20,
			placement: 'bottom-start',
			top: 144,
		});
	});

	it('flips to the side with more available space', () => {
		const position = calculateOverlayPosition(
			rect({
				height: 20,
				x: 30,
				y: 170,
			}),
			rect({
				height: 80,
				width: 100,
			}),
			{
				height: 200,
				width: 300,
			},
		);

		expect(position.placement).toBe('top-start');
		expect(position.top).toBe(86);
	});

	it('clamps end-aligned coordinates to the viewport', () => {
		const position = calculateOverlayPosition(
			rect({
				height: 20,
				width: 20,
				x: 190,
				y: -30,
			}),
			rect({
				height: 60,
				width: 50,
			}),
			{
				height: 200,
				width: 200,
			},
			{
				flip: false,
				placement: 'bottom-end',
			},
		);

		expect(position.left).toBe(142);
		expect(position.top).toBe(8);
	});
});
