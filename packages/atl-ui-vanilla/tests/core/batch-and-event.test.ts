import { describe, expect, it, vi } from 'vitest';

import { createMicrotaskBatch, createTypedEvent } from '../../src/core';

describe('microtask batching', () => {
	it('runs once per microtask and allows a later batch', async () => {
		const callback = vi.fn();
		const enqueue = createMicrotaskBatch(callback);

		enqueue();
		enqueue();
		enqueue();
		expect(callback).not.toHaveBeenCalled();

		await Promise.resolve();
		expect(callback).toHaveBeenCalledTimes(1);

		enqueue();
		await Promise.resolve();
		expect(callback).toHaveBeenCalledTimes(2);
	});
});

describe('typed custom events', () => {
	it('creates bubbling and composed events with typed detail', () => {
		const event = createTypedEvent('alt-change', { value: 'one' });

		expect(event.detail.value).toBe('one');
		expect(event.bubbles).toBe(true);
		expect(event.composed).toBe(true);
		expect(event.cancelable).toBe(false);
	});

	it('allows event flags to be overridden', () => {
		const event = createTypedEvent('alt-before-close', undefined, {
			bubbles: false,
			cancelable: true,
		});

		expect(event.bubbles).toBe(false);
		expect(event.cancelable).toBe(true);
	});
});
