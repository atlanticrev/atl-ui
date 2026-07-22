export type AltCalendarSelectionMode = 'range' | 'single';
export type AltCalendarView = 'days' | 'months' | 'years';

export type AltCalendarRange = {
	end: string | null;
	start: string | null;
};

export type AltCalendarChangeDetail = {
	complete: boolean;
	mode: AltCalendarSelectionMode;
	range: AltCalendarRange;
	value: string | null;
};

export type AltCalendarPreset = {
	end?: string;
	label: string;
	start: string;
};

export type AltCalendarElementApi = HTMLElement & {
	disabledDate: ((value: string) => boolean) | null;
	presets: readonly AltCalendarPreset[];
	selectionMode: AltCalendarSelectionMode;
	value: string | null;
};
