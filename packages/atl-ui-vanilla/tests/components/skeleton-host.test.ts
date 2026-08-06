import { describe, expect, it } from 'vitest';

import { setAltSkeletonHostLoading } from '../../src/components/skeleton';

const createHost = (): { content: HTMLDivElement; host: HTMLElement } => {
	const host = document.createElement('section');

	const content = document.createElement('div');

	host.className = 'alt-skeleton-host';

	content.className = 'alt-skeleton-host__content';

	content.innerHTML = '<button type="button">Review</button>';

	host.append(content);

	return { content, host };
};

describe('Skeleton Host', () => {
	it('keeps authored content and synchronizes the loading accessibility state', () => {
		const { content, host } = createHost();

		const button = content.querySelector('button');

		setAltSkeletonHostLoading(host, true);

		expect(host.getAttribute('aria-busy')).toBe('true');

		expect(content.getAttribute('aria-hidden')).toBe('true');

		expect(content.hasAttribute('inert')).toBe(true);

		expect(content.querySelector('button')).toBe(button);

		setAltSkeletonHostLoading(host, false);

		expect(host.getAttribute('aria-busy')).toBe('false');

		expect(content.hasAttribute('aria-hidden')).toBe(false);

		expect(content.hasAttribute('inert')).toBe(false);

		expect(content.querySelector('button')).toBe(button);
	});

	it('is idempotent', () => {
		const { content, host } = createHost();

		setAltSkeletonHostLoading(host, true);

		setAltSkeletonHostLoading(host, true);

		expect(host.getAttribute('aria-busy')).toBe('true');

		expect(content.hasAttribute('inert')).toBe(true);

		setAltSkeletonHostLoading(host, false);

		setAltSkeletonHostLoading(host, false);

		expect(host.getAttribute('aria-busy')).toBe('false');

		expect(content.hasAttribute('inert')).toBe(false);
	});

	it('rejects hosts without the public class', () => {
		const { host } = createHost();

		host.className = '';

		expect(() => setAltSkeletonHostLoading(host, true)).toThrowError(
			'Skeleton host must have the alt-skeleton-host class.',
		);
	});

	it('rejects missing or ambiguous direct content roots', () => {
		const { content, host } = createHost();

		content.remove();

		expect(() => setAltSkeletonHostLoading(host, true)).toThrowError('must contain exactly one direct');

		host.append(content, content.cloneNode(true));

		expect(() => setAltSkeletonHostLoading(host, true)).toThrowError('must contain exactly one direct');
	});
});
