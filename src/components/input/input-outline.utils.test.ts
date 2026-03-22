import { describe, expect, it } from 'vitest';

import { buildInputOutlinePath } from './input-outline.utils';

describe('buildInputOutlinePath', () => {
	it('creates a rounded outline with a top notch for the floating label', () => {
		const path = buildInputOutlinePath({
			height: 40,
			notchStart: 8,
			notchWidth: 20,
			radius: 4,
			strokeWidth: 2,
			width: 100,
		});

		expect(path).toBe(
			'M 4 1 H 8 M 28 1 H 96 A 3 3 0 0 1 99 4 V 36 A 3 3 0 0 1 96 39 H 4 A 3 3 0 0 1 1 36 V 4 A 3 3 0 0 1 4 1',
		);
	});

	it('falls back to a sharp outline when the radius is zero', () => {
		const path = buildInputOutlinePath({
			height: 10,
			notchStart: 8,
			notchWidth: 0,
			radius: 0,
			strokeWidth: 2,
			width: 20,
		});

		expect(path).toBe('M 1 1 H 19 V 9 H 1 V 1');
	});
});
