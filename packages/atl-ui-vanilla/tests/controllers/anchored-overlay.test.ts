import { beforeEach, describe, expect, it, vi } from 'vitest';

import { bindAnchoredOverlay } from '../../src/controllers/anchored-overlay';
import { bindOverlayLayer } from '../../src/controllers/overlay-layer';

beforeEach(() => {
	document.body.replaceChildren();
});

describe('overlay layer', () => {
	it('uses the Popover API without moving the overlay', () => {
		const host = document.createElement('div');

		const overlay = document.createElement('div') as HTMLDivElement & {
			togglePopover: (force?: boolean) => boolean;
		};

		const togglePopover = vi.fn(() => true);

		Object.defineProperty(overlay, 'togglePopover', { configurable: true, value: togglePopover });

		host.append(overlay);

		document.body.append(host);

		const cleanup = bindOverlayLayer(overlay);

		expect(overlay.parentElement).toBe(host);

		expect(overlay.hidden).toBe(false);

		expect(overlay.getAttribute('popover')).toBe('manual');

		expect(togglePopover).toHaveBeenCalledWith(true);

		cleanup();

		expect(togglePopover).toHaveBeenLastCalledWith(false);

		expect(overlay.hidden).toBe(true);
	});

	it('portals to document.body as a fallback and restores the exact DOM position', () => {
		const host = document.createElement('div');

		const overlay = document.createElement('div');

		const sibling = document.createElement('span');

		host.style.setProperty('--alt-test-surface', 'rgb(10, 20, 30)');

		host.append(overlay, sibling);

		document.body.append(host);

		const cleanup = bindOverlayLayer(overlay);

		expect(overlay.parentElement).toBe(document.body);

		expect(overlay.hidden).toBe(false);

		expect(getComputedStyle(overlay).getPropertyValue('--alt-test-surface')).toBe('rgb(10, 20, 30)');

		cleanup();

		expect(overlay.parentElement).toBe(host);

		expect(overlay.nextSibling).toBe(sibling);

		expect(overlay.hidden).toBe(true);

		expect(overlay.style.getPropertyValue('--alt-test-surface')).toBe('');

		expect(() => cleanup()).not.toThrow();
	});

	it('restores a fallback portal when the connection signal aborts', () => {
		const host = document.createElement('div');

		const overlay = document.createElement('div');

		const controller = new AbortController();

		host.append(overlay);

		document.body.append(host);

		bindOverlayLayer(overlay, controller.signal);

		expect(overlay.parentElement).toBe(document.body);

		controller.abort();

		expect(overlay.parentElement).toBe(host);

		expect(overlay.hidden).toBe(true);
	});
});

describe('anchored overlay', () => {
	it('combines layer, positioning and dismissal while restoring styles', () => {
		const anchor = document.createElement('button');

		const overlay = document.createElement('div') as HTMLDivElement & {
			togglePopover: (force?: boolean) => boolean;
		};

		const togglePopover = vi.fn(() => true);

		const onDismiss = vi.fn();

		Object.defineProperty(overlay, 'togglePopover', { configurable: true, value: togglePopover });

		anchor.getBoundingClientRect = () => new DOMRect(20, 30, 100, 40);

		overlay.getBoundingClientRect = () => new DOMRect(0, 0, 80, 60);

		overlay.style.left = '1px';

		overlay.style.top = '2px';

		document.body.append(anchor, overlay);

		const cleanup = bindAnchoredOverlay({
			anchor,
			matchAnchorWidth: true,
			onDismiss,
			overlay,
		});

		expect(overlay.style.left).toBe('20px');

		expect(overlay.style.minWidth).toBe('100px');

		expect(overlay.style.top).toBe('74px');

		document.dispatchEvent(new Event('pointerdown'));

		expect(onDismiss).toHaveBeenCalledWith(expect.objectContaining({ reason: 'outside-pointer' }));

		cleanup();

		expect(overlay.style.left).toBe('1px');

		expect(overlay.style.minWidth).toBe('');

		expect(overlay.style.top).toBe('2px');

		expect(togglePopover).toHaveBeenLastCalledWith(false);
	});
});
