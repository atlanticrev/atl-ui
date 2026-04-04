import type { AtlFormValues } from '../core/types';
import { createAtlFieldRegistry } from './field-registry';
import { AtlRuntimeAutocompleteField } from './renderers/runtime-autocomplete-field';
import { AtlRuntimeCheckboxField } from './renderers/runtime-checkbox-field';
import { AtlRuntimeInputField } from './renderers/runtime-input-field';
import { AtlRuntimeRadioField } from './renderers/runtime-radio-field';
import { AtlRuntimeSelectField } from './renderers/runtime-select-field';
import { AtlRuntimeSwitcherField } from './renderers/runtime-switcher-field';

export const createDefaultAtlFieldRegistry = <Values extends AtlFormValues>() =>
	createAtlFieldRegistry<Values>({
		autocomplete: AtlRuntimeAutocompleteField,
		checkbox: AtlRuntimeCheckboxField,
		input: AtlRuntimeInputField,
		radio: AtlRuntimeRadioField,
		select: AtlRuntimeSelectField,
		switcher: AtlRuntimeSwitcherField,
	});
