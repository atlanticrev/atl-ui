import { describe, expect, it } from 'vitest';

import { booleanAttributeConverter, numberAttributeConverter, stringAttributeConverter } from '../../src/core';

describe('attribute converters', () => {
	it('converts boolean attributes by presence', () => {
		expect(booleanAttributeConverter.fromAttribute(null)).toBe(false);
		expect(booleanAttributeConverter.fromAttribute('')).toBe(true);
		expect(booleanAttributeConverter.fromAttribute('false')).toBe(true);
		expect(booleanAttributeConverter.toAttribute(false)).toBeNull();
		expect(booleanAttributeConverter.toAttribute(true)).toBe('');
	});

	it('converts only finite, non-empty number attributes', () => {
		expect(numberAttributeConverter.fromAttribute('12.5')).toBe(12.5);
		expect(numberAttributeConverter.fromAttribute(' 0 ')).toBe(0);
		expect(numberAttributeConverter.fromAttribute('')).toBeNull();
		expect(numberAttributeConverter.fromAttribute('invalid')).toBeNull();
		expect(numberAttributeConverter.fromAttribute('Infinity')).toBeNull();
		expect(numberAttributeConverter.toAttribute(3)).toBe('3');
		expect(numberAttributeConverter.toAttribute(Number.NaN)).toBeNull();
		expect(numberAttributeConverter.toAttribute(null)).toBeNull();
	});

	it('preserves nullable string attributes', () => {
		expect(stringAttributeConverter.fromAttribute(null)).toBeNull();
		expect(stringAttributeConverter.fromAttribute('')).toBe('');
		expect(stringAttributeConverter.toAttribute('value')).toBe('value');
		expect(stringAttributeConverter.toAttribute(null)).toBeNull();
	});
});
