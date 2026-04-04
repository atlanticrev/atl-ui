import { AtlCheckbox } from '@/components/checkbox';
import type { AtlCheckboxProps } from '@/components/checkbox/types';
import { useAtlCheckboxBinding } from '@/forms/bindings/use-atl-checkbox-binding';

import type { AtlFormValues } from '@/forms/core/types';
import type { AtlRuntimeFieldRendererProps } from '../types';

export const AtlRuntimeCheckboxField = <Values extends AtlFormValues>({
	field,
	form,
}: AtlRuntimeFieldRendererProps<Values>) => {
	const { checkboxProps } = useAtlCheckboxBinding(field.name, {
		defaultValue: field.defaultValue,
		disabled: field.disabled,
		form,
		required: field.required,
	});

	return (
		<AtlCheckbox
			{...(field.props as Partial<AtlCheckboxProps>)}
			{...checkboxProps}
			label={field.label}
			testId={field.name}
		/>
	);
};
