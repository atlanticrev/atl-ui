import type { SVGProps } from 'react';

export type ChevronDownIconProps = SVGProps<SVGSVGElement> & {
	size?: 16 | 24;
};

export const ChevronDownIcon = ({ size = 24, ...props }: ChevronDownIconProps): JSX.Element => {
	return (
		<svg
			aria-hidden="true"
			focusable="false"
			fill="none"
			height={size}
			viewBox="0 0 24 24"
			width={size}
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M6 9L12 15L18 9"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.5"
			/>
		</svg>
	);
};
