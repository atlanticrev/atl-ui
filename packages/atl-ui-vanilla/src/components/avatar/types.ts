export type AltAvatarShape = 'circle' | 'square';

export type AltAvatarErrorDetail = {
	source: string;
};

export type AltAvatarElementApi = HTMLElement & {
	alt: string;
	icon: Node | null;
	initials: string;
	shape: AltAvatarShape;
	size: number;
	src: string;
};
