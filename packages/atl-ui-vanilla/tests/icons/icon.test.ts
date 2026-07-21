import { describe, expect, it } from 'vitest';

import { altIconMarkup, createAltIcon, setAltIcon, syncAltIconContent } from '../../src/icons';

describe('SVG icons', () => {
	it('creates decorative SVG nodes without text glyphs', () => {
		const icon = createAltIcon(document, 'chevron-down', { size: 18 });

		expect(icon.namespaceURI).toBe('http://www.w3.org/2000/svg');
		expect(icon.dataset.altIcon).toBe('chevron-down');
		expect(icon.getAttribute('aria-hidden')).toBe('true');
		expect(icon.getAttribute('focusable')).toBe('false');
		expect(icon.getAttribute('width')).toBe('18');
		expect(icon.querySelectorAll('path').length).toBeGreaterThan(0);
		expect(icon.textContent).toBe('');
	});

	it('updates an icon container without duplicating SVG nodes', () => {
		const container = document.createElement('span');
		setAltIcon(container, 'info');
		const original = container.firstElementChild;
		setAltIcon(container, 'info');
		expect(container.firstElementChild).toBe(original);

		setAltIcon(container, 'error');
		expect(container.querySelectorAll('svg')).toHaveLength(1);
		expect(container.firstElementChild?.getAttribute('data-alt-icon')).toBe('error');
	});

	it('renders SSR-safe SVG markup', () => {
		const markup = altIconMarkup('close', 16);
		expect(markup).toContain('<svg');
		expect(markup).toContain('data-alt-icon="close"');
		expect(markup).toContain('width="16"');
		expect(markup).not.toContain('×');
	});

	it('supports fallback, replacement and explicit hiding', () => {
		const container = document.createElement('span');
		const custom = document.createElement('span');
		syncAltIconContent(container, undefined, 'info');
		expect(container.querySelector('[data-alt-icon="info"]')).toBeInstanceOf(SVGSVGElement);
		syncAltIconContent(container, custom, 'info');
		expect(container.firstChild).toBe(custom);
		syncAltIconContent(container, null, 'info');
		expect(container.childNodes).toHaveLength(0);
	});
});
