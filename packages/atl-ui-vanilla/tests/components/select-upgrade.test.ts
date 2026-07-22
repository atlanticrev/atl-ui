import { afterEach, describe, expect, it } from 'vitest';

import { defineAltSelect } from '../../src/components/select';
import type { AltSelectElementApi } from '../../src/components/select/types';

const flushUpdates = async (): Promise<void> => {
	await new Promise((resolve) => setTimeout(resolve, 0));
};

afterEach(() => document.body.replaceChildren());

describe('alt-select upgrade', () => {
	it('upgrades label-only declarative options without a render feedback loop', async () => {
		document.body.innerHTML = `
			<alt-select label="Channel">
				<alt-option label="YouTube" value="youtube"></alt-option>
				<alt-option label="TikTok" value="tiktok"></alt-option>
			</alt-select>
		`;

		const select = document.querySelector('alt-select') as AltSelectElementApi;

		const youtube = select.querySelector('alt-option[value="youtube"]') as HTMLElement;

		defineAltSelect();

		await flushUpdates();

		expect(select.options.map(({ label, value }) => ({ label, value }))).toEqual([
			{ label: 'YouTube', value: 'youtube' },
			{ label: 'TikTok', value: 'tiktok' },
		]);

		expect(select.querySelectorAll('.alt-listbox__option')).toHaveLength(2);

		youtube.setAttribute('label', 'YouTube Shorts');

		await flushUpdates();

		expect(select.querySelector('.alt-listbox__option-label')?.textContent).toBe('YouTube Shorts');
	});
});
