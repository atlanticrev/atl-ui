import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { AtlAutocomplete } from './autocomplete';
import { AtlButton } from './button';
import { AtlCheckbox } from './checkbox';
import { AtlChip } from './chip';
import { AtlInput } from './input/input';
import { AtlModal } from './modal';
import { AtlSelect } from './select';
import { AtlSwitcher } from './switcher';
import { AtlTabs } from './tabs';
import { AtlToastProvider, useAtlToast } from './toast-provider';

const options = [
	{ value: 'figma', label: 'Figma' },
	{ value: 'notion', label: 'Notion' },
	{ value: 'linear', label: 'Linear' },
];

const ToastButtons = () => {
	const { enqueueToast } = useAtlToast();

	return (
		<div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
			<AtlButton onClick={() => enqueueToast('Saved changes', { variant: 'success' })}>Success toast</AtlButton>
			<AtlButton variant="outlined" onClick={() => enqueueToast('Network issue', { variant: 'error' })}>Error toast</AtlButton>
		</div>
	);
};

const Showcase = () => {
	const [inputValue, setInputValue] = useState('Material 3');
	const [selectValue, setSelectValue] = useState('figma');
	const [autocompleteValue, setAutocompleteValue] = useState<string | undefined>('notion');
	const [checkboxValue, setCheckboxValue] = useState(true);
	const [switcherValue, setSwitcherValue] = useState(true);
	const [tabKey, setTabKey] = useState('overview');
	const [modalOpen, setModalOpen] = useState(false);

	return (
		<AtlToastProvider>
			<div style={{ display: 'grid', gap: 24, maxWidth: 760 }}>
				<section style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
					<AtlButton variant="filled">Filled</AtlButton>
					<AtlButton variant="tonal">Tonal</AtlButton>
					<AtlButton variant="outlined">Outlined</AtlButton>
					<AtlButton variant="text">Text</AtlButton>
					<AtlButton variant="elevated">Elevated</AtlButton>
				</section>

				<section style={{ display: 'grid', gap: 16 }}>
					<AtlInput label="Project name" testId="showcase-input" value={inputValue} onChange={setInputValue} />
					<AtlSelect label="Workspace" options={options} testId="showcase-select" value={selectValue} onChange={setSelectValue} />
					<AtlAutocomplete label="Search tool" options={options} testId="showcase-autocomplete" value={autocompleteValue} onChange={setAutocompleteValue} />
				</section>

				<section style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
					<AtlCheckbox checked={checkboxValue} label="Notifications" testId="showcase-checkbox" onChange={setCheckboxValue} />
					<AtlSwitcher checked={switcherValue} testId="showcase-switcher" onChange={setSwitcherValue} />
					<AtlChip label="Tonal chip" testId="showcase-chip" variant="frozen" />
				</section>

				<section>
					<AtlTabs
						activeKey={tabKey}
						items={[
							{ key: 'overview', label: 'Overview', children: <div>Overview content</div> },
							{ key: 'settings', label: 'Settings', children: <div>Settings content</div> },
						]}
						testId="showcase-tabs"
						onChange={setTabKey}
					/>
				</section>

				<section style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
					<AtlButton onClick={() => setModalOpen(true)}>Open dialog</AtlButton>
					<ToastButtons />
				</section>
			</div>

			<AtlModal isOpen={modalOpen} testId="showcase-modal" title="Confirm action" onClose={() => setModalOpen(false)}>
				Dialog content
			</AtlModal>
		</AtlToastProvider>
	);
};

const meta: Meta = {
	title: 'Material 3/Showcase',
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;

export const Overview: StoryObj = {
	render: () => <Showcase />,
};
