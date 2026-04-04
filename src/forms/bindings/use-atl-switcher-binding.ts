import type { AtlSwitcherProps } from '@/components/switcher/types';

import { useAtlField } from '../react/use-atl-field';

import type { AtlFieldRegistration, AtlFormStore, AtlFormValues } from '../core/types';

type AtlSwitcherBindingOptions<Values extends AtlFormValues, Context = unknown> =
	AtlFieldRegistration & {
		form?: AtlFormStore<Values, Context>;
	};

export const useAtlSwitcherBinding = <Values extends AtlFormValues, Context = unknown>(
	name: string,
	options?: AtlSwitcherBindingOptions<Values, Context>,
) => {
	const field = useAtlField(name, options);
	const switcherProps: Pick<AtlSwitcherProps, 'checked' | 'invalid' | 'onChange'> = {
		checked: Boolean(field.value),
		invalid: field.invalid,
		onChange: (checked) => field.setValue(checked),
	};

	return {
		field,
		message: field.message,
		switcherProps,
	};
};
