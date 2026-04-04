import { useState } from 'react';

import { AtlButton } from '@/components/button';
import { AtlFormProvider } from '@/forms/react/atl-form-provider';
import { useAtlForm } from '@/forms/react/use-atl-form';
import { useAtlFormState } from '@/forms/react/use-atl-form-state';
import { useAtlInputBinding } from '@/forms/bindings/use-atl-input-binding';
import { AtlInput } from '@/components/input/input';

import type { AtlResolver } from '@/forms/core/types';

type LoginFormValues = {
	email: string;
	password: string;
};

const EMAIL_PATTERN = /\S+@\S+\.\S+/;
const SUBMIT_DELAY_MS = 600;

const sleep = (timeout: number) =>
	new Promise((resolve) => window.setTimeout(resolve, timeout));

const loginResolver: AtlResolver<LoginFormValues> = async (values) => {
	const errors: Record<string, { message: string }> = {};

	if (!values.email.trim()) {
		errors.email = { message: 'Email is required.' };
	} else if (!EMAIL_PATTERN.test(values.email)) {
		errors.email = { message: 'Enter a valid email.' };
	}

	if (!values.password.trim()) {
		errors.password = { message: 'Password is required.' };
	} else if (values.password.length < 8) {
		errors.password = { message: 'Password must be at least 8 characters.' };
	}

	return errors;
};

const LoginFields = () => {
	const email = useAtlInputBinding<LoginFormValues>('email');
	const password = useAtlInputBinding<LoginFormValues>('password');

	return (
		<div style={{ display: 'grid', gap: '1rem' }}>
			<AtlInput {...email.inputProps} autoComplete="email" label="Email" testId="login-email" />

			<AtlInput
				{...password.inputProps}
				autoComplete="current-password"
				label="Password"
				testId="login-password"
				type="password"
			/>
		</div>
	);
};

export const LoginFormDemo = () => {
	const [submittedValues, setSubmittedValues] = useState<LoginFormValues | null>(null);
	const form = useAtlForm<LoginFormValues>({
		defaultValues: {
			email: '',
			password: '',
		},
		resolver: loginResolver,
		revalidateMode: 'onChange',
		validateMode: 'onBlur',
	});
	const isSubmitting = useAtlFormState(form, (state) => state.isSubmitting);
	const isValid = useAtlFormState(form, (state) => state.isValid);
	const submitCount = useAtlFormState(form, (state) => state.submitCount);
	const handleSubmit = form.handleSubmit(async (values) => {
		await sleep(SUBMIT_DELAY_MS);
		setSubmittedValues(values);
	});
	const handleReset = () => {
		form.reset({
			email: '',
			password: '',
		});
		setSubmittedValues(null);
	};

	return (
		<AtlFormProvider form={form}>
			<form style={{ width: '22rem', display: 'grid', gap: '1rem' }} onSubmit={handleSubmit}>
				<LoginFields />

				<div style={{ display: 'flex', gap: '0.75rem' }}>
					<AtlButton loading={isSubmitting} type="submit" variant="filled">
						Log in
					</AtlButton>

					<AtlButton type="button" variant="outlined" onClick={handleReset}>
						Reset
					</AtlButton>
				</div>

				<div style={{ color: 'var(--atl-color-ink-muted)', fontSize: '0.875rem' }}>
					isValid: {String(isValid)} | submitCount: {submitCount}
				</div>

				{submittedValues && (
					<pre
						style={{
							background: 'var(--atl-color-surface)',
							border: '1px solid var(--atl-color-border)',
							borderRadius: 'var(--atl-radius-sm)',
							fontSize: '0.875rem',
							margin: 0,
							padding: '0.875rem',
						}}
					>
						{JSON.stringify(submittedValues, null, 2)}
					</pre>
				)}
			</form>
		</AtlFormProvider>
	);
};
