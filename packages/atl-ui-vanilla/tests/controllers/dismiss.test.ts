import { beforeEach, describe, expect, it, vi } from 'vitest';

import { bindOverlayDismiss } from '../../src/controllers/dismiss';

const pointerDown = (target: Element): void => {
	target.dispatchEvent(
		new MouseEvent('pointerdown', {
			bubbles: true,
			composed: true,
		}),
	);
};

describe('bindOverlayDismiss', () => {
	beforeEach(() => {
		document.body.replaceChildren();
	});

	it('dismisses on Escape and pointer press outside its boundaries', () => {
		const overlay = document.createElement('div');
		const trigger = document.createElement('button');
		const child = document.createElement('span');
		const outside = document.createElement('div');
		overlay.append(child);
		document.body.append(trigger, overlay, outside);
		const onDismiss = vi.fn();
		const cleanup = bindOverlayDismiss({
			ignore: [trigger],
			onDismiss,
			overlay,
		});

		pointerDown(child);
		pointerDown(trigger);
		expect(onDismiss).not.toHaveBeenCalled();

		pointerDown(outside);
		document.dispatchEvent(
			new KeyboardEvent('keydown', {
				key: 'Escape',
			}),
		);
		expect(onDismiss.mock.calls.map(([detail]) => detail.reason)).toEqual(['outside-pointer', 'escape']);
		cleanup();
	});

	it('ignores prevented events and composing Escape presses', () => {
		const overlay = document.createElement('div');
		document.body.append(overlay);
		const onDismiss = vi.fn();
		const cleanup = bindOverlayDismiss({
			onDismiss,
			overlay,
		});
		const pointerEvent = new MouseEvent('pointerdown', {
			bubbles: true,
			cancelable: true,
		});
		pointerEvent.preventDefault();
		document.body.dispatchEvent(pointerEvent);
		document.dispatchEvent(
			new KeyboardEvent('keydown', {
				isComposing: true,
				key: 'Escape',
			}),
		);

		expect(onDismiss).not.toHaveBeenCalled();
		cleanup();
	});

	it('removes listeners on abort and explicit cleanup', () => {
		const overlay = document.createElement('div');
		const outside = document.createElement('div');
		document.body.append(overlay, outside);
		const onDismiss = vi.fn();
		const controller = new AbortController();
		const cleanup = bindOverlayDismiss({
			onDismiss,
			overlay,
			signal: controller.signal,
		});

		controller.abort();
		pointerDown(outside);
		document.dispatchEvent(
			new KeyboardEvent('keydown', {
				key: 'Escape',
			}),
		);
		cleanup();
		expect(onDismiss).not.toHaveBeenCalled();
	});
});
