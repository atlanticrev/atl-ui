import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { createAltProgressElementClass } from '../../src/components/progress';
import type { AltProgressElementApi } from '../../src/components/progress/types';

const TAG_NAME = 'alt-progress-test';

beforeAll(() => {
	if (!customElements.get(TAG_NAME))
		customElements.define(TAG_NAME, createAltProgressElementClass(window.HTMLElement));
});

beforeEach(() => document.body.replaceChildren());

describe('alt-progress', () => {
	it('clamps native progress and exposes the percentage', async () => {
		const progress = document.createElement(TAG_NAME) as AltProgressElementApi;

		progress.setAttribute('label', 'Upload');

		progress.max = 50;

		progress.value = 75;

		document.body.append(progress);

		await Promise.resolve();

		const control = progress.querySelector<HTMLProgressElement>('progress');

		expect(control?.value).toBe(50);

		expect(progress.querySelector('.alt-progress__value')?.textContent).toBe('100%');

		expect(control?.getAttribute('aria-labelledby')).toContain('label');
	});

	it('uses the native indeterminate state without aria-valuenow', async () => {
		const progress = document.createElement(TAG_NAME) as AltProgressElementApi;

		progress.indeterminate = true;

		document.body.append(progress);

		await Promise.resolve();

		expect(progress.querySelector('progress')?.hasAttribute('value')).toBe(false);

		expect(progress.querySelector('.alt-progress__value')?.hasAttribute('hidden')).toBe(true);
	});

	it('renders the circular variant while retaining native progress semantics', async () => {
		const progress = document.createElement(TAG_NAME) as AltProgressElementApi;

		progress.shape = 'circular';

		progress.value = 25;

		document.body.append(progress);

		await Promise.resolve();

		expect(progress.dataset.shape).toBe('circular');

		expect(
			Number(progress.querySelector<SVGCircleElement>('.alt-progress__circle-fill')?.style.strokeDashoffset),
		).toBeCloseTo(84.82, 1);

		expect(progress.querySelector('progress')?.value).toBe(25);
	});
});
