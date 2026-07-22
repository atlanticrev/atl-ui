import { createBaseElementClass, createTypedEvent, upgradeProperties } from '../../core';

import { createCalendarDom, type CalendarDom } from './calendar-dom';
import { renderCalendar } from './calendar-render';
import {
	addDays,
	addMonths,
	addYears,
	clampDateValue,
	formatDateValue,
	parseDateValue,
	todayValue,
} from './date-value';
import type { AltCalendarChangeDetail, AltCalendarPreset, AltCalendarSelectionMode, AltCalendarView } from './types';

const readView = (value: string | null): AltCalendarView => {
	return value === 'months' || value === 'years' ? value : 'days';
};

export const createAltCalendarElementClass = (HtmlElementConstructor: typeof HTMLElement): CustomElementConstructor => {
	const BaseElement = createBaseElementClass(HtmlElementConstructor);

	return class AltCalendarElement extends BaseElement {
		static observedAttributes = [
			'commit-mode',
			'end',
			'first-day',
			'locale',
			'max',
			'min',
			'selection-mode',
			'start',
			'value',
			'view',
		];
		#cursor = parseDateValue(todayValue()) as Date;
		#disabledDate: ((value: string) => boolean) | null = null;
		#dom: CalendarDom | undefined;
		#focusValue: string | null = null;
		#presets: readonly AltCalendarPreset[] = [];

		get disabledDate(): ((value: string) => boolean) | null {
			return this.#disabledDate;
		}
		set disabledDate(value: ((value: string) => boolean) | null) {
			this.#disabledDate = value;

			this.requestUpdate();
		}

		get presets(): readonly AltCalendarPreset[] {
			return this.#presets;
		}
		set presets(value: readonly AltCalendarPreset[]) {
			this.#presets = value;

			this.requestUpdate();
		}

		get selectionMode(): AltCalendarSelectionMode {
			return this.getAttribute('selection-mode') === 'range' ? 'range' : 'single';
		}
		set selectionMode(value: AltCalendarSelectionMode) {
			this.setAttribute('selection-mode', value);
		}
		get value(): string | null {
			return this.getAttribute('value');
		}
		set value(value: string | null) {
			value ? this.setAttribute('value', value) : this.removeAttribute('value');
		}

		attributeChangedCallback(): void {
			this.requestUpdate();
		}

		onConnected(signal: AbortSignal): void {
			upgradeProperties(this, ['disabledDate', 'presets', 'selectionMode', 'value']);

			this.classList.add('alt-calendar');

			this.#dom ??= createCalendarDom(this);

			const initial = parseDateValue(this.value ?? this.getAttribute('start'));

			if (initial) this.#cursor = initial;

			this.addEventListener('click', this.#handleClick, { signal });

			this.addEventListener('keydown', this.#handleKeydown, { signal });
		}

		update(): void {
			if (!this.#dom) return;

			const min = parseDateValue(this.getAttribute('min')) ? this.getAttribute('min') : null;

			const max = parseDateValue(this.getAttribute('max')) ? this.getAttribute('max') : null;

			const cursorValue = formatDateValue(this.#cursor);

			const boundedCursor = clampDateValue(cursorValue, min, max);

			if (boundedCursor !== cursorValue) this.#cursor = parseDateValue(boundedCursor) ?? this.#cursor;

			renderCalendar(
				this.#dom,
				{
					cursor: this.#cursor,
					disabled: (value) =>
						Boolean((min && value < min) || (max && value > max) || this.#disabledDate?.(value)),
					end: this.getAttribute('end'),
					firstDay: Math.max(0, Math.min(6, Number(this.getAttribute('first-day')) || 0)),
					locale: this.getAttribute('locale') || this.ownerDocument.documentElement.lang || 'en',
					max,
					min,
					presets: this.#presets,
					start: this.getAttribute('start'),
					value: this.value,
					view: readView(this.getAttribute('view')),
				},
				this.getAttribute('commit-mode') === 'explicit',
			);

			if (this.#focusValue) {
				this.#dom.grid.querySelector<HTMLElement>(`[data-value="${this.#focusValue}"]`)?.focus();

				this.#focusValue = null;
			}
		}

		#detail(): AltCalendarChangeDetail {
			const start = this.getAttribute('start');

			const end = this.getAttribute('end');

			return {
				complete: this.selectionMode === 'single' ? Boolean(this.value) : Boolean(start && end),
				mode: this.selectionMode,
				range: { end, start },
				value: this.value,
			};
		}

		#emit(type: string): void {
			this.dispatchEvent(createTypedEvent(type, this.#detail()));
		}

		#select(value: string): void {
			if (this.selectionMode === 'single') this.value = value;
			else {
				const start = this.getAttribute('start');

				const end = this.getAttribute('end');

				if (!start || end) {
					this.setAttribute('start', value);

					this.removeAttribute('end');
				} else {
					this.setAttribute('start', value < start ? value : start);

					this.setAttribute('end', value < start ? start : value);
				}
			}

			this.#emit('alt-input');

			if (this.getAttribute('commit-mode') !== 'explicit' && this.#detail().complete) this.#emit('alt-change');
		}

		#move(amount: number): void {
			const view = readView(this.getAttribute('view'));

			this.#cursor =
				view === 'days'
					? addMonths(this.#cursor, amount)
					: view === 'months'
						? addYears(this.#cursor, amount)
						: addYears(this.#cursor, amount * 12);

			this.requestUpdate();
		}

		#handleClick = (event: Event): void => {
			const target = (event.target as Element | null)?.closest<HTMLButtonElement>('button');

			if (!target || !this.contains(target) || target.disabled) return;

			const action = target.dataset.action;

			if (action === 'previous' || action === 'next') this.#move(action === 'previous' ? -1 : 1);
			else if (action === 'change-view')
				this.setAttribute('view', readView(this.getAttribute('view')) === 'days' ? 'months' : 'years');
			else if (action === 'reset') {
				this.removeAttribute('value');

				this.removeAttribute('start');

				this.removeAttribute('end');

				this.#emit('alt-input');

				this.#emit('alt-change');
			} else if (action === 'apply') this.#emit('alt-change');
			else if (target.dataset.preset !== undefined) {
				const preset = this.#presets[Number(target.dataset.preset)];

				if (preset) {
					this.setAttribute('start', preset.start);

					preset.end ? this.setAttribute('end', preset.end) : this.removeAttribute('end');

					this.#emit('alt-input');

					this.#emit('alt-change');
				}
			} else if (target.dataset.value) this.#chooseViewValue(target.dataset.value);
		};

		#chooseViewValue(value: string): void {
			const view = readView(this.getAttribute('view'));

			if (view === 'years') {
				this.#cursor = new Date(Date.UTC(Number(value), this.#cursor.getUTCMonth(), 1));

				this.setAttribute('view', 'months');
			} else if (view === 'months') {
				const [year, month] = value.split('-').map(Number);

				this.#cursor = new Date(Date.UTC(year, month - 1, 1));

				this.setAttribute('view', 'days');
			} else {
				const normalized = clampDateValue(value, this.getAttribute('min'), this.getAttribute('max'));

				this.#cursor = parseDateValue(normalized) ?? this.#cursor;

				this.#select(normalized);
			}
		}

		#handleKeydown = (event: KeyboardEvent): void => {
			const choice = (event.target as Element | null)?.closest<HTMLButtonElement>('[data-value]');

			if (!choice || readView(this.getAttribute('view')) !== 'days') return;

			const current = parseDateValue(choice.dataset.value);

			if (!current) return;

			const firstDay = Math.max(0, Math.min(6, Number(this.getAttribute('first-day')) || 0));

			const weekOffset = (current.getUTCDay() - firstDay + 7) % 7;

			let move: number | null = null;

			if (event.key === 'ArrowDown') move = 7;

			if (event.key === 'ArrowLeft') move = -1;

			if (event.key === 'ArrowRight') move = 1;

			if (event.key === 'ArrowUp') move = -7;

			if (event.key === 'End') move = 6 - weekOffset;

			if (event.key === 'Home') move = -weekOffset;

			let next = move === null ? null : addDays(current, move);

			if (event.key === 'PageDown') next = addMonths(current, 1);

			if (event.key === 'PageUp') next = addMonths(current, -1);

			if (!next) return;

			event.preventDefault();

			this.#cursor = next;

			this.#focusValue = formatDateValue(next);

			this.requestUpdate();
		};
	};
};
