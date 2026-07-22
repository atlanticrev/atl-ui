import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { createAltDialogElementClass } from '../../src/components/dialog';
import type { AltDialogElementApi } from '../../src/components/dialog/types';

const TAG_NAME = 'alt-dialog-test';

beforeAll(() => {
	if (!customElements.get(TAG_NAME)) {
		customElements.define(TAG_NAME, createAltDialogElementClass(window.HTMLElement));
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

describe('alt-dialog', () => {
	it('uses native dialog lifecycle and delegates close actions', async () => {
		const host = document.createElement(TAG_NAME) as AltDialogElementApi;

		const closeButton = document.createElement('button');

		const onClose = vi.fn();

		closeButton.dataset.altDialogClose = 'confirmed';

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

		expect(document.documentElement.style.overflow).toBe('hidden');

		closeButton.click();

		await flushMotion();

		expect(host.open).toBe(false);

		expect(dialog.open).toBe(false);

		expect(document.documentElement.style.overflow).toBe('');

		expect(onClose.mock.calls[0][0].detail.returnValue).toBe('confirmed');
	});
});
