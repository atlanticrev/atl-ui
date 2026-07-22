import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { createAltAlertElementClass } from '../../src/components/alert';
import type { AltAlertCloseDetail, AltAlertElementApi } from '../../src/components/alert/types';

const TAG_NAME = 'alt-alert-test';

beforeAll(() => {
	if (!customElements.get(TAG_NAME)) {
		customElements.define(TAG_NAME, createAltAlertElementClass(window.HTMLElement));
	}
});

beforeEach(() => {
	document.body.replaceChildren();
});

const createAlert = async (markup = 'Publication completed.'): Promise<AltAlertElementApi> => {
	const alert = document.createElement(TAG_NAME) as AltAlertElementApi;

	alert.innerHTML = markup;

	document.body.append(alert);

	await Promise.resolve();

	return alert;
};

describe('alt-alert', () => {
	it('renders accessible default status and preserves authored message content', async () => {
		const alert = await createAlert('<strong class="alt-alert__title">Success</strong> Saved.');

		expect(alert.getAttribute('role')).toBe('alert');

		expect(alert.dataset.severity).toBe('success');

		expect(alert.dataset.color).toBe('success');

		expect(alert.dataset.variant).toBe('standard');

		expect(alert.messageElement?.textContent).toContain('Success Saved.');

		expect(alert.querySelector('.alt-alert__icon [data-alt-icon="check"]')).not.toBeNull();
	});

	it('supports severity, independent color and filled or outlined variants', async () => {
		const alert = await createAlert();

		alert.severity = 'error';

		alert.color = 'warning';

		alert.variant = 'filled';

		await Promise.resolve();

		expect(alert.dataset.severity).toBe('error');

		expect(alert.dataset.color).toBe('warning');

		expect(alert.dataset.variant).toBe('filled');

		expect(alert.querySelector('.alt-alert__icon [data-alt-icon="error"]')).not.toBeNull();
	});

	it('accepts arbitrary authored icon and action content without cloning', async () => {
		const alert = await createAlert(`
			<span data-alt-alert-icon>!</span>
			Message
			<button data-alt-alert-action type="button">Undo</button>
		`);

		const icon = alert.querySelector('[data-alt-alert-icon]');

		const action = alert.querySelector('[data-alt-alert-action]');

		expect(alert.querySelector('.alt-alert__icon')?.firstElementChild).toBe(icon);

		expect(alert.actionElement?.firstElementChild).toBe(action);

		expect(alert.querySelector<HTMLButtonElement>('.alt-alert__close')?.hidden).toBe(true);
	});

	it('uses icon properties and severity mappings with null meaning no icon', async () => {
		const alert = await createAlert();

		const mappedIcon = document.createElement('span');

		mappedIcon.textContent = 'mapped';

		alert.iconMapping = { warning: mappedIcon };

		alert.severity = 'warning';

		await Promise.resolve();

		expect(alert.querySelector('.alt-alert__icon')?.firstChild).toBe(mappedIcon);

		alert.icon = null;

		alert.iconMapping = null;

		await Promise.resolve();

		expect(alert.querySelector<HTMLElement>('.alt-alert__icon')?.hidden).toBe(true);
	});

	it('emits a cancelable close request and hides only when accepted', async () => {
		const alert = await createAlert();

		const preventClose = (event: Event): void => event.preventDefault();

		alert.dismissible = true;

		alert.addEventListener('alt-close', preventClose);

		await Promise.resolve();

		alert.querySelector<HTMLButtonElement>('.alt-alert__close')?.click();

		expect(alert.hidden).toBe(false);

		alert.removeEventListener('alt-close', preventClose);

		const onClose = vi.fn();

		alert.addEventListener('alt-close', onClose as unknown as EventListener);

		alert.querySelector<HTMLButtonElement>('.alt-alert__close')?.click();

		expect(alert.hidden).toBe(true);

		const closeEvent = onClose.mock.calls[0][0] as CustomEvent<AltAlertCloseDetail>;

		expect(closeEvent.detail.reason).toBe('close-button');

		expect(closeEvent.detail.sourceEvent).toBeInstanceOf(MouseEvent);

		alert.show();

		expect(alert.hidden).toBe(false);
	});

	it('preserves an explicitly authored less urgent live-region role', async () => {
		const alert = document.createElement(TAG_NAME) as AltAlertElementApi;

		alert.setAttribute('role', 'status');

		document.body.append(alert);

		await Promise.resolve();

		expect(alert.getAttribute('role')).toBe('status');
	});
});
