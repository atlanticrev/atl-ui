import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import type { AltSelectElementApi } from '../../src/components/select';
import { defineAltSelect } from '../../src/components/select';

beforeAll(() => {
	defineAltSelect();
});
afterEach(() => document.body.replaceChildren());

const flushUpdates = async (): Promise<void> => {
	await Promise.resolve();
	await Promise.resolve();
};

describe('alt-select composition', () => {
	it('uses an authored trigger and toggles the popup on repeated clicks', async () => {
		const select = document.createElement('alt-select') as AltSelectElementApi;
		const trigger = document.createElement('button');
		trigger.dataset.altSelectTrigger = '';
		trigger.textContent = 'Choose channels';
		select.setAttribute('label', 'Channel');
		select.append(trigger);
		select.options = [{ label: 'Instagram', value: 'instagram' }];
		document.body.append(select);
		await flushUpdates();

		trigger.click();
		expect(select.open).toBe(true);
		trigger.click();
		expect(select.open).toBe(false);
		expect(select.triggerElement).toBe(trigger);
		expect(trigger.textContent).toBe('Choose channels');
		expect(trigger.getAttribute('aria-label')).toBe('Channel');
	});

	it('preserves authored option DOM, content and listeners', async () => {
		const select = document.createElement('alt-select') as AltSelectElementApi;
		const option = document.createElement('alt-option');
		const action = document.createElement('span');
		const onAction = vi.fn();
		option.setAttribute('value', 'advanced');
		option.append('Advanced ', action);
		action.textContent = 'settings';
		action.addEventListener('click', onAction);
		select.append(option);
		document.body.append(select);
		await flushUpdates();

		expect(select.querySelector('alt-option')).toBe(option);
		expect(option.contains(action)).toBe(true);
		select.show();
		action.click();
		expect(onAction).toHaveBeenCalledOnce();
		expect(select.value).toBe('advanced');
	});

	it('allows consumers to cancel an opening transition', async () => {
		const select = document.createElement('alt-select') as AltSelectElementApi;
		select.options = [{ label: 'One', value: 'one' }];
		select.addEventListener('alt-before-open-change', (event) => event.preventDefault());
		document.body.append(select);
		await flushUpdates();

		select.show();
		expect(select.open).toBe(false);
	});
});
