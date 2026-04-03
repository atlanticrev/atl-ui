import type { SVGProps } from 'react';

type FolderLineIconProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

export const FolderLineIcon = ({ size = 20, ...props }: FolderLineIconProps): JSX.Element => {
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
					M2.75 6.25C2.75 5.42 3.42 4.75 4.25 4.75H7.26C7.67 4.75 8.06 4.92 8.34 5.21L9.05 5.91
					C9.33 6.2 9.72 6.37 10.13 6.37H15.75C16.58 6.37 17.25 7.04 17.25 7.87V13.75C17.25 14.58
					16.58 15.25 15.75 15.25H4.25C3.42 15.25 2.75 14.58 2.75 13.75V6.25Z
				`}
				stroke="currentColor"
				strokeLinejoin="round"
				strokeWidth="1.5"
			/>
		</svg>
	);
};
