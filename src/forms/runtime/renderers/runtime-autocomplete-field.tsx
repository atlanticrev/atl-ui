import { AtlAutocomplete } from '@/components/autocomplete';
import type { AtlAutocompleteProps } from '@/components/autocomplete/types';
import { useAtlAutocompleteBinding } from '@/forms/bindings/use-atl-autocomplete-binding';

import type { AtlFormValues } from '@/forms/core/types';
import type { AtlRuntimeFieldRendererProps } from '../types';

export const AtlRuntimeAutocompleteField = <Values extends AtlFormValues>({
	field,
	form,
}: AtlRuntimeFieldRendererProps<Values>) => {
	const { autocompleteProps } = useAtlAutocompleteBinding(field.name, {
		defaultValue: field.defaultValue,
		disabled: field.disabled,
		form,
		required: field.required,
	});

	return (
		<AtlAutocomplete
			{...(field.props as Partial<AtlAutocompleteProps<unknown>>)}
			{...autocompleteProps}
			label={field.label}
			options={field.options ?? []}
			placeholder={field.placeholder}
			testId={field.name}
		/>
	);
};
