import type { AltDropdownChangeDetail } from '../dropdown';

import type { AutocompleteActionContext } from './autocomplete-action-context';
import { readAutocompleteBoolean } from './autocomplete-config';
import { emitAutocompleteChange, emitAutocompleteInput } from './autocomplete-events';
import { getInputValue, setInputValue } from './autocomplete-input';
import { handleAutocompleteKeyDown } from './autocomplete-keyboard';
import { findAutocompleteOption } from './autocomplete-options';

export class AutocompleteActions {
	public constructor(private readonly context: AutocompleteActionContext) {}
	public readonly clear = (event?: Event): void => {
		const { host } = this.context;

		if (host.hasAttribute('disabled') || host.hasAttribute('readonly')) return;

		if (this.context.values().length === 0 && this.context.inputValue() === '') return;

		this.context.commit([], '', true);

		emitAutocompleteInput(host, '', 'clear', event);

		emitAutocompleteChange(host, [], 'clear', undefined, event);
	};
	public readonly onFocus = (event: FocusEvent): void => {
		if (readAutocompleteBoolean(this.context.host, 'open-on-focus', true)) {
			this.context.requestOpen(true, 'focus', event);
		}
	};

	public readonly onInput = (event: Event): void => {
		event.stopPropagation();

		const dom = this.context.dom();

		if (!dom || this.context.host.hasAttribute('readonly')) return;

		const nextValue = getInputValue(dom.input);

		const pattern = this.context.inputPattern();

		if (pattern) pattern.lastIndex = 0;

		if (nextValue && pattern && !pattern.test(nextValue)) {
			setInputValue(dom.input, this.context.inputValue());

			return;
		}

		this.context.commit(this.context.values(), nextValue, false);

		this.context.requestOpen(true, 'input', event);

		emitAutocompleteInput(this.context.host, nextValue, 'input', event);
	};

	public readonly onKeyDown = (event: KeyboardEvent): void => {
		handleAutocompleteKeyDown(event, {
			clear: this.#clearOnEscape,
			close: (source) => this.context.requestOpen(false, 'escape', source),
			commitFreeSolo: this.#commitFreeSolo,
			isFreeSolo: () => this.context.host.hasAttribute('free-solo'),
			isOpen: this.context.isOpen,
			move: this.#move,
			open: (source) => this.context.requestOpen(true, 'trigger', source),
			selectActive: this.#selectActive,
		});
	};

	public readonly onPopupClosed = (event: Event): void => {
		const wasOpen = this.context.isOpen();

		if (wasOpen) this.context.requestOpen(false, 'outside', event);

		const clearByDefault = !this.context.host.hasAttribute('free-solo');

		if (wasOpen && readAutocompleteBoolean(this.context.host, 'clear-on-blur', clearByDefault)) {
			this.#restoreSelectionLabel();
		}
	};

	public readonly onRefreshOptions = (): void => this.context.refreshOptions();

	public readonly onSelect = (event: Event): void => {
		event.stopPropagation();

		const dom = this.context.dom();

		if (!dom) return;

		const detail = (event as CustomEvent<AltDropdownChangeDetail>).detail;

		const value = dom.dropdown.activeValue;

		const option = findAutocompleteOption(this.context.options(), value);

		if (!option) return;

		const wasSelected = this.context.values().includes(value);

		const values = detail.values;

		const inputValue = this.context.host.hasAttribute('multiple') ? '' : option.label;

		this.context.commit(values, inputValue, true);

		emitAutocompleteInput(this.context.host, inputValue, 'selection', event);

		emitAutocompleteChange(this.context.host, values, wasSelected ? 'remove' : 'select', option, event);

		if (
			readAutocompleteBoolean(this.context.host, 'close-on-select', !this.context.host.hasAttribute('multiple'))
		) {
			this.context.requestOpen(false, 'selection', event);
		}
	};

	public readonly onTrigger = (event: Event): void => {
		if (this.context.host.hasAttribute('disabled')) return;

		const nextOpen = !this.context.isOpen();

		if (nextOpen) this.context.requestOpen(true, 'trigger', event);

		this.context.dom()?.inputElement.focus({ preventScroll: true });

		if (!nextOpen) this.context.requestOpen(false, 'trigger', event);
	};

	#clearOnEscape = (event: Event): void => {
		if (readAutocompleteBoolean(this.context.host, 'clear-on-escape', true)) this.clear(event);
	};

	#commitFreeSolo = (event: Event): void => {
		const value = this.context.inputValue().trim();

		if (!value) return;

		const multiple = this.context.host.hasAttribute('multiple');

		const values = multiple ? [...new Set([...this.context.values(), value])] : [value];

		this.context.commit(values, multiple ? '' : value, true);

		emitAutocompleteChange(this.context.host, values, 'create', undefined, event);

		this.context.requestOpen(false, 'selection', event);
	};

	#move = (direction: 1 | -1, edge?: 'end' | 'start'): void => {
		this.context.dom()?.dropdown.moveActive(direction, edge);
	};

	#restoreSelectionLabel(): void {
		const selected = findAutocompleteOption(this.context.options(), this.context.values()[0] ?? '');

		this.context.commit(this.context.values(), selected?.label ?? '', true);
	}

	#selectActive = (): boolean => {
		const dropdown = this.context.dom()?.dropdown;
		return dropdown?.activeValue ? dropdown.select(dropdown.activeValue) : false;
	};
}
