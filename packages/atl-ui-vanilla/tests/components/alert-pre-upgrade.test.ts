import { describe, expect, it } from 'vitest';

import { createAltAlertElementClass } from '../../src/components/alert';
import type { AltAlertElementApi } from '../../src/components/alert/types';

describe('alt-alert upgrade', () => {
	it('preserves properties assigned before definition', async () => {
		const tagName = 'alt-alert-pre-upgrade-test';
		const alert = document.createElement(tagName) as AltAlertElementApi;
		const icon = document.createElement('span');
		const action = document.createElement('button');
		alert.icon = icon;
		alert.action = action;
		alert.severity = 'warning';
		alert.variant = 'outlined';
		alert.textContent = 'Review the schedule.';
		document.body.append(alert);
		customElements.define(tagName, createAltAlertElementClass(window.HTMLElement));
		await Promise.resolve();

		expect(alert.icon).toBe(icon);
		expect(alert.action).toBe(action);
		expect(alert.querySelector('.alt-alert__icon')?.firstChild).toBe(icon);
		expect(alert.actionElement?.firstChild).toBe(action);
		expect(alert.dataset.severity).toBe('warning');
		expect(alert.dataset.variant).toBe('outlined');
	});
});
