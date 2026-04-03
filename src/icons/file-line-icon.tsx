import type { SVGProps } from 'react';

type FileLineIconProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

export const FileLineIcon = ({ size = 20, ...props }: FileLineIconProps): JSX.Element => {
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
					M6.25 3.75H10.44C10.84 3.75 11.22 3.91 11.5 4.19L13.81 6.5C14.09 6.78 14.25 7.16 14.25
					7.56V14.25C14.25 15.08 13.58 15.75 12.75 15.75H6.25C5.42 15.75 4.75 15.08 4.75 14.25V5.25
					C4.75 4.42 5.42 3.75 6.25 3.75Z
				`}
				stroke="currentColor"
				strokeLinejoin="round"
				strokeWidth="1.5"
			/>
			<path
				d="M10.75 3.98V6.75H13.52"
				stroke="currentColor"
				strokeLinejoin="round"
				strokeWidth="1.5"
			/>
			<path
				d="M7.25 10H11.75"
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.5"
			/>
			<path
				d="M7.25 12.75H10.25"
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.5"
			/>
		</svg>
	);
};
