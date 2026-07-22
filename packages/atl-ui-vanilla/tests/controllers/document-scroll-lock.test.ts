import { beforeEach, describe, expect, it } from 'vitest';

import { lockDocumentScroll } from '../../src/controllers/document-scroll-lock';

beforeEach(() => {
	document.documentElement.removeAttribute('style');

	document.body.removeAttribute('style');
});

describe('document scroll lock', () => {
	it('locks nested modal lifecycles and restores authored inline styles exactly', () => {
		document.documentElement.style.overflow = 'scroll';

		document.body.style.overscrollBehavior = 'contain';

		const releaseFirst = lockDocumentScroll(document);

		const releaseSecond = lockDocumentScroll(document);

		expect(document.documentElement.style.getPropertyValue('overflow')).toBe('hidden');

		expect(document.documentElement.style.getPropertyPriority('overflow')).toBe('important');

		expect(document.body.style.getPropertyValue('overscroll-behavior')).toBe('none');

		releaseFirst();

		expect(document.documentElement.style.getPropertyValue('overflow')).toBe('hidden');

		releaseSecond();

		expect(document.documentElement.style.overflow).toBe('scroll');

		expect(document.documentElement.style.overscrollBehavior).toBe('');

		expect(document.body.style.overflow).toBe('');

		expect(document.body.style.overscrollBehavior).toBe('contain');

		expect(() => releaseSecond()).not.toThrow();
	});
});
