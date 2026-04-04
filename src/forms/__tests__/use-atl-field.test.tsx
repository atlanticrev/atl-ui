import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { AtlFormProvider } from '../react/atl-form-provider';
import { useAtlField } from '../react/use-atl-field';
import { useAtlForm } from '../react/use-atl-form';

let firstFieldRenders = 0;
let secondFieldRenders = 0;

const FirstField = () => {
	firstFieldRenders += 1;
	const field = useAtlField<{ firstName: string; lastName: string }>('firstName');
	const handleClick = () => field.setValue('Ada');

	return <button type="button" onClick={handleClick}>{String(field.value || 'empty')}</button>;
};

const SecondField = () => {
	secondFieldRenders += 1;
	const field = useAtlField<{ firstName: string; lastName: string }>('lastName');

	return <span>{String(field.value || 'empty')}</span>;
};

const Harness = () => {
	const form = useAtlForm({
		defaultValues: {
			firstName: '',
			lastName: '',
		},
	});

	return (
		<AtlFormProvider form={form}>
			<FirstField />
			<SecondField />
		</AtlFormProvider>
	);
};

describe('useAtlField', () => {
	afterEach(() => {
		cleanup();
		firstFieldRenders = 0;
		secondFieldRenders = 0;
	});

	it('rerenders only the subscribed field when another field changes', () => {
		render(<Harness />);
		fireEvent.click(screen.getByRole('button'));

		expect(firstFieldRenders).toBe(2);
		expect(secondFieldRenders).toBe(1);
		expect(screen.getByText('empty')).not.toBeNull();
	});
});
