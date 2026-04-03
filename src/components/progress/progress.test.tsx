import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { AtlProgress } from './index';

describe('AtlProgress', () => {
	afterEach(() => {
		cleanup();
	});

	it('scales and clamps the value against max', () => {
		render(
			<AtlProgress
				label="Upload"
				max={50}
				value={75}
			/>,
		);

		const progressbar = screen.getByRole('progressbar');
		const fill = document.querySelector<HTMLElement>('.atl-progress__fill');

		expect(progressbar.getAttribute('aria-valuemax')).toBe('50');
		expect(progressbar.getAttribute('aria-valuenow')).toBe('50');
		expect(screen.getByText('100%')).not.toBeNull();
		expect(fill?.style.width).toBe('100%');
	});

	it('omits aria-valuenow for indeterminate progress', () => {
		render(
			<AtlProgress
				indeterminate
				label="Processing"
				showValue={false}
				status="running"
			/>,
		);

		const progressbar = screen.getByRole('progressbar');
		const fill = document.querySelector<HTMLElement>('.atl-progress__fill');

		expect(progressbar.hasAttribute('aria-valuenow')).toBe(false);
		expect(fill?.style.width).toBe('38%');
	});

	it('falls back to an aria-label when there is no visible label', () => {
		render(
			<AtlProgress
				showValue={false}
				value={12}
			/>,
		);

		const progressbar = screen.getByRole('progressbar');
		expect(progressbar.getAttribute('aria-label')).toBe('Progress');
	});
});
