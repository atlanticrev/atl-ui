import type { SVGProps } from 'react';

type FilterLinesIconProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

export const FilterLinesIcon = ({ size = 20, ...props }: FilterLinesIconProps): JSX.Element => {
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
				d="M3.5 5.5H16.5"
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.5"
			/>

			<path
				d="M6.5 10H13.5"
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.5"
			/>

			<path
				d="M8.5 14.5H11.5"
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.5"
			/>
		</svg>
	);
};
