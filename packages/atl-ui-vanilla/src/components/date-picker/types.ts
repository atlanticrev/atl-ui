import type { AltCalendarPreset, AltCalendarRange } from '../calendar';

export type AltDatePickerChangeDetail = {
	range: AltCalendarRange;
	value: string | null;
};

export type AltDatePickerElementApi = HTMLElement & {
	disabledDate: ((value: string) => boolean) | null;
	open: boolean;
	presets: readonly AltCalendarPreset[];
	value: string | null;
};

export type AltDateRangePickerElementApi = Omit<AltDatePickerElementApi, 'value'> & {
	end: string | null;
	start: string | null;
};
