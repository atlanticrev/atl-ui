import type { SvgIconComponent } from '@/components/circle-icon/types';

export type AvatarVariant = 'company' | 'beneficiary' | 'user';
export type CompanyAvatarType = 'logo' | 'initials';
export type BeneficiaryAvatarType = 'photo' | 'initials' | 'company';
export type UserAvatarType = 'photo' | 'initials';
export type AvatarType = CompanyAvatarType | BeneficiaryAvatarType | UserAvatarType;
export type AvatarSize = 24 | 32 | 40 | 48 | 64;

export type AtlAvatarProps = {
	backgroundColor?: string;
	className?: string;
	fullName: string;
	imageUrl?: string;
	initials?: string;
	logoIcon?: SvgIconComponent;
	size?: AvatarSize;
	type: AvatarType;
	variant: AvatarVariant;
};
