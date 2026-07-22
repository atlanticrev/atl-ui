import { OpenStateController, type OpenChangeReason } from '../../controllers';
import { upgradeProperties } from '../../core';

import { createAutocompleteActions } from './autocomplete-action-factory';
import type { AutocompleteActions } from './autocomplete-actions';
import { AUTOCOMPLETE_OBSERVED_ATTRIBUTES } from './autocomplete-attributes';
import { createAutocompleteDom } from './autocomplete-dom';
import { bindAutocompleteForm } from './autocomplete-form';
import { bindAutocompleteInteractions } from './autocomplete-interactions';
import { readAutocompleteOptions } from './autocomplete-options';
import { createAutocompletePropertiesClass } from './autocomplete-properties';
import { AUTOCOMPLETE_PRE_UPGRADE_PROPERTIES } from './autocomplete-property-names';
import {
	AutocompleteStateController,
	readAutocompleteSelectionLabel,
	readInitialAutocompleteValues,
} from './autocomplete-state';
import { renderAutocomplete, syncAutocompleteActiveDescendant } from './autocomplete-view';

export const createAltAutocompleteElementClass = (
	HtmlElementConstructor: typeof HTMLElement,
): CustomElementConstructor => {
	const AutocompletePropertiesElement = createAutocompletePropertiesClass(HtmlElementConstructor);

	return class AltAutocompleteElement extends AutocompletePropertiesElement {
		static observedAttributes = AUTOCOMPLETE_OBSERVED_ATTRIBUTES;
		#state = new AutocompleteStateController();
		#openState = new OpenStateController(this, {
			isDisabled: () => this.hasAttribute('disabled'),
			onCommit: () => this.requestUpdate(),
		});
		#actions: AutocompleteActions;

		constructor() {
			super();

			this.#actions = createAutocompleteActions(this, {
				commit: this.#commit,
				isOpen: () => this.#openState.open,
				refreshOptions: this.#refreshOptions,
				requestOpen: this.#requestOpen,
			});
		}

		attributeChangedCallback(name: string, previous: string | null, value: string | null): void {
			if (previous === value) return;

			if (name === 'open') this.#openState.syncAttribute(value !== null);

			if (name === 'disabled' && value !== null) this.#requestOpen(false, 'programmatic');

			if (name === 'value' && !this.multiple) this.valuesState = value ? [value] : [];

			this.#syncInputFromSelection();

			this.requestUpdate();
		}

		onConnected(signal: AbortSignal): void {
			upgradeProperties(this, AUTOCOMPLETE_PRE_UPGRADE_PROPERTIES);

			if (!this.optionsAssigned) {
				this.optionsValue = readAutocompleteOptions(this, this.autocompleteDom?.dropdown);
			}

			this.autocompleteDom ??= createAutocompleteDom(this);

			this.#initializeState();

			this.classList.add('alt-autocomplete');

			bindAutocompleteInteractions(this, this.autocompleteDom, this.#actions, signal);

			bindAutocompleteForm(this, this.autocompleteDom, () => this.#state.defaultState, this.#commit, signal);
		}

		update(): void {
			if (!this.autocompleteDom) return;

			renderAutocomplete(this, this.autocompleteDom, {
				filter: this.filterValue,
				inputPristine: this.inputPristineState,
				inputValue: this.inputValueState,
				options: this.optionsValue,
				values: this.valuesState,
			});

			queueMicrotask(() => {
				if (this.autocompleteDom) syncAutocompleteActiveDescendant(this.autocompleteDom);
			});
		}

		clear(): void {
			this.#actions.clear();
		}

		#commit = (values: readonly string[], inputValue: string, pristine: boolean): void => {
			this.valuesState = this.multiple ? [...new Set(values)] : values.slice(0, 1);

			this.inputValueState = inputValue;

			this.inputPristineState = pristine;

			const value = this.valuesState[0];

			if (value) this.setAttribute('value', value);
			else this.removeAttribute('value');

			this.requestUpdate();
		};

		#initializeState(): void {
			if (this.#state.initialized) return;

			this.valuesState = readInitialAutocompleteValues(this, this.optionsValue, this.valuesState);

			this.#syncInputFromSelection();

			this.#state.initialize({ inputValue: this.inputValueState, values: this.valuesState });
		}

		#syncInputFromSelection(): void {
			if (!this.inputPristineState || this.multiple) return;

			this.inputValueState = readAutocompleteSelectionLabel(this, this.optionsValue, this.valuesState);
		}

		#refreshOptions = (): void => {
			if (!this.optionsAssigned) {
				this.optionsValue = readAutocompleteOptions(this, this.autocompleteDom?.dropdown);
			}

			this.#syncInputFromSelection();

			this.requestUpdate();
		};

		#requestOpen = (open: boolean, reason: OpenChangeReason, event?: Event): void => {
			this.#openState.request(open, reason, event);
		};
	};
};
