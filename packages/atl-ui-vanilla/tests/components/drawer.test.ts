import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { createAltDrawerElementClass } from '../../src/components/drawer';
import type { AltDrawerElementApi } from '../../src/components/drawer/types';

const TAG_NAME = 'alt-drawer-test';

beforeAll(() => {
	if (!customElements.get(TAG_NAME)) {
		customElements.define(TAG_NAME, createAltDrawerElementClass(window.HTMLElement));
	}
});

beforeEach(() => {
	document.body.replaceChildren();

	vi.stubGlobal(
		'matchMedia',
		vi.fn(() => ({ matches: true })),
	);

	vi.stubGlobal(
		'requestAnimationFrame',
		vi.fn((callback: FrameRequestCallback) => {
			queueMicrotask(() => callback(0));

			return 1;
		}),
	);
});

const stubNativeDialog = (dialog: HTMLDialogElement): void => {
	dialog.showModal = (): void => {
		dialog.setAttribute('open', '');
	};

	dialog.close = (returnValue = ''): void => {
		dialog.returnValue = returnValue;

		dialog.removeAttribute('open');

		dialog.dispatchEvent(new Event('close'));
	};
};

const flushMotion = async (): Promise<void> => {
	await Promise.resolve();

	await Promise.resolve();

	await Promise.resolve();
};

describe('alt-drawer', () => {
	it('preserves authored content and closes through an authored action', async () => {
		const host = document.createElement(TAG_NAME) as AltDrawerElementApi;

		const closeButton = document.createElement('button');

		const onClose = vi.fn();

		host.label = 'Navigation';

		host.placement = 'right';

		closeButton.dataset.altDrawerClose = 'selected';

		host.append(closeButton);

		host.addEventListener('alt-close', onClose);

		document.body.append(host);

		await Promise.resolve();

		const dialog = host.dialogElement;

		if (!dialog) throw new Error('Missing native dialog');

		stubNativeDialog(dialog);

		host.showModal();

		await flushMotion();

		expect(dialog.open).toBe(true);

		expect(dialog.dataset.placement).toBe('right');

		expect(dialog.getAttribute('aria-label')).toBe('Navigation');

		expect(dialog.contains(closeButton)).toBe(true);

		closeButton.click();

		await flushMotion();

		expect(host.open).toBe(false);

		expect(onClose.mock.calls[0][0].detail).toEqual({ reason: 'action', returnValue: 'selected' });
	});

	it('animates Escape dismissal and can make it strict', async () => {
		const host = document.createElement(TAG_NAME) as AltDrawerElementApi;

		document.body.append(host);

		await Promise.resolve();

		const dialog = host.dialogElement;

		if (!dialog) throw new Error('Missing native dialog');

		stubNativeDialog(dialog);

		host.showModal();

		await flushMotion();

		host.closeOnEscape = false;

		const blocked = new Event('cancel', { cancelable: true });

		dialog.dispatchEvent(blocked);

		expect(blocked.defaultPrevented).toBe(true);

		expect(dialog.open).toBe(true);

		host.closeOnEscape = true;

		const allowed = new Event('cancel', { cancelable: true });

		dialog.dispatchEvent(allowed);

		await flushMotion();

		expect(allowed.defaultPrevented).toBe(true);

		expect(host.open).toBe(false);
	});
});
