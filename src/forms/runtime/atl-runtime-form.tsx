import { clsx } from '@/lib/clsx';

import { AtlFormProvider } from '../react/atl-form-provider';
import { useAtlForm } from '../react/use-atl-form';
import { createRuntimeResolver } from './create-runtime-resolver';
import { getRuntimeDefaultValues } from './get-runtime-default-values';
import { AtlRuntimeField } from './atl-runtime-field';

import type { AtlFormValues } from '../core/types';
import type { AtlRuntimeFormProps } from './types';

export const AtlRuntimeForm = <Values extends AtlFormValues>({
	className,
	fieldRegistry,
	form,
	onInvalidSubmit,
	onSubmit,
	renderActions,
	resolver,
	schema,
}: AtlRuntimeFormProps<Values>) => {
	const runtimeForm = useAtlForm<Values>({
		defaultValues: getRuntimeDefaultValues(schema) as Values,
		resolver: resolver ?? createRuntimeResolver(schema),
		revalidateMode: schema.revalidateMode,
		validateMode: schema.validateMode,
	});
	const resolvedForm = form ?? runtimeForm;
	const handleSubmit = onSubmit
		? resolvedForm.handleSubmit(onSubmit, onInvalidSubmit)
		: undefined;

	return (
		<AtlFormProvider form={resolvedForm}>
			<form className={clsx('atl-runtime-form', className)} onSubmit={handleSubmit}>
				{schema.fields.map((field) => (
					<AtlRuntimeField
						field={field}
						fieldRegistry={fieldRegistry}
						form={resolvedForm}
						key={field.name}
					/>
				))}

				{renderActions?.(resolvedForm)}
			</form>
		</AtlFormProvider>
	);
};
