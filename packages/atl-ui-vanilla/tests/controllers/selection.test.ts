import { describe, expect, it } from 'vitest';

import { SelectionController } from '../../src/controllers/selection';

describe('SelectionController', () => {
	it('keeps one value in single mode', () => {
		const selection = new SelectionController('single', ['one', 'two']);

		expect(selection.value).toBe('one');
		expect(selection.values).toEqual(['one']);
		expect(selection.select('two')).toBe(true);
		expect(selection.values).toEqual(['two']);
		expect(selection.select('two')).toBe(false);
	});

	it('toggles multiple unique values without exposing mutable state', () => {
		const selection = new SelectionController('multiple', ['one', 'one']);
		const snapshot = selection.values as string[];

		snapshot.push('external');
		expect(selection.toggle('two')).toBe(true);
		expect(selection.values).toEqual(['one', 'two']);
		expect(selection.toggle('one')).toBe(true);
		expect(selection.values).toEqual(['two']);
	});

	it('reports no change for equivalent state and missing values', () => {
		const selection = new SelectionController('multiple', ['one', 'two']);

		expect(selection.set(['one', 'two', 'two'])).toBe(false);
		expect(selection.deselect('missing')).toBe(false);
		expect(selection.clear()).toBe(true);
		expect(selection.clear()).toBe(false);
	});
});
