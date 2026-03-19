import type { SVGProps } from 'react';

export type CrossIconProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

export const CrossIcon = ({ size = 10, ...props }: CrossIconProps): JSX.Element => {
	return (
		<svg
			aria-hidden="true"
			focusable="false"
			fill="none"
			height={size}
			viewBox="0 0 10 10"
			width={size}
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M9 9L1 1M1 9L9 1"
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.5"
			/>
		</svg>
	);
};
