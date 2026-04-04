import { Fragment } from 'react';

import { AtlRadioButton } from '@/components/radio-button';
import type { AtlRadioButtonProps } from '@/components/radio-button/types';
import { useAtlRadioBinding } from '@/forms/bindings/use-atl-radio-binding';

import type { AtlFormValues } from '@/forms/core/types';
import type { AtlRuntimeFieldRendererProps } from '../types';

export const AtlRuntimeRadioField = <Values extends AtlFormValues>({
	field,
	form,
}: AtlRuntimeFieldRendererProps<Values>) => {
	return (
		<Fragment>
			{(field.options ?? []).map((option) => (
				<AtlRuntimeRadioOption
					field={field}
					form={form}
					key={`${field.name}-${String(option.value)}`}
					optionValue={option.value}
				/>
			))}
		</Fragment>
	);
};

type AtlRuntimeRadioOptionProps<Values extends AtlFormValues> = AtlRuntimeFieldRendererProps<Values> & {
	optionValue: unknown;
};

const AtlRuntimeRadioOption = <Values extends AtlFormValues>({
	field,
	form,
	optionValue,
}: AtlRuntimeRadioOptionProps<Values>) => {
	const option = field.options?.find((item) => item.value === optionValue);
	const { radioProps } = useAtlRadioBinding(field.name, {
		defaultValue: field.defaultValue,
		disabled: field.disabled,
		form,
		optionValue,
		required: field.required,
	});

	return (
		<AtlRadioButton
			{...(field.props as Partial<AtlRadioButtonProps>)}
			{...radioProps}
			label={option?.label}
			name={field.name}
			testId={`${field.name}-${String(optionValue)}`}
			value={String(optionValue)}
		/>
	);
};
