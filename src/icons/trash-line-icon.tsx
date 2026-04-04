import type { SVGProps } from 'react';

type TrashLineIconProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

export const TrashLineIcon = ({ size = 20, ...props }: TrashLineIconProps): JSX.Element => {
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
				d="M4.75 5.5H15.25"
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.5"
			/>

			<path
				d="M7.25 5.5V4.75C7.25 4.2 7.7 3.75 8.25 3.75H11.75C12.3 3.75 12.75 4.2 12.75 4.75V5.5"
				stroke="currentColor"
				strokeLinejoin="round"
				strokeWidth="1.5"
			/>

			<path
				d="M6.25 7.5V13C6.25 14.24 7.26 15.25 8.5 15.25H11.5C12.74 15.25 13.75 14.24 13.75 13V7.5"
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.5"
			/>

			<path
				d="M8.5 8.75V12.5"
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.5"
			/>

			<path
				d="M11.5 8.75V12.5"
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.5"
			/>
		</svg>
	);
};
