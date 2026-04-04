import type { SVGProps } from 'react';

type PieChartIconProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

export const PieChartIcon = ({ size = 20, ...props }: PieChartIconProps): JSX.Element => {
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
				d="M10 3.75V10H16.25C16.25 6.55 13.45 3.75 10 3.75Z"
				stroke="currentColor"
				strokeLinejoin="round"
				strokeWidth="1.5"
			/>

			<path
				d={`
					M8.75 5.02C5.88 5.57 3.75 8.1 3.75 11.12C3.75 14.54 6.52 17.31 9.94 17.31C12.96 17.31
					15.5 15.17 16.04 12.31H8.75V5.02Z
				`}
				stroke="currentColor"
				strokeLinejoin="round"
				strokeWidth="1.5"
			/>
		</svg>
	);
};
