export type AvatarDom = {
	icon: HTMLSpanElement;
	image: HTMLImageElement;
	initials: HTMLSpanElement;
	loader: HTMLSpanElement;
};

export const createAvatarDom = (host: HTMLElement): AvatarDom => {
	const image = host.ownerDocument.createElement('img');

	const icon = host.ownerDocument.createElement('span');

	const initials = host.ownerDocument.createElement('span');

	const loader = host.ownerDocument.createElement('span');

	image.className = 'alt-avatar__image';

	icon.className = 'alt-avatar__icon';

	initials.className = 'alt-avatar__initials';

	loader.className = 'alt-avatar__loader';

	loader.setAttribute('aria-hidden', 'true');

	host.replaceChildren(image, icon, initials, loader);

	return {
		icon,
		image,
		initials,
		loader,
	};
};

export const normalizeInitials = (value: string): string => {
	const words = value.trim().split(/\s+/).filter(Boolean);

	const initials = words.length > 1 ? words.map((word) => word[0]).join('') : (words[0] ?? '').slice(0, 3);

	return initials.slice(0, 3).toUpperCase();
};
