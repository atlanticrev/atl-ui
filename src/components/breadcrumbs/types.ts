export type BreadcrumbItem = {
	label: string;
	onClick?: () => void;
	testId: string;
};

export type AtlBreadcrumbsProps = {
	className?: string;
	items: BreadcrumbItem[];
};
