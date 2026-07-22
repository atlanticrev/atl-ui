import type { SVGProps } from 'react';

export type MinusIconProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

export const MinusIcon = ({ size = 16, ...props }: MinusIconProps): JSX.Element => {
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
				d="M5 12H19"
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.5"
			/>
		</svg>
	);
};
