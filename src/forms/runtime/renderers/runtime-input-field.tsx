import { AtlInput } from '@/components/input/input';
import type { AtlInputProps } from '@/components/input/input.type';
import { useAtlInputBinding } from '@/forms/bindings/use-atl-input-binding';

import type { AtlFormValues } from '@/forms/core/types';
import type { AtlRuntimeFieldRendererProps } from '../types';

export const AtlRuntimeInputField = <Values extends AtlFormValues>({
	field,
	form,
}: AtlRuntimeFieldRendererProps<Values>) => {
	const { inputProps } = useAtlInputBinding(field.name, {
		defaultValue: field.defaultValue,
		disabled: field.disabled,
		form,
		required: field.required,
	});

	return (
		<AtlInput
			{...(field.props as Partial<AtlInputProps>)}
			{...inputProps}
			description={field.description}
			label={field.label}
			placeholder={field.placeholder}
			testId={field.name}
		/>
	);
};
