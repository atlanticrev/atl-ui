import type { AvatarVariant } from './types';

type AvatarConfig = {
	backgroundColor: string;
	iconColor?: string;
	textColor?: string;
};

export const AVATAR_CONFIG: Record<AvatarVariant, Record<string, AvatarConfig>> = {
	beneficiary: {
		company: {
			backgroundColor: 'var(--md-sys-color-secondary-container)',
			iconColor: 'var(--md-sys-color-on-secondary-container)',
		},
		initials: {
			backgroundColor: 'var(--md-sys-color-secondary-container)',
			textColor: 'var(--md-sys-color-on-secondary-container)',
		},
		photo: {
			backgroundColor: 'transparent',
		},
	},
	company: {
		initials: {
			backgroundColor: 'var(--md-sys-color-primary-container)',
			textColor: 'var(--md-sys-color-on-primary-container)',
		},
		logo: {
			backgroundColor: 'var(--md-sys-color-primary-container)',
		},
	},
	user: {
		initials: {
			backgroundColor: 'var(--md-sys-color-primary)',
			textColor: 'var(--md-sys-color-on-primary)',
		},
		photo: {
			backgroundColor: 'transparent',
		},
	},
};
