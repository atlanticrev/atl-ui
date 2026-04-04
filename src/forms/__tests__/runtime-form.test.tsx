import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AtlButton } from '@/components/button';

import { AtlRuntimeForm } from '../runtime/atl-runtime-form';

describe('AtlRuntimeForm', () => {
	afterEach(() => {
		cleanup();
	});

	it('validates runtime schema rules and submits when values are valid', async () => {
		const user = userEvent.setup();
		const handleSubmit = vi.fn();

		render(
			<AtlRuntimeForm
				onSubmit={handleSubmit}
				renderActions={() => <AtlButton type="submit">Submit</AtlButton>}
				schema={{
					fields: [
						{
							label: 'Email',
							name: 'email',
							rules: [{ type: 'required' }, { type: 'email' }],
							type: 'input',
						},
					],
					validateMode: 'onSubmit',
				}}
			/>,
		);

		await user.click(screen.getByRole('button', { name: 'Submit' }));
		expect(await screen.findByText('Email is required.')).not.toBeNull();

		await user.type(screen.getByLabelText('Email'), 'hello@atlanticrev.com');
		await user.click(screen.getByRole('button', { name: 'Submit' }));

		expect(handleSubmit).toHaveBeenCalledWith({
			email: 'hello@atlanticrev.com',
		});
	});
});
