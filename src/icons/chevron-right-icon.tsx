import type { SVGProps } from 'react';

type ChevronRightIconProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

export const ChevronRightIcon = ({ size = 20, ...props }: ChevronRightIconProps): JSX.Element => {
	return (
		<svg
			aria-hidden="true"
			focusable="false"
			fill="none"
			height={size}
			viewBox="0 0 20 20"
			width={size}
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M7.75 5.5L12.25 10L7.75 14.5"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.5"
			/>
		</svg>
	);
};
