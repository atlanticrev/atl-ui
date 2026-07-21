import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { createAltDropdownElementClass } from '../../src/components/dropdown';
import type { AltDropdownElementApi } from '../../src/components/dropdown/types';

const TAG_NAME = 'alt-dropdown-test';

beforeAll(() => {
	if (!customElements.get(TAG_NAME)) {
		customElements.define(TAG_NAME, createAltDropdownElementClass(window.HTMLElement));
	}
});

beforeEach(() => document.body.replaceChildren());

describe('alt-dropdown', () => {
	it('supports disabled options, keyboard selection and typed change events', async () => {
		const dropdown = document.createElement(TAG_NAME) as AltDropdownElementApi;
		const onChange = vi.fn();
		dropdown.options = [
			{ label: 'One', value: 'one' },
			{ disabled: true, label: 'Two', value: 'two' },
			{ label: 'Three', value: 'three' },
		];
		dropdown.addEventListener('alt-change', onChange);
		document.body.append(dropdown);
		await Promise.resolve();
		dropdown.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' }));
		dropdown.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
		expect(dropdown.value).toBe('three');
		expect(onChange).toHaveBeenCalledOnce();
	});

	it('selects and clears every enabled option in multiple mode', async () => {
		const dropdown = document.createElement(TAG_NAME) as AltDropdownElementApi;
		dropdown.multiple = true;
		dropdown.options = [
			{ label: 'One', value: 'one' },
			{ disabled: true, label: 'Two', value: 'two' },
			{ label: 'Three', value: 'three' },
		];
		document.body.append(dropdown);
		await Promise.resolve();
		expect(dropdown.selectAll()).toBe(true);
		expect(dropdown.values).toEqual(['one', 'three']);
		expect(dropdown.selectAll()).toBe(true);
		expect(dropdown.values).toEqual([]);
	});

	it('keeps declarative options after reconnecting', async () => {
		const dropdown = document.createElement(TAG_NAME) as AltDropdownElementApi;
		dropdown.innerHTML = '<alt-option label="One" value="one"></alt-option>';
		document.body.append(dropdown);
		await Promise.resolve();
		dropdown.remove();
		document.body.append(dropdown);
		await Promise.resolve();
		expect(dropdown.options.map((option) => option.value)).toEqual(['one']);
	});

	it('gives the owned listbox the consumer accessible name', async () => {
		const dropdown = document.createElement(TAG_NAME) as AltDropdownElementApi;
		dropdown.setAttribute('aria-label', 'Channel options');
		document.body.append(dropdown);
		await Promise.resolve();

		expect(dropdown.getAttribute('role')).toBe('group');
		const listbox = dropdown.querySelector('[role="listbox"]');
		expect(listbox?.getAttribute('aria-label')).toBe('Channel options');
	});

	it('mounts consumer empty and selection icons without cloning', async () => {
		const dropdown = document.createElement(TAG_NAME) as AltDropdownElementApi;
		const emptyIcon = document.createElement('span');
		const checkIcon = document.createElement('span');
		dropdown.emptyIcon = emptyIcon;
		dropdown.options = [{ checkIcon, label: 'One', value: 'one' }];
		dropdown.value = 'one';
		document.body.append(dropdown);
		await Promise.resolve();

		expect(dropdown.querySelector('.alt-listbox__empty-icon')?.firstChild).toBe(emptyIcon);
		expect(dropdown.querySelector('.alt-listbox__option-check')?.firstChild).toBe(checkIcon);
	});
});
