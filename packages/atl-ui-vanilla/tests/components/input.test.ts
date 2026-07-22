import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { createAltInputElementClass, defineAltInput } from '../../src/components/input';
import type { AltInputElementApi } from '../../src/components/input/types';

const updateComplete = async (): Promise<void> => {
	await Promise.resolve();

	await Promise.resolve();
};

describe('alt-input', () => {
	beforeAll(() => {
		defineAltInput();
	});

	beforeEach(() => {
		document.body.replaceChildren();
	});

	it('creates an accessible native input and submits with a form', async () => {
		const form = document.createElement('form');

		form.innerHTML = `
			<alt-input
				description="Public description"
				helper-text="Required field"
				label="Title"
				name="title"
				required
				value="Initial"
			></alt-input>
		`;

		document.body.append(form);

		await updateComplete();

		const host = form.querySelector('alt-input') as AltInputElementApi;

		const input = host.inputElement;

		expect(input?.labels).toHaveLength(1);

		expect(input?.required).toBe(true);

		expect(input?.getAttribute('aria-labelledby')).toBe(host.querySelector('.alt-input__label')?.id);

		expect(input?.getAttribute('aria-describedby')).toContain('description');

		expect(new FormData(form).get('title')).toBe('Initial');
	});

	it('updates properties and emits typed value events', async () => {
		const host = document.createElement('alt-input') as AltInputElementApi;

		const onInput = vi.fn();

		host.addEventListener('alt-input', onInput);

		document.body.append(host);

		await updateComplete();

		host.value = 'Next';

		host.leadingIcon = document.createTextNode('L');

		host.readOnlyStyled = true;

		host.variant = 'number';

		await updateComplete();

		expect(host.inputElement?.value).toBe('Next');

		expect(host.inputElement?.inputMode).toBe('decimal');

		expect(host.dataset.readonlyStyled).toBe('true');

		expect(host.querySelector('[data-position="leading"]')?.textContent).toBe('L');

		host.inputElement?.dispatchEvent(
			new Event('input', {
				bubbles: true,
			}),
		);

		expect(onInput).toHaveBeenCalledOnce();

		expect(onInput.mock.calls[0]?.[0].detail).toEqual({
			value: 'Next',
		});
	});

	it('floats the label when an empty field has a placeholder', async () => {
		const host = document.createElement('alt-input') as AltInputElementApi;

		host.setAttribute('label', 'Title');

		host.setAttribute('placeholder', 'Enter a title');

		document.body.append(host);

		await updateComplete();

		expect(host.value).toBe('');

		expect(host.dataset.filled).toBe('false');

		expect(host.dataset.labelFloat).toBe('true');

		expect(host.inputElement?.placeholder).toBe('Enter a title');
	});

	it('restores the default value when its form resets', async () => {
		const form = document.createElement('form');

		form.innerHTML = '<alt-input name="query" value="Default"></alt-input>';

		document.body.append(form);

		await updateComplete();

		const host = form.firstElementChild as AltInputElementApi;

		host.value = 'Changed';

		form.reset();

		await updateComplete();

		expect(host.value).toBe('Default');

		expect(new FormData(form).get('query')).toBe('Default');
	});

	it('preserves a property assigned before custom element upgrade', async () => {
		const tagName = 'alt-input-pre-upgrade';

		const host = document.createElement(tagName) as AltInputElementApi;

		host.value = 'Before definition';

		document.body.append(host);

		customElements.define(tagName, createAltInputElementClass(HTMLElement));

		await updateComplete();

		expect(host.value).toBe('Before definition');

		expect(host.inputElement?.value).toBe('Before definition');
	});

	it('hydrates matching server light DOM without replacing it', async () => {
		const tagName = 'alt-input-server';

		const host = document.createElement(tagName) as AltInputElementApi;

		host.innerHTML = `
			<label class="alt-input__root" data-alt-owned="input">
				<span class="alt-input__label"></span><span class="alt-input__icon"></span>
				<span class="alt-input__content"><input class="alt-input__field" />
				<span class="alt-input__description"></span></span><span class="alt-input__icon"></span>
			</label>
			<div class="alt-input__footer"><span class="alt-input__helper"></span>
			<span class="alt-input__counter"></span></div>
		`;

		const serverRoot = host.firstElementChild;

		document.body.append(host);

		customElements.define(tagName, createAltInputElementClass(HTMLElement));

		await updateComplete();

		expect(host.firstElementChild).toBe(serverRoot);

		expect(host.inputElement).toBe(serverRoot?.querySelector('input'));
	});
});
