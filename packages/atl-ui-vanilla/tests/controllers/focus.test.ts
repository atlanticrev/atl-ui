import { beforeEach, describe, expect, it } from 'vitest';

import { captureFocus, getFocusableElements, moveFocus } from '../../src/controllers/focus';

describe('focus controller', () => {
	beforeEach(() => {
		document.body.replaceChildren();
	});

	it('returns only available focus targets', () => {
		document.body.innerHTML = `
			<div id="root">
				<button id="first">First</button>
				<button disabled>Disabled</button>
				<fieldset disabled><input></fieldset>
				<div hidden><a href="/hidden">Hidden</a></div>
				<div aria-hidden="true"><input></div>
				<a id="last" href="/next">Last</a>
			</div>
		`;
		const root = document.querySelector('#root');

		expect(getFocusableElements(root as HTMLElement).map((element) => element.id)).toEqual(['first', 'last']);
	});

	it('moves focus and wraps at either boundary', () => {
		document.body.innerHTML = '<div id="root"><button id="one"></button><button id="two"></button></div>';
		const root = document.querySelector('#root') as HTMLElement;
		const one = document.querySelector('#one') as HTMLElement;
		const two = document.querySelector('#two') as HTMLElement;

		expect(moveFocus(root, one, 'previous')).toBe(two);
		expect(document.activeElement).toBe(two);
		expect(
			moveFocus(root, two, 'next', {
				wrap: false,
			}),
		).toBe(two);
		expect(moveFocus(root, two, 'first')).toBe(one);
	});

	it('returns null when there is no focus target', () => {
		const root = document.createElement('div');
		expect(moveFocus(root, null, 'next')).toBeNull();
	});

	it('restores captured focus while the element is connected', () => {
		const trigger = document.createElement('button');
		const overlayButton = document.createElement('button');
		document.body.append(trigger, overlayButton);
		trigger.focus();
		const restorer = captureFocus(document);
		overlayButton.focus();

		expect(restorer.restore()).toBe(true);
		expect(document.activeElement).toBe(trigger);

		trigger.remove();
		expect(restorer.restore()).toBe(false);
	});
});
