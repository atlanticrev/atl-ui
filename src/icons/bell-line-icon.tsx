import type { SVGProps } from 'react';

type BellLineIconProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

export const BellLineIcon = ({ size = 20, ...props }: BellLineIconProps): JSX.Element => {
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
				d={`
					M10 4.25C7.93 4.25 6.25 5.93 6.25 8V9.7C6.25 10.2 6.1 10.68 5.82 11.09L4.75 12.75H15.25
					L14.18 11.09C13.9 10.68 13.75 10.2 13.75 9.7V8C13.75 5.93 12.07 4.25 10 4.25Z
				`}
				stroke="currentColor"
				strokeLinejoin="round"
				strokeWidth="1.5"
			/>
			<path
				d="M8.25 14.25C8.46 14.84 9.03 15.25 9.69 15.25H10.31C10.97 15.25 11.54 14.84 11.75 14.25"
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.5"
			/>
		</svg>
	);
};
