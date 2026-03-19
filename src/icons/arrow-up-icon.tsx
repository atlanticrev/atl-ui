import type { SVGProps } from 'react';

export type ArrowUpIconProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

export const ArrowUpIcon = ({ size = 16, ...props }: ArrowUpIconProps): JSX.Element => {
	return (
		<svg
			aria-hidden="true"
			focusable="false"
			fill="none"
			height={size}
			viewBox="0 0 16 16"
			width={size}
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M8 12V4M8 4L4.5 7.5M8 4L11.5 7.5"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.5"
			/>
		</svg>
	);
};
