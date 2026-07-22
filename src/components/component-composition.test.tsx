import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AtlBreadcrumbs } from './breadcrumbs';
import { AtlCheckbox } from './checkbox';
import { AtlChip } from './chip';
import { DesignSystemShowcase } from './design-system-showcase/showcase';
import { AtlDropdown } from './dropdown';
import { AtlFileUpload } from './file-upload';
import { AtlInput } from './input/input';
import { AtlModal } from './modal';
import { AtlSidebar } from './sidebar';

afterEach(cleanup);

describe('component composition', () => {
	it('uses an SVG for the checkbox indeterminate state', () => {
		const { container } = render(
			<AtlCheckbox
				indeterminate
				label="Partial selection"
			/>,
		);

		const control = container.querySelector('.atl-checkbox__control');

		expect(control?.querySelector('svg')).toBeInstanceOf(SVGSVGElement);

		expect(control?.textContent).not.toContain('—');
	});

	it('keeps an accessible name when Checkbox is used without a visible label', () => {
		const { getByRole } = render(<AtlCheckbox ariaLabel="Select all files" />);

		expect(getByRole('checkbox', { name: 'Select all files' })).toBeInstanceOf(HTMLInputElement);
	});

	it('reuses AtlButton for ordinary nested actions', () => {
		const onRemove = vi.fn();

		const { container } = render(
			<>
				<AtlBreadcrumbs
					items={[
						{ label: 'Library', onClick: vi.fn(), testId: 'breadcrumb' },
						{ label: 'Components', testId: 'current' },
					]}
				/>
				<AtlChip
					label="YouTube"
					testId="chip"
					withCross
					onRemove={onRemove}
				/>
				<AtlDropdown
					items={[{ label: 'YouTube', value: 'youtube' }]}
					multiSelect
					showFooter
					testId="dropdown"
					onSelectAll={vi.fn()}
				/>
				<AtlFileUpload label="Choose file" />
				<AtlInput
					iconRight={<span />}
					testId="input"
					onIconRightClick={vi.fn()}
				/>
				<AtlSidebar
					items={[{ icon: <span />, key: 'library', label: 'Library' }]}
					testId="sidebar"
				/>
			</>,
		);

		for (const selector of [
			'.atl-breadcrumbs__trigger',
			'.atl-chip__remove',
			'.atl-dropdown-list__select-all',
			'.atl-file-upload__button',
			'.atl-input__icon--clickable',
			'.atl-sidebar__item',
		]) {
			expect(container.querySelector(selector)?.classList.contains('atl-button')).toBe(true);
		}

		expect(container.querySelector('.atl-chip__remove')?.getAttribute('aria-label')).toBe('Remove YouTube');
	});

	it('reuses AtlButton for the default modal close action', () => {
		render(
			<AtlModal
				isOpen
				onClose={vi.fn()}
				testId="modal"
				title="Confirm"
			>
				Details
			</AtlModal>,
		);

		const close = document.querySelector('.atl-modal__close');

		expect(close?.classList.contains('atl-button')).toBe(true);

		expect(close?.getAttribute('aria-label')).toBe('Close');
	});

	it('builds the showcase from library primitives', () => {
		const { container, getAllByRole } = render(<DesignSystemShowcase />);

		expect(container.querySelector('.atl-breadcrumbs')).not.toBeNull();

		for (const checkbox of getAllByRole('checkbox')) {
			expect(checkbox.classList.contains('atl-checkbox__input')).toBe(true);
		}
	});
});
