import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import {
	ALT_SELECT_CHANGE_EVENT,
	ALT_SELECT_OPEN_CHANGE_EVENT,
	type AltSelectElementApi,
	defineAltSelect,
} from '../../src/components/select';

beforeAll(() => {
	defineAltSelect();
});

afterEach(() => {
	document.body.replaceChildren();
});

const createSelect = (): AltSelectElementApi => {
	const select = document.createElement('alt-select') as AltSelectElementApi;

	select.setAttribute('aria-label', 'Platform');

	select.options = [
		{ label: 'One', value: 'one' },
		{ disabled: true, label: 'Two', value: 'two' },
		{ label: 'Three', value: 'three' },
	];

	document.body.append(select);

	return select;
};

const press = (target: Element, key: string): void => {
	target.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key }));
};

describe('alt-select keyboard and accessibility', () => {
	it('exposes a combobox/listbox pattern and skips disabled options', () => {
		const select = createSelect();

		const trigger = select.querySelector<HTMLButtonElement>('.alt-select__trigger');

		const list = select.querySelector<HTMLElement>('.alt-listbox');

		expect(trigger?.getAttribute('role')).toBe('combobox');

		expect(trigger?.getAttribute('aria-controls')).toBe(list?.id);

		expect(list?.getAttribute('role')).toBe('listbox');

		press(trigger as HTMLButtonElement, 'ArrowDown');

		expect(select.open).toBe(true);

		expect(select.hasAttribute('open')).toBe(true);

		expect(select.querySelector<HTMLElement>('.alt-select__popup')?.hidden).toBe(false);

		expect(trigger?.getAttribute('aria-expanded')).toBe('true');

		expect(list?.querySelector('[data-active="true"]')?.getAttribute('data-value')).toBe('one');

		press(trigger as HTMLButtonElement, 'ArrowDown');

		expect(list?.querySelector('[data-active="true"]')?.getAttribute('data-value')).toBe('three');

		press(trigger as HTMLButtonElement, 'Enter');

		expect(select.value).toBe('three');

		expect(select.open).toBe(false);

		expect(select.hasAttribute('open')).toBe(false);

		expect(select.querySelector<HTMLElement>('.alt-select__popup')?.hidden).toBe(true);
	});

	it('supports Home, End, Space, Escape and emits typed state events', () => {
		const select = createSelect();

		const trigger = select.querySelector<HTMLButtonElement>('.alt-select__trigger') as HTMLButtonElement;

		const onChange = vi.fn();

		const onOpenChange = vi.fn();

		select.addEventListener(ALT_SELECT_CHANGE_EVENT, onChange);

		select.addEventListener(ALT_SELECT_OPEN_CHANGE_EVENT, onOpenChange);

		press(trigger, ' ');

		press(trigger, 'End');

		press(trigger, 'Enter');

		expect(select.value).toBe('three');

		expect(onChange).toHaveBeenCalledOnce();

		press(trigger, ' ');

		press(trigger, 'Home');

		press(trigger, 'Enter');

		expect(select.value).toBe('one');

		press(trigger, ' ');

		press(trigger, 'Escape');

		expect(select.open).toBe(false);

		expect(onOpenChange).toHaveBeenCalled();
	});

	it('keeps multiple selection open and ignores disabled option clicks', () => {
		const select = createSelect();

		const onChange = vi.fn();

		select.multiple = true;

		select.addEventListener('alt-change', onChange);

		select.show();

		const disabled = select.querySelector<HTMLElement>('[data-value="two"]') as HTMLElement;

		disabled.click();

		expect(select.values).toEqual([]);

		select.querySelector<HTMLElement>('[data-value="one"]')?.click();

		expect(select.values).toEqual(['one']);

		expect(select.open).toBe(true);

		select.querySelector<HTMLElement>('[data-value="one"]')?.click();

		expect(select.values).toEqual([]);

		expect(onChange.mock.calls[1]?.[0].detail.reason).toBe('remove');
	});
});
