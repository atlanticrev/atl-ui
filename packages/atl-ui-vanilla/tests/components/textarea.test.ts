import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { createAltTextareaElementClass, defineAltTextarea } from '../../src/components/textarea';
import type { AltTextareaElementApi } from '../../src/components/textarea/types';

const updateComplete = async (): Promise<void> => {
	await Promise.resolve();

	await Promise.resolve();
};

describe('alt-textarea', () => {
	beforeAll(() => {
		defineAltTextarea();
	});

	beforeEach(() => {
		document.body.replaceChildren();
	});

	it('creates an accessible native textarea and submits with a form', async () => {
		const form = document.createElement('form');

		form.innerHTML = `
			<alt-textarea
				description="Public description"
				helper-text="Required field"
				label="Caption"
				max-length="50"
				min-length="4"
				name="caption"
				required
				rows="5"
				value="Initial caption"
				wrap="hard"
			></alt-textarea>
		`;

		document.body.append(form);

		await updateComplete();

		const host = form.querySelector('alt-textarea') as AltTextareaElementApi;

		const textarea = host.textareaElement;

		expect(textarea?.labels).toHaveLength(1);

		expect(textarea?.required).toBe(true);

		expect(textarea?.minLength).toBe(4);

		expect(textarea?.maxLength).toBe(50);

		expect(textarea?.rows).toBe(5);

		expect(textarea?.wrap).toBe('hard');

		expect(textarea?.getAttribute('aria-labelledby')).toBe(host.querySelector('.alt-textarea__label')?.id);

		expect(textarea?.getAttribute('aria-describedby')).toContain('description');

		expect(textarea?.getAttribute('aria-describedby')).toContain('helper');

		expect(new FormData(form).get('caption')).toBe('Initial caption');
	});

	it('updates properties and emits typed value events', async () => {
		const host = document.createElement('alt-textarea') as AltTextareaElementApi;

		const onInput = vi.fn();

		const onChange = vi.fn();

		host.addEventListener('alt-input', onInput);

		host.addEventListener('alt-change', onChange);

		document.body.append(host);

		await updateComplete();

		host.value = 'Next caption';

		host.readOnlyStyled = true;

		await updateComplete();

		expect(host.textareaElement?.value).toBe('Next caption');

		expect(host.dataset.readonlyStyled).toBe('true');

		host.textareaElement?.dispatchEvent(new Event('input', { bubbles: true }));

		host.textareaElement?.dispatchEvent(new Event('change', { bubbles: true }));

		expect(onInput).toHaveBeenCalledOnce();

		expect(onInput.mock.calls[0]?.[0].detail).toEqual({
			value: 'Next caption',
		});

		expect(onChange).toHaveBeenCalledOnce();

		expect(onChange.mock.calls[0]?.[0].detail).toEqual({
			value: 'Next caption',
		});
	});

	it('keeps the label static and exposes character count without inventing a maximum', async () => {
		const host = document.createElement('alt-textarea') as AltTextareaElementApi;

		host.setAttribute('label', 'Caption');

		host.setAttribute('show-character-count', '');

		host.value = 'Three';

		document.body.append(host);

		await updateComplete();

		expect(host.querySelector('.alt-textarea__label')?.textContent).toBe('Caption');

		expect(host.querySelector('.alt-textarea__counter')?.textContent).toBe('5');

		expect(host.textareaElement?.hasAttribute('maxlength')).toBe(false);

		host.setAttribute('max-length', '20');

		await updateComplete();

		expect(host.querySelector('.alt-textarea__counter')?.textContent).toBe('5/20');
	});

	it('reflects semantic state and explicit aria labels on the native field', async () => {
		const host = document.createElement('alt-textarea') as AltTextareaElementApi;

		host.setAttribute('aria-label', 'Internal notes');

		host.setAttribute('label', 'Notes');

		host.setAttribute('status', 'error');

		document.body.append(host);

		await updateComplete();

		expect(host.textareaElement?.getAttribute('aria-label')).toBe('Internal notes');

		expect(host.textareaElement?.hasAttribute('aria-labelledby')).toBe(false);

		expect(host.textareaElement?.getAttribute('aria-invalid')).toBe('true');
	});

	it('uses native validation and excludes a disabled field from form data', async () => {
		const form = document.createElement('form');

		form.innerHTML = '<alt-textarea name="notes" required></alt-textarea>';

		document.body.append(form);

		await updateComplete();

		const host = form.firstElementChild as AltTextareaElementApi;

		expect(host.checkValidity()).toBe(false);

		host.setCustomValidity('Custom failure');

		expect(host.validationMessage).toBe('Custom failure');

		host.setCustomValidity('');

		host.value = 'Ready';

		expect(host.checkValidity()).toBe(true);

		host.disabled = true;

		await updateComplete();

		expect(new FormData(form).has('notes')).toBe(false);
	});

	it('supports a native form owner outside the custom element subtree', async () => {
		const form = document.createElement('form');

		form.id = 'external-form';

		const host = document.createElement('alt-textarea') as AltTextareaElementApi;

		host.setAttribute('form', form.id);

		host.setAttribute('name', 'external-notes');

		host.setAttribute('value', 'Owned by form id');

		document.body.append(form, host);

		await updateComplete();

		expect(host.form).toBe(form);

		expect(new FormData(form).get('external-notes')).toBe('Owned by form id');
	});

	it('restores the default value when its form resets', async () => {
		const form = document.createElement('form');

		form.innerHTML = '<alt-textarea name="notes" value="Default"></alt-textarea>';

		document.body.append(form);

		await updateComplete();

		const host = form.firstElementChild as AltTextareaElementApi;

		host.value = 'Changed';

		form.reset();

		await updateComplete();

		expect(host.value).toBe('Default');

		expect(new FormData(form).get('notes')).toBe('Default');
	});

	it('preserves a property assigned before custom element upgrade', async () => {
		const tagName = 'alt-textarea-pre-upgrade';

		const host = document.createElement(tagName) as AltTextareaElementApi;

		host.value = 'Before definition';

		document.body.append(host);

		customElements.define(tagName, createAltTextareaElementClass(HTMLElement));

		await updateComplete();

		expect(host.value).toBe('Before definition');

		expect(host.textareaElement?.value).toBe('Before definition');
	});

	it('hydrates matching server light DOM without replacing it', async () => {
		const tagName = 'alt-textarea-server';

		const host = document.createElement(tagName) as AltTextareaElementApi;

		host.innerHTML = `
			<label class="alt-textarea__root" data-alt-owned="textarea">
				<span class="alt-textarea__label"></span>
				<span class="alt-textarea__content"><textarea class="alt-textarea__field"></textarea>
				<span class="alt-textarea__description"></span></span>
			</label>
			<div class="alt-textarea__footer"><span class="alt-textarea__helper"></span>
			<span class="alt-textarea__counter"></span></div>
		`;

		const serverRoot = host.firstElementChild;

		document.body.append(host);

		customElements.define(tagName, createAltTextareaElementClass(HTMLElement));

		await updateComplete();

		expect(host.firstElementChild).toBe(serverRoot);

		expect(host.textareaElement).toBe(serverRoot?.querySelector('textarea'));
	});
});
