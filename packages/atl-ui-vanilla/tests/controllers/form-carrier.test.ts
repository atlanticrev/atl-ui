import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
	bindFormReset,
	configureSelectCarrier,
	createSelectCarrier,
	setSelectCarrierValues,
} from '../../src/controllers/form-carrier';

describe('select form carrier', () => {
	beforeEach(() => {
		document.body.replaceChildren();
	});

	it('submits one value through a native form', () => {
		const form = document.createElement('form');
		const carrier = createSelectCarrier(document, {
			name: 'account',
		});
		form.append(carrier);
		document.body.append(form);
		setSelectCarrierValues(carrier, ['one', 'two']);

		expect(new FormData(form).getAll('account')).toEqual(['one']);
		expect(carrier.hidden).toBe(true);
		expect(carrier.tabIndex).toBe(-1);
	});

	it('submits unique multiple values and clears stale options', () => {
		const form = document.createElement('form');
		const carrier = createSelectCarrier(document, {
			multiple: true,
			name: 'platform',
		});
		form.append(carrier);
		document.body.append(form);
		setSelectCarrierValues(carrier, ['youtube', 'youtube', 'tiktok']);

		expect(new FormData(form).getAll('platform')).toEqual(['youtube', 'tiktok']);
		setSelectCarrierValues(carrier, []);
		expect(new FormData(form).getAll('platform')).toEqual([]);
		expect(carrier.options).toHaveLength(0);
	});

	it('updates native form attributes', () => {
		const carrier = createSelectCarrier(document, {
			disabled: true,
			form: 'filters',
			multiple: true,
			name: 'status',
			required: true,
		});

		expect(carrier.getAttribute('form')).toBe('filters');
		configureSelectCarrier(carrier, {});
		expect(carrier.disabled).toBe(false);
		expect(carrier.multiple).toBe(false);
		expect(carrier.name).toBe('');
		expect(carrier.required).toBe(false);
		expect(carrier.hasAttribute('form')).toBe(false);
	});

	it('binds reset to the associated form and removes it on abort', () => {
		const form = document.createElement('form');
		const carrier = createSelectCarrier(document);
		form.append(carrier);
		document.body.append(form);
		const onReset = vi.fn();
		const controller = new AbortController();
		bindFormReset(carrier, onReset, controller.signal);

		form.reset();
		expect(onReset).toHaveBeenCalledOnce();
		controller.abort();
		form.reset();
		expect(onReset).toHaveBeenCalledOnce();
	});

	it('does not bind without a form or with an aborted signal', () => {
		const carrier = createSelectCarrier(document);
		const onReset = vi.fn();
		const controller = new AbortController();
		controller.abort();

		bindFormReset(carrier, onReset, controller.signal)();
		expect(onReset).not.toHaveBeenCalled();
	});
});
