import type { SVGProps } from 'react';

export type CheckIconProps = SVGProps<SVGSVGElement> & {
	size?: 16 | 24;
};

export const CheckIcon = ({ size = 24, ...props }: CheckIconProps): JSX.Element => {
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
				d="M5 12.5L9.5 17L19 7"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.5"
			/>
		</svg>
	);
};
