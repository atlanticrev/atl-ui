import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
	it('renders children', () => {
		render(<Button>Click me</Button>);
		expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
	});

	it('applies variant class', () => {
		render(<Button variant="secondary">Save</Button>);
		expect(screen.getByRole('button', { name: 'Save' })).toHaveClass('ui-button--secondary');
	});
});
