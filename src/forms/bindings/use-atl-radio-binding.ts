import type { AtlRadioButtonProps } from '@/components/radio-button/types';

import { isEqualValue } from '../core/path';
import type { AtlFieldRegistration, AtlFormStore, AtlFormValues } from '../core/types';
import { useAtlField } from '../react/use-atl-field';

type AtlRadioBindingOptions<Values extends AtlFormValues, Context = unknown> = AtlFieldRegistration & {
	form?: AtlFormStore<Values, Context>;
	optionValue: unknown;
};

export const useAtlRadioBinding = <Values extends AtlFormValues, Context = unknown>(
	name: string,
	options: AtlRadioBindingOptions<Values, Context>,
) => {
	const field = useAtlField(name, options);

	const radioProps: Pick<AtlRadioButtonProps, 'checked' | 'invalid' | 'onChange'> = {
		checked: isEqualValue(field.value, options.optionValue),
		invalid: field.invalid,
		onChange: (event) => {
			if (event.target.checked) {
				field.setValue(options.optionValue);
			}
		},
	};

	return {
		field,
		message: field.message,
		radioProps,
	};
};
