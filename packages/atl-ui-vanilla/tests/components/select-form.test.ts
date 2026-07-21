import { afterEach, beforeAll, describe, expect, it } from 'vitest';

import { type AltSelectElementApi, createAltSelectElementClass, defineAltSelect } from '../../src/components/select';
import type { ElementEnvironment } from '../../src/core';

const flushUpdate = async (): Promise<void> => {
	await Promise.resolve();
};

beforeAll(() => {
	defineAltSelect();
});

afterEach(() => {
	document.body.replaceChildren();
});

describe('alt-select forms and properties', () => {
	it('submits and resets a declarative single value through a native form carrier', async () => {
		const form = document.createElement('form');
		form.innerHTML = `
			<alt-select label="Account" name="account">
				<alt-option value="personal" selected>Personal</alt-option>
				<alt-option value="business">Business</alt-option>
			</alt-select>
		`;
		document.body.append(form);
		await flushUpdate();
		const select = form.querySelector('alt-select') as AltSelectElementApi;

		expect(select.value).toBe('personal');
		expect(new FormData(form).get('account')).toBe('personal');
		select.value = 'business';
		expect(new FormData(form).get('account')).toBe('business');

		form.reset();
		expect(select.value).toBe('personal');
		expect(new FormData(form).get('account')).toBe('personal');
	});

	it('supports typed options and multiple values without a visible native select', async () => {
		const form = document.createElement('form');
		const select = document.createElement('alt-select') as AltSelectElementApi;
		const customIndicator = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		const customLeading = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		const customCheck = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		customIndicator.dataset.testIcon = 'custom';
		select.setAttribute('name', 'platform');
		select.indicatorIcon = customIndicator;
		select.leadingIcon = customLeading;
		select.multiple = true;
		select.options = [
			{ checkIcon: customCheck, label: 'YouTube', value: 'youtube' },
			{ label: 'TikTok', value: 'tiktok' },
		];
		select.values = ['youtube', 'tiktok'];
		form.append(select);
		document.body.append(form);
		await flushUpdate();

		expect(new FormData(form).getAll('platform')).toEqual(['youtube', 'tiktok']);
		expect(select.querySelector('.alt-select__trigger')).toBeInstanceOf(HTMLButtonElement);
		expect(select.querySelector('[data-test-icon="custom"]')).toBe(customIndicator);
		expect(select.querySelector('.alt-select__leading-icon')?.firstChild).toBe(customLeading);
		expect(select.querySelector('.alt-listbox__option-check')?.firstChild).toBe(customCheck);
		expect(select.querySelectorAll('.alt-listbox__option-check [data-alt-icon="check"]')).toHaveLength(1);
		expect(select.querySelector<HTMLSelectElement>('.alt-select__native')?.hidden).toBe(true);

		select.indicatorIcon = null;
		await flushUpdate();
		expect(select.querySelector('.alt-select__indicator')?.childNodes).toHaveLength(0);
		select.indicatorIcon = undefined;
		await flushUpdate();
		expect(select.querySelector('[data-alt-icon="chevron-down"]')).toBeInstanceOf(SVGSVGElement);
	});

	it('floats the label when an empty select renders a placeholder', async () => {
		const select = document.createElement('alt-select') as AltSelectElementApi;
		select.label = 'Channel';
		select.placeholder = 'Choose a channel';
		document.body.append(select);
		await flushUpdate();

		expect(select.dataset.labelFloat).toBe('true');
		expect(select.querySelector('.alt-select__placeholder')?.textContent).toBe('Choose a channel');
	});

	it('recovers properties assigned before the element is upgraded', async () => {
		const tagName = 'alt-select-pre-upgrade-test';
		const select = document.createElement(tagName) as AltSelectElementApi;
		const customIndicator = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		select.options = [{ label: 'Ready', value: 'ready' }];
		select.indicatorIcon = customIndicator;
		select.value = 'ready';
		customElements.define(tagName, createAltSelectElementClass(HTMLElement));
		document.body.append(select);
		await flushUpdate();

		expect(select.value).toBe('ready');
		expect(select.querySelector('.alt-select__indicator')?.firstChild).toBe(customIndicator);
		expect(select.querySelector('.alt-select__value')?.textContent).toBe('Ready');
	});

	it('registers both elements in the explicitly supplied environment', () => {
		const definitions = new Map<string, CustomElementConstructor>();
		const customElements = {
			define: (name: string, elementClass: CustomElementConstructor): void => {
				definitions.set(name, elementClass);
			},
			get: (name: string): CustomElementConstructor | undefined => definitions.get(name),
		} as CustomElementRegistry;
		const elementConstructor = window.HTMLElement;
		const environment: ElementEnvironment = {
			customElements,
			htmlElement: elementConstructor,
		};

		defineAltSelect(environment);
		defineAltSelect(environment);

		expect(Array.from(definitions.keys())).toEqual(['alt-option', 'alt-select']);
	});

	it('proxies constraint validation and focuses the visible trigger', () => {
		const form = document.createElement('form');
		const select = document.createElement('alt-select') as AltSelectElementApi;
		select.setAttribute('helper-text', 'Choose one');
		select.setAttribute('name', 'account');
		select.setAttribute('required', '');
		select.setAttribute('size', 'small');
		select.setAttribute('status', 'error');
		form.append(select);
		document.body.append(form);

		expect(select.form).toBe(form);
		expect(select.checkValidity()).toBe(false);
		expect(select.reportValidity()).toBe(false);
		expect(document.activeElement).toBe(select.querySelector('.alt-select__trigger'));
		expect(select.querySelector('.alt-select__trigger')?.getAttribute('aria-required')).toBe('true');
		expect(select.querySelector('.alt-select__helper')?.textContent).toBe('Choose one');
		expect(select.dataset.size).toBe('small');
		expect(select.dataset.status).toBe('error');
		select.setCustomValidity('Select an account');
		expect(select.validationMessage).toBe('Select an account');
		select.setCustomValidity('');
		select.value = 'account';
		expect(select.hasAttribute('aria-invalid')).toBe(false);
		select.setAttribute('aria-invalid', 'true');
		select.value = 'another-account';
		expect(select.getAttribute('aria-invalid')).toBe('true');
	});
});
