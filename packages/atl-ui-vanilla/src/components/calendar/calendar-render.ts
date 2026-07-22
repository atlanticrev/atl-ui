import type { CalendarDom } from './calendar-dom';
import { dateLabel, monthLabel, monthNames, weekdayNames } from './calendar-labels';
import { addDays, formatDateValue, startOfMonthGrid } from './date-value';
import type { AltCalendarPreset, AltCalendarView } from './types';

export type CalendarRenderState = {
	cursor: Date;
	disabled: (value: string) => boolean;
	end: string | null;
	firstDay: number;
	locale: string;
	max: string | null;
	min: string | null;
	presets: readonly AltCalendarPreset[];
	start: string | null;
	value: string | null;
	view: AltCalendarView;
};

const createChoice = (document: Document, text: string, value: string): HTMLButtonElement => {
	const choice = document.createElement('button');

	choice.type = 'button';

	choice.className = 'alt-calendar__choice';

	choice.dataset.value = value;

	choice.textContent = text;

	return choice;
};

const syncSelection = (choice: HTMLButtonElement, value: string, state: CalendarRenderState): void => {
	const selected = value === state.value || value === state.start || value === state.end;

	const inRange = Boolean(state.start && state.end && value > state.start && value < state.end);

	choice.disabled = state.disabled(value);

	choice.dataset.inRange = String(inRange);

	choice.dataset.selected = String(selected);

	choice.setAttribute('aria-pressed', String(selected));
};

const renderDays = (dom: CalendarDom, state: CalendarRenderState): void => {
	dom.weekdays.replaceChildren(
		...weekdayNames(state.firstDay, state.locale).map((name) => {
			const label = dom.grid.ownerDocument.createElement('span');

			label.textContent = name;

			label.setAttribute('aria-hidden', 'true');

			return label;
		}),
	);

	const first = startOfMonthGrid(state.cursor, state.firstDay);

	const month = state.cursor.getUTCMonth();

	const choices = Array.from({ length: 42 }, (_, offset) => {
		const date = addDays(first, offset);

		const value = formatDateValue(date);

		const choice = createChoice(dom.grid.ownerDocument, String(date.getUTCDate()), value);

		choice.dataset.outside = String(date.getUTCMonth() !== month);

		choice.setAttribute('aria-label', dateLabel(date, state.locale));

		syncSelection(choice, value, state);

		return choice;
	});

	dom.grid.dataset.view = 'days';

	dom.grid.replaceChildren(...choices);

	dom.heading.textContent = monthLabel(state.cursor, state.locale);

	dom.grid.setAttribute('aria-label', dom.heading.textContent);
};

const renderMonths = (dom: CalendarDom, state: CalendarRenderState): void => {
	const year = state.cursor.getUTCFullYear();

	const choices = monthNames(year, state.locale).map((name, month) => {
		const value = `${year}-${String(month + 1).padStart(2, '0')}`;

		const choice = createChoice(dom.grid.ownerDocument, name, value);

		const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

		const firstValue = `${value}-01`;

		const lastValue = `${value}-${String(lastDay).padStart(2, '0')}`;

		choice.disabled = Boolean((state.min && lastValue < state.min) || (state.max && firstValue > state.max));

		return choice;
	});

	dom.weekdays.replaceChildren();

	dom.grid.dataset.view = 'months';

	dom.grid.replaceChildren(...choices);

	dom.heading.textContent = String(year);

	dom.grid.setAttribute('aria-label', `Choose month in ${year}`);
};

const renderYears = (dom: CalendarDom, state: CalendarRenderState): void => {
	const year = state.cursor.getUTCFullYear();

	const first = year - (year % 12);

	const choices = Array.from({ length: 12 }, (_, offset) => {
		const value = String(first + offset);

		const choice = createChoice(dom.grid.ownerDocument, value, value);

		choice.disabled = Boolean(
			(state.min && `${value}-12-31` < state.min) || (state.max && `${value}-01-01` > state.max),
		);

		return choice;
	});

	dom.weekdays.replaceChildren();

	dom.grid.dataset.view = 'years';

	dom.grid.replaceChildren(...choices);

	dom.heading.textContent = `${first}–${first + 11}`;

	dom.grid.setAttribute('aria-label', `Choose year from ${first} to ${first + 11}`);
};

export const renderCalendar = (dom: CalendarDom, state: CalendarRenderState, explicitCommit: boolean): void => {
	if (state.view === 'days') renderDays(dom, state);
	else if (state.view === 'months') renderMonths(dom, state);
	else renderYears(dom, state);

	dom.apply.hidden = !explicitCommit;

	dom.presets.replaceChildren(
		...state.presets.map((preset, index) => {
			const choice = createChoice(dom.grid.ownerDocument, preset.label, String(index));

			const label = dom.grid.ownerDocument.createElement('span');

			label.className = 'alt-chip__label';

			label.textContent = preset.label;

			choice.className = 'alt-chip';

			choice.dataset.preset = String(index);

			delete choice.dataset.value;

			choice.replaceChildren(label);

			return choice;
		}),
	);

	dom.presets.hidden = state.presets.length === 0;
};
