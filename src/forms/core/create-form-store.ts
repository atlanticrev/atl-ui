import { hasErrors, mergeErrorNames, normalizeFieldError } from './errors';
import { DEFAULT_REVALIDATE_MODE, DEFAULT_VALIDATE_MODE, resolveFormOptions } from './options';
import { cloneValue, deleteByPath, getByPath, hasByPath, isEqualValue, isRelatedPath, setByPath } from './path';

import type {
	AtlFieldRegistration,
	AtlFieldState,
	AtlFormErrors,
	AtlFormOptions,
	AtlFormStore,
	AtlFormValues,
	AtlValidationReason,
} from './types';

type RegisteredField = Required<Omit<AtlFieldRegistration, 'defaultValue'>> & {
	defaultValue?: unknown;
	mountCount: number;
};

type WatchSubscription = {
	listener: () => void;
	names?: string[];
};

export const createFormStore = <Values extends AtlFormValues, Context = unknown>(
	options: AtlFormOptions<Values, Context>,
): AtlFormStore<Values, Context> => {
	const state = {
		dirty: {} as Record<string, boolean>,
		errors: {} as AtlFormErrors,
		initialValues: cloneValue(options.defaultValues),
		isSubmitting: false,
		isValidating: false,
		submitCount: 0,
		touched: {} as Record<string, boolean>,
		values: cloneValue(options.defaultValues),
	};
	const fieldListeners = new Map<string, Set<() => void>>();
	const fieldVersions = new Map<string, number>();
	const formListeners = new Set<() => void>();
	const registrations = new Map<string, RegisteredField>();
	const watchListeners = new Map<number, WatchSubscription>();
	let config = resolveFormOptions(options);
	let formVersion = 0;
	let nextWatchId = 0;
	let watchVersion = 0;

	const emitForm = () => {
		formVersion += 1;
		for (const listener of formListeners) {
			listener();
		}
	};
	const emitFields = (changedNames: string[]) => {
		if (changedNames.length === 0) {
			return;
		}

		for (const [fieldName, listeners] of fieldListeners.entries()) {
			if (!changedNames.some((name) => isRelatedPath(fieldName, name))) {
				continue;
			}

			fieldVersions.set(fieldName, (fieldVersions.get(fieldName) ?? 0) + 1);
			for (const listener of listeners) {
				listener();
			}
		}
	};
	const emitWatchers = (changedNames: string[]) => {
		watchVersion += 1;
		for (const subscription of watchListeners.values()) {
			if (!subscription.names || subscription.names.some((name) => changedNames.some((changedName) => isRelatedPath(name, changedName)))) {
				subscription.listener();
			}
		}
	};
	const emit = (changedNames: string[]) => {
		emitFields(changedNames);
		emitForm();
		emitWatchers(changedNames);
	};
	const shouldValidate = (name: string, reason: AtlValidationReason): boolean => {
		const baseMode = config.validateMode ?? DEFAULT_VALIDATE_MODE;
		const nextMode = config.revalidateMode ?? DEFAULT_REVALIDATE_MODE;
		const hasExistingError = Boolean(state.errors[name]);
		const shouldRevalidate = hasExistingError || state.submitCount > 0;

		if (reason === 'change') {
			return baseMode === 'onChange' || (shouldRevalidate && nextMode === 'onChange');
		}

		if (reason === 'blur') {
			return baseMode === 'onBlur' || (shouldRevalidate && nextMode === 'onBlur');
		}

		return true;
	};
	const applyErrors = (nextErrors: AtlFormErrors, extraNames: string[] = []) => {
		const changedNames = mergeErrorNames(state.errors, nextErrors, extraNames);
		state.errors = nextErrors;
		emit(changedNames);
	};
	const runResolver = async (names: string[] | undefined, reason: AtlValidationReason) => {
		if (!config.resolver) {
			return {};
		}

		return await config.resolver(state.values, {
			context: config.context,
			fieldName: names?.length === 1 ? names[0] : undefined,
			names,
			reason,
		});
	};
	const validateField = async (name: string, reason: AtlValidationReason = 'manual') => {
		if (!config.resolver) {
			return undefined;
		}

		state.isValidating = true;
		emitForm();

		try {
			const nextErrors = await runResolver([name], reason);
			applyErrors(nextErrors, [name]);
			return nextErrors[name];
		} finally {
			state.isValidating = false;
			emitForm();
		}
	};
	const validateForm = async (reason: AtlValidationReason = 'manual') => {
		if (!config.resolver) {
			return true;
		}

		state.isValidating = true;
		emitForm();

		try {
			const nextErrors = await runResolver(Array.from(registrations.keys()), reason);
			applyErrors(nextErrors, Array.from(registrations.keys()));
			return !hasErrors(nextErrors);
		} finally {
			state.isValidating = false;
			emitForm();
		}
	};
	const getFieldState = (name: string): AtlFieldState => {
		const registration = registrations.get(name);
		const error = state.errors[name];

		return {
			disabled: registration?.disabled ?? false,
			dirty: Boolean(state.dirty[name]),
			error,
			invalid: Boolean(error),
			name,
			required: registration?.required ?? false,
			touched: Boolean(state.touched[name]),
			value: getByPath(state.values, name),
		};
	};

	return {
		clearError: (name) => {
			if (!state.errors[name]) {
				return;
			}

			const nextErrors = { ...state.errors };
			delete nextErrors[name];
			state.errors = nextErrors;
			emit([name]);
		},
		clearErrors: (names) => {
			const targetNames = names ?? Object.keys(state.errors);

			if (targetNames.length === 0) {
				return;
			}

			const nextErrors = { ...state.errors };

			for (const name of targetNames) {
				delete nextErrors[name];
			}

			state.errors = nextErrors;
			emit(targetNames);
		},
		getFieldState,
		getFieldStateVersion: (name) => fieldVersions.get(name) ?? 0,
		getFormState: () => ({
			dirtyFields: { ...state.dirty },
			errors: { ...state.errors },
			isDirty: Object.values(state.dirty).some(Boolean),
			isSubmitting: state.isSubmitting,
			isValid: !hasErrors(state.errors),
			isValidating: state.isValidating,
			registeredFields: Array.from(registrations.keys()),
			submitCount: state.submitCount,
			touchedFields: { ...state.touched },
			values: cloneValue(state.values),
		}),
		getFormStateVersion: () => formVersion,
		getValue: (name) => getByPath(state.values, name),
		getValues: () => cloneValue(state.values),
		getWatchStateVersion: () => watchVersion,
		handleSubmit: (onValid, onInvalid) => async (event) => {
			event?.preventDefault?.();
			state.submitCount += 1;
			emitForm();

			const isValid = await validateForm('submit');

			if (!isValid) {
				await onInvalid?.({ ...state.errors }, cloneValue(state.values));
				return;
			}

			state.isSubmitting = true;
			emitForm();

			try {
				await onValid(cloneValue(state.values));
			} finally {
				state.isSubmitting = false;
				emitForm();
			}
		},
		registerField: (name, registration) => {
			const currentRegistration = registrations.get(name);
			const nextRegistration: RegisteredField = {
				defaultValue: registration?.defaultValue ?? currentRegistration?.defaultValue,
				disabled: registration?.disabled ?? currentRegistration?.disabled ?? false,
				keepErrorOnUnmount:
					registration?.keepErrorOnUnmount ?? currentRegistration?.keepErrorOnUnmount ?? false,
				keepStateOnUnmount:
					registration?.keepStateOnUnmount ?? currentRegistration?.keepStateOnUnmount ?? false,
				keepValueOnUnmount:
					registration?.keepValueOnUnmount ?? currentRegistration?.keepValueOnUnmount ?? true,
				mountCount: (currentRegistration?.mountCount ?? 0) + 1,
				required: registration?.required ?? currentRegistration?.required ?? false,
			};

			registrations.set(name, nextRegistration);

			if (
				nextRegistration.defaultValue !== undefined
				&& !hasByPath(state.values, name)
			) {
				state.values = setByPath(state.values, name, cloneValue(nextRegistration.defaultValue));
				state.initialValues = setByPath(
					state.initialValues,
					name,
					cloneValue(nextRegistration.defaultValue),
				);
				emit([name]);
			}
		},
		reset: (nextValues) => {
			const changedNames = Array.from(
				new Set([
					...registrations.keys(),
					...Object.keys(state.errors),
					...Object.keys(state.touched),
					...Object.keys(state.dirty),
				]),
			);
			const values = cloneValue(nextValues ?? state.initialValues);
			state.errors = {};
			state.dirty = {};
			state.initialValues = cloneValue(values);
			state.touched = {};
			state.values = values;
			emit(changedNames);
		},
		resetField: (name, nextValue) => {
			const resolvedValue = nextValue ?? getByPath(state.initialValues, name);
			state.values = setByPath(state.values, name, cloneValue(resolvedValue));
			state.initialValues = setByPath(state.initialValues, name, cloneValue(resolvedValue));
			delete state.dirty[name];
			delete state.errors[name];
			delete state.touched[name];
			emit([name]);
		},
		setError: (name, error) => {
			const nextError = normalizeFieldError(error);
			const nextErrors = { ...state.errors };

			if (!nextError) {
				delete nextErrors[name];
			} else {
				nextErrors[name] = nextError;
			}

			state.errors = nextErrors;
			emit([name]);
		},
		setOptions: (nextOptions) => {
			config = {
				...config,
				...resolveFormOptions(nextOptions),
			};
		},
		setValue: (name, value) => {
			state.values = setByPath(state.values, name, value);
			state.dirty[name] = !isEqualValue(getByPath(state.initialValues, name), value);
			emit([name]);

			if (shouldValidate(name, 'change')) {
				void validateField(name, 'change');
			}
		},
		subscribeField: (name, listener) => {
			const listeners = fieldListeners.get(name) ?? new Set();
			listeners.add(listener);
			fieldListeners.set(name, listeners);

			return () => {
				listeners.delete(listener);
				if (listeners.size === 0) {
					fieldListeners.delete(name);
				}
			};
		},
		subscribeForm: (listener) => {
			formListeners.add(listener);
			return () => formListeners.delete(listener);
		},
		subscribeWatch: (names, listener) => {
			const subscriptionId = nextWatchId++;
			watchListeners.set(subscriptionId, { listener, names });
			return () => watchListeners.delete(subscriptionId);
		},
		touchField: (name) => {
			state.touched[name] = true;
			emit([name]);

			if (shouldValidate(name, 'blur')) {
				void validateField(name, 'blur');
			}
		},
		unregisterField: (name, override) => {
			const registration = registrations.get(name);

			if (!registration) {
				return;
			}

			const mountCount = registration.mountCount - 1;

			if (mountCount > 0) {
				registrations.set(name, {
					...registration,
					mountCount,
				});
				return;
			}

			const keepValue = override?.keepValueOnUnmount ?? registration.keepValueOnUnmount;
			const keepState = override?.keepStateOnUnmount ?? registration.keepStateOnUnmount;
			const keepError = override?.keepErrorOnUnmount ?? registration.keepErrorOnUnmount;
			registrations.delete(name);

			if (!keepValue) {
				state.values = deleteByPath(state.values, name);
				state.initialValues = deleteByPath(state.initialValues, name);
			}

			if (!keepState) {
				delete state.dirty[name];
				delete state.touched[name];
			}

			if (!keepError) {
				delete state.errors[name];
			}

			emit([name]);
		},
		validateField,
		validateForm,
	};
};
