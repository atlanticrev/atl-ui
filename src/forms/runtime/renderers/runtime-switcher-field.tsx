import { AtlSwitcher } from '@/components/switcher';
import type { AtlSwitcherProps } from '@/components/switcher/types';
import { useAtlSwitcherBinding } from '@/forms/bindings/use-atl-switcher-binding';

import type { AtlFormValues } from '@/forms/core/types';
import type { AtlRuntimeFieldRendererProps } from '../types';

export const AtlRuntimeSwitcherField = <Values extends AtlFormValues>({
	field,
	form,
}: AtlRuntimeFieldRendererProps<Values>) => {
	const { switcherProps } = useAtlSwitcherBinding(field.name, {
		defaultValue: field.defaultValue,
		disabled: field.disabled,
		form,
		required: field.required,
	});

	return (
		<AtlSwitcher
			{...(field.props as Partial<AtlSwitcherProps>)}
			{...switcherProps}
			testId={field.name}
		/>
	);
};
