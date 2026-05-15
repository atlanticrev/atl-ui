import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { AtlSkeleton } from './index';

describe('AtlSkeleton', () => {
	afterEach(() => {
		cleanup();
	});

	it('renders children directly when loading is false', () => {
		render(
			<AtlSkeleton loading={false}>
				<div>Loaded content</div>
			</AtlSkeleton>,
		);

		expect(screen.getByText('Loaded content')).not.toBeNull();
		expect(document.querySelector('.atl-skeleton-wrapper')).toBeNull();
	});

	it('uses overlay mode by default when children are provided', () => {
		render(
			<AtlSkeleton>
				<div>Account row</div>
			</AtlSkeleton>,
		);

		expect(document.querySelector('.atl-skeleton-wrapper')).not.toBeNull();
		expect(document.querySelector('.atl-skeleton-wrapper__placeholder')).not.toBeNull();
		expect(document.querySelector('.atl-skeleton--overlay')).not.toBeNull();
	});

	it('renders a line skeleton instead of children for inline replacement', () => {
		render(
			<AtlSkeleton
				height={24}
				loading
				variant="line"
				width={120}
			>
				<h1>Title</h1>
			</AtlSkeleton>,
		);

		const skeleton = document.querySelector<HTMLElement>('.atl-skeleton--line');

		expect(skeleton).not.toBeNull();
		expect(screen.queryByText('Title')).toBeNull();
		expect(skeleton?.style.width).toBe('120px');
		expect(skeleton?.style.height).toBe('24px');
	});

	it('repeats children the requested number of times', () => {
		render(
			<AtlSkeleton.Repeat count={3}>
				<AtlSkeleton
					height={16}
					variant="line"
					width={80}
				/>
			</AtlSkeleton.Repeat>,
		);

		expect(document.querySelectorAll('.atl-skeleton--line')).toHaveLength(3);
	});
});
