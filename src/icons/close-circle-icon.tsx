import type { SVGProps } from 'react';

export type CloseCircleIconProps = SVGProps<SVGSVGElement> & {
	size?: 24 | 32;
};

export const CloseCircleIcon = ({ size = 24, ...props }: CloseCircleIconProps): JSX.Element => {
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
			<circle
				cx="12"
				cy="12"
				r="9"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<path
				d="M15 9L9 15M9 9L15 15"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.5"
			/>
		</svg>
	);
};
