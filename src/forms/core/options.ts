import type { AtlFormOptions, AtlFormValues } from './types';

export const DEFAULT_VALIDATE_MODE = 'onSubmit';
export const DEFAULT_REVALIDATE_MODE = 'onChange';

export const resolveFormOptions = <Values extends AtlFormValues, Context = unknown>(
	options: Partial<AtlFormOptions<Values, Context>>,
) => {
	return {
		context: options.context,
		resolver: options.resolver,
		revalidateMode: options.revalidateMode ?? DEFAULT_REVALIDATE_MODE,
		validateMode: options.validateMode ?? DEFAULT_VALIDATE_MODE,
	};
};
