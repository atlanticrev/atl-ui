import { type ElementEnvironment, registerElement } from '../../core';

import { createAltDatePickerElementClass, createAltDateRangePickerElementClass } from './date-picker-element';

export { createAltDatePickerElementClass, createAltDateRangePickerElementClass } from './date-picker-element';
export type { AltDatePickerChangeDetail, AltDatePickerElementApi, AltDateRangePickerElementApi } from './types';

export const defineAltDatePicker = (environment?: ElementEnvironment): CustomElementConstructor | undefined => {
	return registerElement('alt-date-picker', createAltDatePickerElementClass, environment);
};

export const defineAltDateRangePicker = (environment?: ElementEnvironment): CustomElementConstructor | undefined => {
	return registerElement('alt-date-range-picker', createAltDateRangePickerElementClass, environment);
};
