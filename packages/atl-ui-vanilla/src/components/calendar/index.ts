import { type ElementEnvironment, registerElement } from '../../core';

import { createAltCalendarElementClass } from './calendar-element';

export { createAltCalendarElementClass } from './calendar-element';
export { addDays, addMonths, addYears, formatDateValue, parseDateValue } from './date-value';
export type {
	AltCalendarChangeDetail,
	AltCalendarElementApi,
	AltCalendarPreset,
	AltCalendarRange,
	AltCalendarSelectionMode,
	AltCalendarView,
} from './types';

export const defineAltCalendar = (environment?: ElementEnvironment): CustomElementConstructor | undefined => {
	return registerElement('alt-calendar', createAltCalendarElementClass, environment);
};
