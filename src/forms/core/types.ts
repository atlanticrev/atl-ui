export type AtlFormValues = Record<string, unknown>;

export type AtlFieldError = {
	message: string;
	type?: string;
};

export type AtlFormErrors = Record<string, AtlFieldError | undefined>;

export type AtlFieldRegistration = {
	defaultValue?: unknown;
	disabled?: boolean;
	keepErrorOnUnmount?: boolean;
	keepStateOnUnmount?: boolean;
	keepValueOnUnmount?: boolean;
	required?: boolean;
};

export type AtlValidateMode = 'onBlur' | 'onChange' | 'onSubmit';
export type AtlValidationReason = 'blur' | 'change' | 'manual' | 'submit';

export type AtlResolverContext<Context = unknown> = {
	context?: Context;
	fieldName?: string;
	names?: string[];
	reason: AtlValidationReason;
};

export type AtlResolver<Values extends AtlFormValues, Context = unknown> = (
	values: Values,
	context: AtlResolverContext<Context>,
) => AtlFormErrors | Promise<AtlFormErrors>;

export type AtlFormOptions<Values extends AtlFormValues, Context = unknown> = {
	context?: Context;
	defaultValues: Values;
	resolver?: AtlResolver<Values, Context>;
	revalidateMode?: AtlValidateMode;
	validateMode?: AtlValidateMode;
};

export type AtlFieldState = {
	disabled: boolean;
	dirty: boolean;
	error?: AtlFieldError;
	invalid: boolean;
	name: string;
	required: boolean;
	touched: boolean;
	value: unknown;
};

export type AtlFormState<Values extends AtlFormValues> = {
	dirtyFields: Record<string, boolean>;
	errors: AtlFormErrors;
	isDirty: boolean;
	isSubmitting: boolean;
	isValid: boolean;
	isValidating: boolean;
	registeredFields: string[];
	submitCount: number;
	touchedFields: Record<string, boolean>;
	values: Values;
};

export type AtlInvalidSubmitHandler<Values extends AtlFormValues> = (
	errors: AtlFormErrors,
	values: Values,
) => void | Promise<void>;

export type AtlSubmitHandler<Values extends AtlFormValues> = (values: Values) => void | Promise<void>;

export type AtlFormStore<Values extends AtlFormValues, Context = unknown> = {
	clearError: (name: string) => void;
	clearErrors: (names?: string[]) => void;
	getFieldState: (name: string) => AtlFieldState;
	getFieldStateVersion: (name: string) => number;
	getFormState: () => AtlFormState<Values>;
	getFormStateVersion: () => number;
	getValue: (name: string) => unknown;
	getValues: () => Values;
	getWatchStateVersion: () => number;
	handleSubmit: (
		onValid: AtlSubmitHandler<Values>,
		onInvalid?: AtlInvalidSubmitHandler<Values>,
	) => (event?: { preventDefault?: () => void }) => Promise<void>;
	registerField: (name: string, options?: AtlFieldRegistration) => void;
	reset: (nextValues?: Values) => void;
	resetField: (name: string, nextValue?: unknown) => void;
	setError: (name: string, error?: AtlFieldError | string) => void;
	setOptions: (options: Partial<AtlFormOptions<Values, Context>>) => void;
	setValue: (name: string, value: unknown) => void;
	subscribeField: (name: string, listener: () => void) => () => void;
	subscribeForm: (listener: () => void) => () => void;
	subscribeWatch: (names: string[] | undefined, listener: () => void) => () => void;
	touchField: (name: string) => void;
	unregisterField: (name: string, options?: AtlFieldRegistration) => void;
	validateField: (name: string, reason?: AtlValidationReason) => Promise<AtlFieldError | undefined>;
	validateForm: (reason?: AtlValidationReason) => Promise<boolean>;
};
