import { setSelectCarrierValues } from '../../controllers';
import { createBaseElementClass, createTypedEvent, upgradeProperties } from '../../core';
import { parseDateValue, type AltCalendarChangeDetail, type AltCalendarPreset } from '../calendar';

import { createDatePickerDom, type DatePickerDom } from './date-picker-dom';
import type { AltDatePickerChangeDetail } from './types';

type PickerMode = 'range' | 'single';
type CalendarApi = HTMLElement & {
	disabledDate: ((value: string) => boolean) | null;
	presets: readonly AltCalendarPreset[];
};

const formatDisplay = (value: string | null, locale: string): string => {
	const date = parseDateValue(value);

	return date
		? new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', timeZone: 'UTC', year: 'numeric' }).format(
				date,
			)
		: '';
};

export const createAltDatePickerElementClass = (
	HtmlElementConstructor: typeof HTMLElement,
	mode: PickerMode = 'single',
): CustomElementConstructor => {
	const BaseElement = createBaseElementClass(HtmlElementConstructor);

	return class AltDatePickerElement extends BaseElement {
		static observedAttributes = [
			'commit-mode',
			'disabled',
			'end',
			'first-day',
			'initial-view',
			'locale',
			'max',
			'min',
			'name',
			'name-end',
			'open',
			'placeholder',
			'required',
			'start',
			'value',
		];
		#defaults = { end: null as string | null, start: null as string | null, value: null as string | null };
		#disabledDate: ((value: string) => boolean) | null = null;
		#dom: DatePickerDom | undefined;
		#lastOpen = false;
		#presets: readonly AltCalendarPreset[] = [];

		get disabledDate(): ((value: string) => boolean) | null {
			return this.#disabledDate;
		}
		set disabledDate(value: ((value: string) => boolean) | null) {
			this.#disabledDate = value;

			this.requestUpdate();
		}

		get open(): boolean {
			return this.hasAttribute('open');
		}
		set open(value: boolean) {
			this.toggleAttribute('open', value);
		}
		get presets(): readonly AltCalendarPreset[] {
			return this.#presets;
		}
		set presets(value: readonly AltCalendarPreset[]) {
			this.#presets = value;

			this.requestUpdate();
		}

		get value(): string | null {
			return this.getAttribute('value');
		}
		set value(value: string | null) {
			value ? this.setAttribute('value', value) : this.removeAttribute('value');
		}
		get start(): string | null {
			return this.getAttribute('start');
		}
		set start(value: string | null) {
			value ? this.setAttribute('start', value) : this.removeAttribute('start');
		}
		get end(): string | null {
			return this.getAttribute('end');
		}
		set end(value: string | null) {
			value ? this.setAttribute('end', value) : this.removeAttribute('end');
		}

		attributeChangedCallback(): void {
			this.requestUpdate();
		}

		onConnected(signal: AbortSignal): void {
			upgradeProperties(this, ['disabledDate', 'end', 'open', 'presets', 'start', 'value']);

			this.classList.add('alt-date-picker');

			this.dataset.mode = mode;

			this.#dom ??= createDatePickerDom(this);

			this.#defaults = { end: this.end, start: this.start, value: this.value };

			this.#dom.trigger.addEventListener(
				'click',
				() => {
					this.open = !this.open;
				},
				{ signal },
			);

			this.#dom.clear.addEventListener('click', this.#clear, { signal });

			this.#dom.calendar.addEventListener('alt-input', this.#handleCalendarInput as EventListener, { signal });

			this.#dom.calendar.addEventListener('alt-change', this.#handleCalendarChange as EventListener, { signal });

			this.ownerDocument.addEventListener('reset', this.#handleReset, { signal });

			this.ownerDocument.addEventListener('keydown', this.#handleKeydown, { signal });

			this.ownerDocument.addEventListener('pointerdown', this.#handleOutsidePointer, { capture: true, signal });
		}

		update(): void {
			if (!this.#dom) return;

			const { calendar, clear, endCarrier, panel, startCarrier, trigger, value } = this.#dom;

			const disabled = this.hasAttribute('disabled');

			const locale = this.getAttribute('locale') || this.ownerDocument.documentElement.lang || 'en';

			const startValue = mode === 'single' ? this.value : this.start;

			const display =
				mode === 'single'
					? formatDisplay(this.value, locale)
					: [formatDisplay(this.start, locale), formatDisplay(this.end, locale)].filter(Boolean).join(' — ');

			calendar.setAttribute('selection-mode', mode);

			calendar.setAttribute(
				'commit-mode',
				this.getAttribute('commit-mode') || (mode === 'range' ? 'explicit' : 'immediate'),
			);

			if (!calendar.dataset.initializedView) {
				calendar.setAttribute('view', this.getAttribute('initial-view') || 'days');

				calendar.dataset.initializedView = 'true';
			}

			for (const name of ['first-day', 'locale', 'max', 'min']) {
				const attribute = this.getAttribute(name);

				attribute === null ? calendar.removeAttribute(name) : calendar.setAttribute(name, attribute);
			}

			for (const [name, selected] of [
				['value', this.value],
				['start', this.start],
				['end', this.end],
			] as const) {
				selected ? calendar.setAttribute(name, selected) : calendar.removeAttribute(name);
			}

			(calendar as CalendarApi).disabledDate = this.#disabledDate;

			(calendar as CalendarApi).presets = this.#presets;

			startCarrier.name = this.getAttribute('name') ?? '';

			endCarrier.name = mode === 'range' ? (this.getAttribute('name-end') ?? '') : '';

			startCarrier.disabled = disabled;

			endCarrier.disabled = disabled;

			startCarrier.required = this.hasAttribute('required');

			endCarrier.required = mode === 'range' && this.hasAttribute('required');

			setSelectCarrierValues(startCarrier, startValue ? [startValue] : []);

			setSelectCarrierValues(endCarrier, mode === 'range' && this.end ? [this.end] : []);

			trigger.disabled = disabled;

			trigger.setAttribute('aria-expanded', String(this.open));

			value.textContent =
				display || this.getAttribute('placeholder') || (mode === 'range' ? 'Select dates' : 'Select date');

			value.dataset.placeholder = String(!display);

			clear.hidden = !display || disabled;

			panel.hidden = !this.open;

			if (this.open && !this.#lastOpen) {
				const focusCalendar = (): void => {
					const selected = calendar.querySelector<HTMLElement>('[data-selected="true"]');

					(selected ?? calendar.querySelector<HTMLElement>('[data-value]:not(:disabled)'))?.focus();
				};

				const view = this.ownerDocument.defaultView;

				if (view) view.requestAnimationFrame(focusCalendar);
				else queueMicrotask(() => queueMicrotask(focusCalendar));
			}

			this.#lastOpen = this.open;
		}

		#set(detail: AltCalendarChangeDetail): void {
			if (mode === 'single') this.value = detail.value;
			else {
				this.start = detail.range.start;

				this.end = detail.range.end;
			}
		}

		#handleCalendarInput = (event: CustomEvent<AltCalendarChangeDetail>): void => {
			event.stopPropagation();

			this.#set(event.detail);

			this.#emit('alt-input');
		};

		#handleCalendarChange = (event: CustomEvent<AltCalendarChangeDetail>): void => {
			event.stopPropagation();

			this.#set(event.detail);

			this.#emit('alt-change');

			if (event.detail.complete || (!event.detail.value && !event.detail.range.start)) {
				this.open = false;

				this.#dom?.trigger.focus();
			}
		};

		#emit(type: string): void {
			this.dispatchEvent(
				createTypedEvent<AltDatePickerChangeDetail>(type, {
					range: { end: this.end, start: this.start },
					value: this.value,
				}),
			);
		}
		#clear = (): void => {
			this.value = null;

			this.start = null;

			this.end = null;

			this.#emit('alt-input');

			this.#emit('alt-change');
		};

		#handleKeydown = (event: KeyboardEvent): void => {
			if (event.key === 'Escape' && this.open) {
				this.open = false;

				this.#dom?.trigger.focus();
			}
		};

		#handleOutsidePointer = (event: Event): void => {
			if (this.open && !this.contains(event.target as Node)) this.open = false;
		};
		#handleReset = (event: Event): void => {
			if (event.target !== this.#dom?.startCarrier.form) return;

			queueMicrotask(() => {
				this.value = this.#defaults.value;

				this.start = this.#defaults.start;

				this.end = this.#defaults.end;
			});
		};
	};
};

export const createAltDateRangePickerElementClass = (
	HtmlElementConstructor: typeof HTMLElement,
): CustomElementConstructor => {
	return createAltDatePickerElementClass(HtmlElementConstructor, 'range');
};
