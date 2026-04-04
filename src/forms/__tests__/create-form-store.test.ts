import { describe, expect, it } from 'vitest';

import { createFormStore } from '../core/create-form-store';

describe('createFormStore', () => {
	it('tracks dirty state and touched state per field', () => {
		const form = createFormStore({
			defaultValues: {
				email: '',
			},
		});

		form.registerField('email');
		form.setValue('email', 'hello@atlanticrev.com');
		form.touchField('email');

		const field = form.getFieldState('email');

		expect(field.dirty).toBe(true);
		expect(field.touched).toBe(true);
		expect(field.value).toBe('hello@atlanticrev.com');
	});

	it('drops unmounted values when keepValueOnUnmount is disabled', () => {
		const form = createFormStore({
			defaultValues: {},
		});

		form.registerField('profile.email', {
			defaultValue: 'draft@atlanticrev.com',
			keepValueOnUnmount: false,
		});
		form.unregisterField('profile.email', {
			keepValueOnUnmount: false,
		});

		expect(form.getValue('profile.email')).toBeUndefined();
	});
});
