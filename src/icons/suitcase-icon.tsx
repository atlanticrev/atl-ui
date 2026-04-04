import type { SVGProps } from 'react';

export type SuitcaseIconProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

export const SuitcaseIcon = ({ size = 24, ...props }: SuitcaseIconProps): JSX.Element => {
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
				d="M8 7V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1M5 9h14v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9Z"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.5"
			/>

			<path
				d="M5 11h14"
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.5"
			/>
		</svg>
	);
};
