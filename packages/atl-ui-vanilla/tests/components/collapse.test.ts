import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { createAltCollapseElementClass } from '../../src/components/collapse';
import type { AltCollapseElementApi } from '../../src/components/collapse/types';

const TAG_NAME = 'alt-collapse-test';

beforeAll(() => {
	if (!customElements.get(TAG_NAME))
		customElements.define(TAG_NAME, createAltCollapseElementClass(window.HTMLElement));
});

beforeEach(() => document.body.replaceChildren());

describe('alt-collapse', () => {
	it('keeps authored details and enforces single-panel mode', async () => {
		document.body.innerHTML = `<${TAG_NAME} single><details data-key="one" open><summary>One</summary></details><details data-key="two"><summary>Two</summary></details></${TAG_NAME}>`;

		await Promise.resolve();

		const collapse = document.querySelector(TAG_NAME) as AltCollapseElementApi;

		const details = collapse.querySelectorAll('details');

		const changed = vi.fn();

		expect(details[0].querySelector('[data-alt-icon="minus"]')).toBeInstanceOf(SVGSVGElement);

		expect(details[1].querySelector('[data-alt-icon="plus"]')).toBeInstanceOf(SVGSVGElement);

		collapse.addEventListener('alt-change', changed);

		details[1].open = true;

		details[1].dispatchEvent(new Event('toggle'));

		expect(details[0].open).toBe(false);

		expect(details[0].querySelector('[data-alt-icon="plus"]')).toBeInstanceOf(SVGSVGElement);

		expect(details[1].querySelector('[data-alt-icon="minus"]')).toBeInstanceOf(SVGSVGElement);

		expect(collapse.openKeys).toEqual(['two']);

		expect(changed).toHaveBeenCalled();
	});

	it('toggles from the authored summary without moving its content', async () => {
		document.body.innerHTML = `<${TAG_NAME}><details data-key="one"><summary>One</summary><p>Content</p></details></${TAG_NAME}>`;

		await Promise.resolve();

		const collapse = document.querySelector(TAG_NAME) as AltCollapseElementApi;

		const details = collapse.querySelector('details') as HTMLDetailsElement;

		const content = details.querySelector('p') as HTMLParagraphElement;

		details.querySelector('summary')?.click();

		expect(details.open).toBe(true);

		expect(content.parentElement).toBe(details);

		expect(details.querySelector('[data-alt-icon="minus"]')).toBeInstanceOf(SVGSVGElement);
	});
});
