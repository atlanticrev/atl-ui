import { afterEach, describe, expect, it } from 'vitest';

import { createBaseElementClass } from '../../src/core';

const TEST_EVENT = 'alt-core-lifecycle-event';
const TEST_TAG = 'alt-core-lifecycle-test';
const BaseElement = createBaseElementClass();

class LifecycleElement extends BaseElement {
	public cleanupCount = 0;
	public connectionCount = 0;
	public eventCount = 0;
	public signals: AbortSignal[] = [];
	public updateCount = 0;

	public override onConnected(signal: AbortSignal): void {
		this.connectionCount += 1;
		this.signals.push(signal);
		window.addEventListener(TEST_EVENT, this.handleTestEvent, { signal });
		signal.addEventListener('abort', this.handleCleanup, { once: true });
	}

	public override update(): void {
		this.updateCount += 1;
	}

	private readonly handleCleanup = (): void => {
		this.cleanupCount += 1;
	};

	private readonly handleTestEvent = (): void => {
		this.eventCount += 1;
	};
}

customElements.define(TEST_TAG, LifecycleElement);

afterEach(() => {
	document.body.replaceChildren();
});

describe('base element lifecycle', () => {
	it('aborts connection work and starts cleanly after reconnecting', () => {
		const element = document.createElement(TEST_TAG) as LifecycleElement;

		document.body.append(element);
		window.dispatchEvent(new Event(TEST_EVENT));
		element.remove();
		window.dispatchEvent(new Event(TEST_EVENT));

		expect(element.connectionCount).toBe(1);
		expect(element.cleanupCount).toBe(1);
		expect(element.eventCount).toBe(1);
		expect(element.signals[0]?.aborted).toBe(true);

		document.body.append(element);
		window.dispatchEvent(new Event(TEST_EVENT));

		expect(element.connectionCount).toBe(2);
		expect(element.eventCount).toBe(2);
		expect(element.signals[1]?.aborted).toBe(false);
	});

	it('batches updates and skips them while disconnected', async () => {
		const element = document.createElement(TEST_TAG) as LifecycleElement;

		document.body.append(element);
		element.requestUpdate();
		element.requestUpdate();
		await Promise.resolve();

		expect(element.updateCount).toBe(1);

		element.requestUpdate();
		element.requestUpdate();
		await Promise.resolve();

		expect(element.updateCount).toBe(2);

		element.remove();
		element.requestUpdate();
		await Promise.resolve();

		expect(element.updateCount).toBe(2);
	});
});
