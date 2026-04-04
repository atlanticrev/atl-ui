import { AtlSelect } from '@/components/select';
import type { AtlSelectProps } from '@/components/select/types';
import { useAtlSelectBinding } from '@/forms/bindings/use-atl-select-binding';

import type { AtlFormValues } from '@/forms/core/types';
import type { AtlRuntimeFieldRendererProps } from '../types';

export const AtlRuntimeSelectField = <Values extends AtlFormValues>({
	field,
	form,
}: AtlRuntimeFieldRendererProps<Values>) => {
	const multiSelect = Boolean(field.props?.multiSelect);
	const { multiSelect: _multiSelect, ...baseProps } = (field.props ?? {}) as Partial<AtlSelectProps<unknown>>;
	const { selectProps } = useAtlSelectBinding(field.name, {
		defaultValue: field.defaultValue,
		disabled: field.disabled,
		form,
		multiSelect,
		required: field.required,
	});

	if (multiSelect) {
		return (
			<AtlSelect
				{...baseProps}
				helperText={selectProps.helperText}
				label={field.label}
				multiSelect
				options={field.options ?? []}
				placeholder={field.placeholder}
				status={selectProps.status}
				testId={field.name}
				value={(selectProps.value as unknown[]) ?? []}
				onChange={(value) => selectProps.onChange(value)}
			/>
		);
	}

	return (
		<AtlSelect
			{...baseProps}
			helperText={selectProps.helperText}
			label={field.label}
			options={field.options ?? []}
			placeholder={field.placeholder}
			status={selectProps.status}
			testId={field.name}
			value={selectProps.value}
			onChange={(value) => selectProps.onChange(value)}
		/>
	);
};
