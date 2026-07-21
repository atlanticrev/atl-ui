export type StoryExample = {
	description?: string;
	markup: string;
	title: string;
	wide?: boolean;
};

export type StoryDefinition = {
	examples: readonly StoryExample[];
	group: 'Behavioral' | 'Complex' | 'Native CSS';
	id: string;
	setup?: (root: HTMLElement) => void;
	summary: string;
	title: string;
};
