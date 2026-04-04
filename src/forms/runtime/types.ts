import type { ComponentType, ReactNode } from 'react';

import type {
	AtlFieldRegistration,
	AtlFormStore,
	AtlFormValues,
	AtlSubmitHandler,
	AtlInvalidSubmitHandler,
	AtlValidateMode,
	AtlResolver,
} from '../core/types';

export type AtlRuntimeOption = {
	description?: string;
	disabled?: boolean;
	icon?: ReactNode;
	label: string;
	value: unknown;
};

export type AtlRuntimeRule = {
	message?: string;
	type: 'email' | 'maxLength' | 'minLength' | 'required';
	value?: number;
};

export type AtlRuntimeFieldSchema = AtlFieldRegistration & {
	description?: string;
	label?: string;
	name: string;
	options?: AtlRuntimeOption[];
	placeholder?: string;
	props?: Record<string, unknown>;
	rules?: AtlRuntimeRule[];
	type: 'autocomplete' | 'checkbox' | 'input' | 'radio' | 'select' | 'switcher' | string;
};

export type AtlRuntimeSchema = {
	fields: AtlRuntimeFieldSchema[];
	revalidateMode?: AtlValidateMode;
	validateMode?: AtlValidateMode;
};

export type AtlRuntimeFieldRendererProps<Values extends AtlFormValues> = {
	field: AtlRuntimeFieldSchema;
	form: AtlFormStore<Values>;
};

export type AtlRuntimeFieldRegistry<Values extends AtlFormValues> = Record<
	string,
	ComponentType<AtlRuntimeFieldRendererProps<Values>>
>;

export type AtlRuntimeFormProps<Values extends AtlFormValues> = {
	className?: string;
	fieldRegistry?: AtlRuntimeFieldRegistry<Values>;
	form?: AtlFormStore<Values>;
	onInvalidSubmit?: AtlInvalidSubmitHandler<Values>;
	onSubmit?: AtlSubmitHandler<Values>;
	renderActions?: (form: AtlFormStore<Values>) => ReactNode;
	resolver?: AtlResolver<Values>;
	schema: AtlRuntimeSchema;
};
